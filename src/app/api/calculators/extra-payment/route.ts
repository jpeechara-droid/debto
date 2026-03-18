import { NextRequest, NextResponse } from "next/server";

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { outstandingBalance, interestRate, currentEMI, extraPayment } = body;

    // Validate inputs
    if (!outstandingBalance || outstandingBalance <= 0) {
      return NextResponse.json(
        { error: "Invalid outstanding balance" },
        { status: 400 }
      );
    }

    if (!interestRate || interestRate < 0 || interestRate > 50) {
      return NextResponse.json(
        { error: "Interest rate must be between 0 and 50" },
        { status: 400 }
      );
    }

    if (!currentEMI || currentEMI <= 0) {
      return NextResponse.json(
        { error: "Invalid EMI amount" },
        { status: 400 }
      );
    }

    if (extraPayment === undefined || extraPayment < 0) {
      return NextResponse.json(
        { error: "Extra payment must be 0 or positive" },
        { status: 400 }
      );
    }

    const monthlyRate = interestRate / 12 / 100;

    // Calculate current schedule
    const currentSchedule = calculateAmortization(
      outstandingBalance,
      monthlyRate,
      currentEMI,
      0
    );

    // Calculate optimized schedule (with extra payment)
    const optimizedSchedule = calculateAmortization(
      outstandingBalance,
      monthlyRate,
      currentEMI,
      extraPayment
    );

    const monthsSaved = currentSchedule.length - optimizedSchedule.length;

    const currentTotalInterest = currentSchedule.reduce(
      (sum, row) => sum + row.interest,
      0
    );
    const optimizedTotalInterest = optimizedSchedule.reduce(
      (sum, row) => sum + row.interest,
      0
    );
    const interestSaved = Math.max(0, currentTotalInterest - optimizedTotalInterest);

    const now = new Date();
    const currentPayoffDate = new Date(now);
    currentPayoffDate.setMonth(
      currentPayoffDate.getMonth() + currentSchedule.length
    );
    const optimizedPayoffDate = new Date(now);
    optimizedPayoffDate.setMonth(
      optimizedPayoffDate.getMonth() + optimizedSchedule.length
    );

    // Generate projection points for chart (sample every N months)
    const maxMonths = currentSchedule.length;
    const step = Math.max(1, Math.floor(maxMonths / 20));

    const projectionCurrent = currentSchedule
      .filter((_, i) => i % step === 0 || i === currentSchedule.length - 1)
      .map((row) => ({ month: row.month, balance: Math.round(row.balance) }));

    const projectionOptimized = optimizedSchedule
      .filter(
        (_, i) => i % step === 0 || i === optimizedSchedule.length - 1
      )
      .map((row) => ({ month: row.month, balance: Math.round(row.balance) }));

    return NextResponse.json({
      success: true,
      current: {
        totalMonths: currentSchedule.length,
        payoffDate: currentPayoffDate.toISOString(),
        totalInterest: Math.round(currentTotalInterest),
        totalPaid: Math.round(outstandingBalance + currentTotalInterest),
      },
      optimized: {
        totalMonths: optimizedSchedule.length,
        payoffDate: optimizedPayoffDate.toISOString(),
        totalInterest: Math.round(optimizedTotalInterest),
        totalPaid: Math.round(
          outstandingBalance + optimizedTotalInterest
        ),
      },
      impact: {
        monthsSaved,
        interestSaved: Math.round(interestSaved),
        newPayoffDate: optimizedPayoffDate.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        }),
      },
      projectionCurrent,
      projectionOptimized,
      amortizationSchedule: optimizedSchedule.slice(0, 60), // First 5 years
    });
  } catch (error) {
    console.error("Extra payment calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate" },
      { status: 500 }
    );
  }
}

function calculateAmortization(
  principal: number,
  monthlyRate: number,
  emi: number,
  extraPayment: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let month = 0;
  const maxMonths = 600; // 50 year cap

  while (balance > 0.01 && month < maxMonths) {
    month++;
    const interest = balance * monthlyRate;
    const totalPayment = Math.min(emi + extraPayment, balance + interest);
    const principalPortion = totalPayment - interest;
    balance = Math.max(0, balance - principalPortion);

    schedule.push({
      month,
      emi: Math.round(totalPayment),
      principal: Math.round(principalPortion),
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  return schedule;
}
