import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/demo";
import { DEMO_CREDIT_REPORT } from "@/lib/demo/data";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(DEMO_CREDIT_REPORT);
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await prisma.creditReport.findFirst({
    where: { userId: session.userId },
    orderBy: { fetchedAt: "desc" },
    include: { loanAccounts: true },
  });

  if (!report) {
    return NextResponse.json({ error: "No credit report found" }, { status: 404 });
  }

  // Get parsed summary which has inquiries data
  const parsed = report.parsedSummary as Record<string, unknown> | null;

  return NextResponse.json({
    creditScore: report.creditScore,
    reportDate: report.fetchedAt,
    accounts: report.loanAccounts.map((a) => ({
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
      disbursementDate: a.disbursementDate,
      daysPastDue: a.daysPastDue,
      accountStatus: a.accountStatus,
      creditLimit: a.creditLimit ? Number(a.creditLimit) : null,
      currentBalance: a.currentBalance ? Number(a.currentBalance) : null,
      utilizationPct: a.utilizationPct ? Number(a.utilizationPct) : null,
      paymentHistory: a.paymentHistory,
    })),
    inquiries: (parsed?.inquiries as Array<Record<string, string>>) || [],
  });
}
