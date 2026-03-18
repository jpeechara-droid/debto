import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/demo";
import { DEMO_DASHBOARD } from "@/lib/demo/data";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(DEMO_DASHBOARD);
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user with latest credit report and loan accounts
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      creditReports: {
        orderBy: { fetchedAt: "desc" },
        take: 1,
        include: {
          loanAccounts: true,
        },
      },
      aiAnalysisReports: {
        orderBy: { generatedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const latestReport = user.creditReports[0] || null;
  const latestAnalysis = user.aiAnalysisReports[0] || null;
  const loanAccounts = latestReport?.loanAccounts || [];

  // Calculate summary
  const totalDebt = loanAccounts.reduce(
    (sum, a) => sum + Number(a.outstandingBalance || 0),
    0
  );
  const monthlyEMI = loanAccounts.reduce(
    (sum, a) => sum + Number(a.emiAmount || 0),
    0
  );
  const activeLoans = loanAccounts.filter(
    (a) => a.accountStatus === "ACTIVE" || a.accountStatus === "OVERDUE"
  );

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.fullName,
      phone: user.phone,
      email: user.email,
      city: user.city,
      monthlyIncome: user.monthlyIncome ? Number(user.monthlyIncome) : null,
      avatarUrl: user.avatarUrl,
    },
    creditScore: latestReport?.creditScore || null,
    reportId: latestReport?.id || null,
    reportDate: latestReport?.fetchedAt || null,
    parsedSummary: latestReport?.parsedSummary || null,
    totalDebt,
    monthlyEMI,
    activeLoansCount: activeLoans.length,
    loanAccounts: loanAccounts.map((a) => ({
      id: a.id,
      accountNumber: a.accountNumber,
      institution: a.institution,
      loanType: a.loanType,
      sanctionedAmount: Number(a.sanctionedAmount || 0),
      outstandingBalance: Number(a.outstandingBalance || 0),
      emiAmount: Number(a.emiAmount || 0),
      interestRate: Number(a.interestRate || 0),
      tenureMonths: a.tenureMonths,
      tenureRemaining: a.tenureRemaining,
      daysPastDue: a.daysPastDue,
      accountStatus: a.accountStatus,
      creditLimit: a.creditLimit ? Number(a.creditLimit) : null,
      currentBalance: a.currentBalance ? Number(a.currentBalance) : null,
      utilizationPct: a.utilizationPct ? Number(a.utilizationPct) : null,
      paymentHistory: a.paymentHistory,
    })),
    analysis: latestAnalysis
      ? {
          id: latestAnalysis.id,
          debtSnapshot: latestAnalysis.debtSnapshot,
          debtFreeTimeline: latestAnalysis.debtFreeTimeline,
          repaymentStrategies: latestAnalysis.repaymentStrategies,
          narrativeText: latestAnalysis.narrativeText,
        }
      : null,
  });
}
