import { NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/auth/session";
import { fetchCreditReport } from "@/lib/services/decentro";
import prisma from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Prisma } from "@prisma/client";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 2 CIBIL fetches per hour per user
    const rateCheck = checkRateLimit(`cibil:${session.userId}`, {
      maxRequests: 2,
      windowSeconds: 3600,
    });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many report fetches. Please wait before trying again.", retryAfter: rateCheck.resetInSeconds },
        { status: 429 }
      );
    }

    // Get KYC record for this user
    const kycRecord = await prisma.kycRecord.findUnique({
      where: { userId: session.userId },
    });

    if (!kycRecord) {
      return NextResponse.json(
        { error: "KYC not complete. Please verify your identity first." },
        { status: 400 }
      );
    }

    // Check if we already have a fresh report (less than 24 hours old)
    const existingReport = await prisma.creditReport.findFirst({
      where: {
        userId: session.userId,
        fetchedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { fetchedAt: "desc" },
    });

    if (existingReport) {
      return NextResponse.json({
        success: true,
        reportId: existingReport.id,
        creditScore: existingReport.creditScore,
        message: "Using existing report from today",
      });
    }

    // Decrypt PAN for the API call
    let panNumber: string;
    try {
      const { decrypt } = await import("@/lib/encryption");
      panNumber = decrypt(kycRecord.panNumber);
    } catch {
      // In dev mode, PAN might be stored unencrypted
      panNumber = kycRecord.panNumber;
    }

    // Fetch credit report from Decentro
    const result = await fetchCreditReport({
      name: kycRecord.panName || session.name || "Unknown",
      dateOfBirth: kycRecord.dateOfBirth.toISOString().split("T")[0],
      mobile: session.phone,
      pan: panNumber,
    });

    if (!result.success || !result.parsedSummary) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch credit report" },
        { status: 500 }
      );
    }

    // Store credit report in DB
    const creditReport = await prisma.creditReport.create({
      data: {
        userId: session.userId,
        decentroTxnId: result.decentroTxnId,
        creditScore: result.creditScore,
        rawReport: (result.rawReport || {}) as Prisma.InputJsonValue,
        parsedSummary: result.parsedSummary as unknown as Prisma.InputJsonValue,
        pdfBase64: result.pdfBase64,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    });

    // Store individual loan accounts for easy querying
    if (result.parsedSummary.accounts.length > 0) {
      await prisma.loanAccount.createMany({
        data: result.parsedSummary.accounts.map((acct) => ({
          creditReportId: creditReport.id,
          userId: session.userId,
          accountNumber: acct.accountNumber,
          institution: acct.institution,
          loanType: acct.loanType,
          sanctionedAmount: acct.sanctionedAmount,
          outstandingBalance: acct.outstandingBalance,
          emiAmount: acct.emiAmount,
          interestRate: acct.interestRate,
          tenureMonths: acct.tenureMonths,
          tenureRemaining: acct.tenureRemaining,
          disbursementDate: acct.disbursementDate ? new Date(acct.disbursementDate) : null,
          daysPastDue: acct.daysPastDue,
          accountStatus: acct.accountStatus,
          creditLimit: acct.creditLimit,
          currentBalance: acct.currentBalance,
          utilizationPct: acct.utilizationPct,
          paymentHistory: acct.paymentHistory,
        })),
      });
    }

    // Update KYC as verified
    await prisma.kycRecord.update({
      where: { userId: session.userId },
      data: { panVerified: true },
    });

    // Update session
    await updateSession({ kycComplete: true, name: kycRecord.panName || session.name });

    return NextResponse.json({
      success: true,
      reportId: creditReport.id,
      creditScore: result.creditScore,
    });
  } catch (error) {
    console.error("CIBIL fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit report" },
      { status: 500 }
    );
  }
}
