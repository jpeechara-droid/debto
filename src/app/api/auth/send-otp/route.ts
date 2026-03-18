import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/lib/services/msg91";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Rate limit: 5 OTP requests per minute per IP
    const rateCheck = checkRateLimit(`send_otp:${ip}`, {
      maxRequests: 5,
      windowSeconds: 60,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many OTP requests. Please try again later.",
          retryAfter: rateCheck.resetInSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { phone } = body;

    // Validate phone number (Indian mobile: starts with 6-9, 10 digits)
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number. Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    // Rate limit per phone number: 3 attempts per 5 minutes
    const phoneRateCheck = checkRateLimit(`send_otp:phone:${phone}`, {
      maxRequests: 3,
      windowSeconds: 300,
    });

    if (!phoneRateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many OTP requests for this number. Please wait before trying again.",
          retryAfter: phoneRateCheck.resetInSeconds,
        },
        { status: 429 }
      );
    }

    // Send OTP via MSG91
    const result = await sendOTP(phone);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
