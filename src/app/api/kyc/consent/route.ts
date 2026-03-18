import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { consentGiven, marketingConsent } = body;

    if (!consentGiven) {
      return NextResponse.json(
        { error: "CIBIL consent is required" },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Store CIBIL consent
    await prisma.consentRecord.create({
      data: {
        userId: session.userId,
        consentType: "cibil_fetch",
        consentGiven: true,
        consentText:
          "I authorize Debto to access my CIBIL credit report using my PAN and Aadhaar details. " +
          "I understand that this data will be used solely for generating my personalized debt analysis and will be stored securely. " +
          "This is a soft inquiry and will not impact my credit score. Data retained for 90 days per DPDP Act 2023.",
        consentVersion: "1.0",
        ipAddress: ip,
        sessionId: session.userId,
        userAgent,
      },
    });

    // Store marketing consent if given
    if (marketingConsent) {
      await prisma.consentRecord.create({
        data: {
          userId: session.userId,
          consentType: "marketing",
          consentGiven: true,
          consentText:
            "I consent to receiving personalized financial product recommendations based on my credit profile.",
          consentVersion: "1.0",
          ipAddress: ip,
          sessionId: session.userId,
          userAgent,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Consent recording error:", error);
    return NextResponse.json(
      { error: "Failed to record consent" },
      { status: 500 }
    );
  }
}
