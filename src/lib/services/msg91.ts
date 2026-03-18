/**
 * MSG91 OTP Service
 * Handles sending and verifying OTPs via MSG91 API
 *
 * In development mode (no MSG91_AUTH_KEY), uses a fixed OTP: 123456
 */

const MSG91_BASE = "https://control.msg91.com/api/v5";

interface SendOTPResult {
  success: boolean;
  message: string;
  requestId?: string;
}

interface VerifyOTPResult {
  success: boolean;
  message: string;
}

/**
 * Send OTP to a phone number via MSG91
 */
export async function sendOTP(phone: string): Promise<SendOTPResult> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  // Development mode — skip actual API call
  if (!authKey || !templateId) {
    console.log(`[DEV] OTP 123456 would be sent to +91${phone}`);
    return {
      success: true,
      message: "OTP sent (dev mode — use 123456)",
      requestId: `dev_${Date.now()}`,
    };
  }

  try {
    const response = await fetch(`${MSG91_BASE}/otp`, {
      method: "POST",
      headers: {
        authkey: authKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template_id: templateId,
        mobile: `91${phone}`,
        otp_length: 6,
        otp_expiry: 5, // minutes
      }),
    });

    const data = await response.json();

    if (data.type === "success") {
      return {
        success: true,
        message: "OTP sent successfully",
        requestId: data.request_id,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to send OTP",
    };
  } catch (error) {
    console.error("MSG91 send OTP error:", error);
    return { success: false, message: "OTP service unavailable" };
  }
}

/**
 * Verify OTP submitted by user
 */
export async function verifyOTP(
  phone: string,
  otp: string
): Promise<VerifyOTPResult> {
  const authKey = process.env.MSG91_AUTH_KEY;

  // Development mode — accept 123456
  if (!authKey) {
    if (otp === "123456") {
      return { success: true, message: "OTP verified (dev mode)" };
    }
    return { success: false, message: "Invalid OTP (dev mode — use 123456)" };
  }

  try {
    const response = await fetch(
      `${MSG91_BASE}/otp/verify?mobile=91${phone}&otp=${otp}`,
      {
        method: "GET",
        headers: { authkey: authKey },
      }
    );

    const data = await response.json();

    if (data.type === "success") {
      return { success: true, message: "OTP verified successfully" };
    }

    return {
      success: false,
      message: data.message || "Invalid or expired OTP",
    };
  } catch (error) {
    console.error("MSG91 verify OTP error:", error);
    return { success: false, message: "OTP verification service unavailable" };
  }
}
