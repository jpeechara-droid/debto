import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      currentBalance,
      currentAPR,
      currentEMI,
      transferAPR,
      transferFeePercent = 2,
      tenureMonths,
    } = body;

    // Validate inputs
    if (!currentBalance || currentBalance <= 0) {
      return NextResponse.json(
        { error: "Invalid balance" },
        { status: 400 }
      );
    }

    if (!currentAPR || !transferAPR) {
      return NextResponse.json(
        { error: "Both current and transfer APR required" },
        { status: 400 }
      );
    }

    const balance = Number(currentBalance);
    const monthRate1 = Number(currentAPR) / 12 / 100;
    const monthRate2 = Number(transferAPR) / 12 / 100;
    const tenure = Number(tenureMonths) || 36;
    const fee = balance * (Number(transferFeePercent) / 100);

    // Calculate EMI for current loan
    const emi1 =
      currentEMI ||
      (monthRate1 > 0
        ? (balance * monthRate1 * Math.pow(1 + monthRate1, tenure)) /
          (Math.pow(1 + monthRate1, tenure) - 1)
        : balance / tenure);

    // Calculate EMI for transferred loan (on balance + fee)
    const transferBalance = balance + fee;
    const emi2 =
      monthRate2 > 0
        ? (transferBalance * monthRate2 * Math.pow(1 + monthRate2, tenure)) /
          (Math.pow(1 + monthRate2, tenure) - 1)
        : transferBalance / tenure;

    // Total cost comparison
    const totalCurrent = emi1 * tenure;
    const totalTransfer = emi2 * tenure;
    const totalSavings = totalCurrent - totalTransfer;

    const interestCurrent = totalCurrent - balance;
    const interestTransfer = totalTransfer - transferBalance;
    const interestSaved = interestCurrent - interestTransfer;

    const monthlySavings = emi1 - emi2;

    return NextResponse.json({
      success: true,
      current: {
        emi: Math.round(emi1),
        totalCost: Math.round(totalCurrent),
        totalInterest: Math.round(interestCurrent),
        apr: Number(currentAPR),
      },
      transfer: {
        emi: Math.round(emi2),
        totalCost: Math.round(totalTransfer),
        totalInterest: Math.round(interestTransfer),
        apr: Number(transferAPR),
        fee: Math.round(fee),
        effectiveBalance: Math.round(transferBalance),
      },
      savings: {
        totalSavings: Math.round(totalSavings),
        interestSaved: Math.round(interestSaved),
        monthlySavings: Math.round(monthlySavings),
        worthIt: totalSavings > fee, // Transfer saves more than the fee cost
      },
      recommendation:
        totalSavings > fee
          ? `You'll save ₹${Math.round(totalSavings).toLocaleString("en-IN")} by transferring. The ${transferFeePercent}% processing fee (₹${Math.round(fee).toLocaleString("en-IN")}) is recovered in ${Math.ceil(fee / monthlySavings)} months.`
          : `The transfer fee of ₹${Math.round(fee).toLocaleString("en-IN")} outweighs the interest savings. Not recommended for this loan.`,
    });
  } catch (error) {
    console.error("Balance transfer calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate" },
      { status: 500 }
    );
  }
}
