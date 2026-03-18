import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/demo";
import { DEMO_AI_ANALYSIS } from "@/lib/demo/data";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(DEMO_AI_ANALYSIS);
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get latest analysis with user info
  const analysis = await prisma.aiAnalysisReport.findFirst({
    where: { userId: session.userId },
    orderBy: { generatedAt: "desc" },
    include: {
      user: { select: { fullName: true, monthlyIncome: true } },
    },
  });

  if (!analysis) {
    return NextResponse.json({ error: "No analysis found" }, { status: 404 });
  }

  return NextResponse.json({
    id: analysis.id,
    generatedFor: analysis.user.fullName || "User",
    generatedAt: analysis.generatedAt,
    debtSnapshot: analysis.debtSnapshot,
    debtFreeTimeline: analysis.debtFreeTimeline,
    repaymentStrategies: analysis.repaymentStrategies,
    extraPaymentImpact: analysis.extraPaymentImpact,
    refinancingAnalysis: analysis.refinancingAnalysis,
    creditHealth: analysis.creditHealth,
    narrativeText: analysis.narrativeText,
    monthlyIncome: analysis.user.monthlyIncome
      ? Number(analysis.user.monthlyIncome)
      : null,
  });
}
