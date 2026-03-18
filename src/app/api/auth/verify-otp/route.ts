import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/services/msg91";
import { createSession } from "@/lib/auth/session";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import prisma from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Rate limit: 10 verify attempts per minute per IP
    const rateCheck = checkRateLimit(`verify_otp:${ip}`, {
      maxRequests: 10,
      windowSeconds: 60,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many verification attempts. Please try again later.",
          retryAfter: rateCheck.resetInSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { phone, otp } = body;

    // Validate inputs
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format. Please enter 6 digits." },
        { status: 400 }
      );
    }

    // Verify OTP via MSG91
    const verifyResult = await verifyOTP(phone, otp);

    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.message },
        { status: 401 }
      );
    }

    // Find or create user in database
    let user;
    let isNewUser = false;

    try {
      user = await prisma.user.findUnique({
        where: { phone },
        include: { kycRecord: true },
      });

      if (!user) {
        user = await prisma.user.create({
          data: { phone },
          include: { kycRecord: true },
        });
        isNewUser = true;
      }
    } catch (dbError) {
      console.error("Database error during login:", dbError);
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    // Create session JWT
    const kycComplete = !!user.kycRecord?.panVerified;

    await createSession({
      userId: user.id,
      phone: user.phone,
      name: user.fullName || undefined,
      kycComplete,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        phone: user.phone,
        name: user.fullName,
        isNewUser,
        kycComplete,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
