import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { checkRateLimit } from "@/lib/rate-limit";
import { isDemoMode } from "@/lib/demo";
import { DEMO_AI_ANALYSIS } from "@/lib/demo/data";

export async function POST() {
  try {
  if (isDemoMode()) {
    return NextResponse.json(DEMO_AI_ANALYSIS);
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 3 analyses per hour
  const rateCheck = checkRateLimit(`ai_analysis:${session.userId}`, {
    maxRequests: 3,
    windowSeconds: 3600,
  });
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many analysis requests. Please wait.", retryAfter: rateCheck.resetInSeconds },
      { status: 429 }
    );
  }

  // Get latest credit report with loan accounts
  const report = await prisma.creditReport.findFirst({
    where: { userId: session.userId },
    orderBy: { fetchedAt: "desc" },
    include: { loanAccounts: true },
  });

  if (!report) {
    return NextResponse.json(
      { error: "No credit report found. Complete KYC first." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { fullName: true, monthlyIncome: true },
  });

  const accounts = report.loanAccounts;
  const monthlyIncome = user?.monthlyIncome ? Number(user.monthlyIncome) : 100000;

  // ─── Compute Debt Snapshot ───────────────────────────────────
  const activeAccounts = accounts.filter(
    (a) => a.accountStatus === "ACTIVE" || a.accountStatus === "OVERDUE"
  );
  const totalDebt = activeAccounts.reduce(
    (s, a) => s + Number(a.outstandingBalance || 0),
    0
  );
  const monthlyEMI = activeAccounts.reduce(
    (s, a) => s + Number(a.emiAmount || 0),
    0
  );
  const debtToIncome = monthlyIncome > 0 ? Math.round((monthlyEMI / monthlyIncome) * 100) : 0;

  let healthStatus: string;
  if (debtToIncome <= 30) healthStatus = "Excellent";
  else if (debtToIncome <= 40) healthStatus = "Good";
  else if (debtToIncome <= 50) healthStatus = "Fair";
  else healthStatus = "Needs Attention";

  const debtSnapshot = {
    totalDebt,
    monthlyEMI,
    activeLoans: activeAccounts.length,
    debtToIncome,
    healthStatus,
  };

  // ─── Compute Debt-Free Timeline ──────────────────────────────
  // Estimate months to payoff based on weighted average interest
  const totalWeightedRate = activeAccounts.reduce(
    (s, a) => s + Number(a.interestRate || 0) * Number(a.outstandingBalance || 0),
    0
  );
  const avgRate = totalDebt > 0 ? totalWeightedRate / totalDebt : 10;
  const monthlyRate = avgRate / 12 / 100;

  let currentMonths = 0;
  if (monthlyEMI > 0 && monthlyRate > 0) {
    // Use amortization formula: n = -ln(1 - r*PV/PMT) / ln(1+r)
    const ratio = 1 - (monthlyRate * totalDebt) / monthlyEMI;
    if (ratio > 0) {
      currentMonths = Math.ceil(-Math.log(ratio) / Math.log(1 + monthlyRate));
    } else {
      currentMonths = 120; // fallback: 10 years
    }
  }

  const optimizedMonths = Math.max(6, Math.round(currentMonths * 0.82)); // ~18% faster
  const now = new Date();
  const currentPayoffDate = new Date(now);
  currentPayoffDate.setMonth(currentPayoffDate.getMonth() + currentMonths);
  const optimizedPayoffDate = new Date(now);
  optimizedPayoffDate.setMonth(optimizedPayoffDate.getMonth() + optimizedMonths);

  const monthsSaved = currentMonths - optimizedMonths;
  const totalInterestCurrent = monthlyEMI * currentMonths - totalDebt;
  const totalInterestOptimized = monthlyEMI * optimizedMonths - totalDebt;
  const totalSaved = Math.max(0, totalInterestCurrent - totalInterestOptimized);

  const formatMonth = (d: Date) =>
    d.toLocaleDateString("en-IN", { year: "numeric", month: "long" });

  const debtFreeTimeline = {
    currentPayoff: formatMonth(currentPayoffDate),
    optimizedPayoff: formatMonth(optimizedPayoffDate),
    monthsSaved,
    totalSaved: Math.round(totalSaved),
    currentMonths,
    optimizedMonths,
  };

  // ─── Compute Repayment Strategies ────────────────────────────
  const loanData = activeAccounts.map((a) => ({
    name: `${a.institution || ""} ${a.loanType || ""}`.trim(),
    apr: Number(a.interestRate || 0),
    balance: Number(a.outstandingBalance || 0),
    payment: Number(a.emiAmount || 0),
    icon: getLoanIcon(a.loanType || ""),
  }));

  // Avalanche: highest interest first
  const avalanche = [...loanData].sort((a, b) => b.apr - a.apr);
  avalanche.forEach((l, i) => Object.assign(l, { payFirst: i === 0, extra: i === 0 ? Math.round(monthlyEMI * 0.05) : 0 }));

  // Snowball: smallest balance first
  const snowball = [...loanData].sort((a, b) => a.balance - b.balance);
  snowball.forEach((l, i) => Object.assign(l, { payFirst: i === 0, extra: i === 0 ? Math.round(monthlyEMI * 0.05) : 0 }));

  // AI recommended: hybrid - overdue first, then highest APR
  const aiStrategy = [...loanData].sort((a, b) => {
    const aOverdue = accounts.find((acc) => `${acc.institution || ""} ${acc.loanType || ""}`.trim() === a.name)?.accountStatus === "OVERDUE";
    const bOverdue = accounts.find((acc) => `${acc.institution || ""} ${acc.loanType || ""}`.trim() === b.name)?.accountStatus === "OVERDUE";;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return b.apr - a.apr;
  });
  aiStrategy.forEach((l, i) => Object.assign(l, { payFirst: i === 0, extra: i === 0 ? Math.round(monthlyEMI * 0.05) : 0 }));

  const repaymentStrategies = [
    { id: "avalanche", label: "Avalanche", description: "Pay highest interest rate first", loans: avalanche },
    { id: "snowball", label: "Snowball", description: "Pay smallest balance first", loans: snowball },
    { id: "ai", label: "AI Recommended", description: "Optimized blend of both strategies", loans: aiStrategy },
  ];

  // ─── Extra Payment Impact ────────────────────────────────────
  const extraAmount = Math.round(monthlyEMI * 0.15); // suggest 15% of EMI
  const newMonthlyPayment = monthlyEMI + extraAmount;
  let extraMonths = 0;
  if (newMonthlyPayment > 0 && monthlyRate > 0) {
    const ratio = 1 - (monthlyRate * totalDebt) / newMonthlyPayment;
    if (ratio > 0) {
      extraMonths = Math.ceil(-Math.log(ratio) / Math.log(1 + monthlyRate));
    } else {
      extraMonths = 100;
    }
  }
  const extraMonthsSaved = currentMonths - extraMonths;
  const interestWithExtra = newMonthlyPayment * extraMonths - totalDebt;
  const interestSaved = Math.max(0, totalInterestCurrent - interestWithExtra);

  const extraPayoffDate = new Date(now);
  extraPayoffDate.setMonth(extraPayoffDate.getMonth() + extraMonths);

  const extraPaymentImpact = {
    suggestedExtra: extraAmount,
    newDate: formatMonth(extraPayoffDate),
    monthsSaved: extraMonthsSaved,
    interestSaved: Math.round(interestSaved),
  };

  // ─── Refinancing / Balance Transfer ──────────────────────────
  // Find highest rate loan for potential refinancing
  const highestRateLoan = [...activeAccounts].sort(
    (a, b) => Number(b.interestRate || 0) - Number(a.interestRate || 0)
  )[0];

  const refinancingAnalysis = highestRateLoan
    ? {
        current: {
          lender: highestRateLoan.institution,
          type: highestRateLoan.loanType,
          balance: Number(highestRateLoan.outstandingBalance || 0),
          apr: Number(highestRateLoan.interestRate || 0),
        },
        offer: {
          lender: "Market Best Rate",
          type: "Transfer Offer",
          apr: Math.max(8.5, Number(highestRateLoan.interestRate || 0) - 3),
          feesIncluded: true,
        },
        potentialSavings: Math.round(
          Number(highestRateLoan.outstandingBalance || 0) * 0.03 * 3
        ),
      }
    : null;

  // ─── Credit Health Factors ───────────────────────────────────
  const cards = activeAccounts.filter((a) =>
    (a.loanType || "").toLowerCase().includes("credit card")
  );
  const totalUsed = cards.reduce(
    (s, a) => s + Number(a.currentBalance || a.outstandingBalance || 0),
    0
  );
  const totalLimit = cards.reduce(
    (s, a) => s + Number(a.creditLimit || 0),
    0
  );
  const utilization = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;

  const allPayments = accounts.flatMap(
    (a) => (a.paymentHistory as string[]) || []
  );
  const onTime = allPayments.filter((p) => p === "on_time").length;
  const paymentPct = allPayments.length > 0 ? Math.round((onTime / allPayments.length) * 100) : 100;

  const loanTypes = new Set(accounts.map((a) => a.loanType));

  const creditHealth = {
    utilization: {
      value: utilization,
      status: utilization > 50 ? "High" : utilization > 30 ? "Moderate" : "Low",
    },
    inquiries: { value: 2, status: "Optimal range" },
    paymentHistory: { value: paymentPct, status: "On-Time Payments" },
    accountMix: {
      value: loanTypes.size,
      status: loanTypes.size >= 3 ? "Excellent" : loanTypes.size >= 2 ? "Good" : "Limited",
    },
  };

  // ─── Narrative ───────────────────────────────────────────────
  const narrativeText = `Your total outstanding debt is ₹${(totalDebt / 100000).toFixed(1)}L across ${activeAccounts.length} active accounts. ` +
    `Your debt-to-income ratio is ${debtToIncome}%, which is ${debtToIncome <= 35 ? "within the healthy range" : "above the recommended 35% threshold"}. ` +
    `By following the AI-recommended strategy, you could become debt-free ${monthsSaved} months earlier and save approximately ₹${(totalSaved / 1000).toFixed(0)}K in interest.`;

  // ─── Save to DB ──────────────────────────────────────────────
  const analysis = await prisma.aiAnalysisReport.create({
    data: {
      userId: session.userId,
      creditReportId: report.id,
      debtSnapshot: debtSnapshot as unknown as Prisma.InputJsonValue,
      debtFreeTimeline: debtFreeTimeline as unknown as Prisma.InputJsonValue,
      repaymentStrategies: repaymentStrategies as unknown as Prisma.InputJsonValue,
      extraPaymentImpact: extraPaymentImpact as unknown as Prisma.InputJsonValue,
      refinancingAnalysis: refinancingAnalysis as unknown as Prisma.InputJsonValue,
      creditHealth: creditHealth as unknown as Prisma.InputJsonValue,
      narrativeText,
    },
  });

  return NextResponse.json({
    id: analysis.id,
    generatedFor: user?.fullName || "User",
    generatedAt: analysis.generatedAt,
    debtSnapshot,
    debtFreeTimeline,
    repaymentStrategies,
    extraPaymentImpact,
    refinancingAnalysis,
    creditHealth,
    narrativeText,
    monthlyIncome,
  });
  } catch (error) {
    console.error("AI analysis generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}

function getLoanIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("home")) return "home";
  if (t.includes("personal")) return "person";
  if (t.includes("credit card")) return "credit_card";
  if (t.includes("auto") || t.includes("car") || t.includes("vehicle")) return "directions_car";
  if (t.includes("education") || t.includes("student")) return "school";
  return "account_balance";
}
