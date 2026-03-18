/**
 * Razorpay Payment Service
 * Handles order creation and payment verification
 *
 * In dev mode (no RAZORPAY_KEY_ID), returns mock data
 */

import crypto from "crypto";

const RAZORPAY_BASE = "https://api.razorpay.com/v1";

function getAuth() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  error?: string;
}

/**
 * Create a Razorpay order
 */
export async function createOrder(params: {
  amount: number; // in INR (rupees, not paise)
  receipt: string;
  notes?: Record<string, string>;
}): Promise<CreateOrderResult> {
  const auth = getAuth();

  // Dev mode
  if (!auth) {
    console.log(`[DEV] Razorpay order created for ₹${params.amount}`);
    return {
      success: true,
      orderId: `order_dev_${Date.now()}`,
      amount: params.amount * 100,
      currency: "INR",
      keyId: "rzp_test_dev",
    };
  }

  try {
    const response = await fetch(`${RAZORPAY_BASE}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: params.amount * 100, // Convert to paise
        currency: "INR",
        receipt: params.receipt,
        notes: params.notes || {},
      }),
    });

    const data = await response.json();

    if (data.id) {
      return {
        success: true,
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    }

    return {
      success: false,
      error: data.error?.description || "Failed to create order",
    };
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return { success: false, error: "Payment service unavailable" };
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Dev mode — always verify
  if (!keySecret) return true;

  const body = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  return expectedSignature === params.signature;
}
