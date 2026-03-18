import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createOrder } from "@/lib/services/razorpay";
import prisma from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { isDemoMode } from "@/lib/demo";
import { DEMO_BOOKING_RESPONSE } from "@/lib/demo/data";

const SERVICES: Record<string, { name: string; price: number }> = {
  debt_strategy: { name: "Debt Strategy Session", price: 999 },
  credit_cleanup: { name: "Credit Score Cleanup", price: 1499 },
  legal_advice: { name: "Legal Debt Advice", price: 1999 },
};

export async function POST(request: NextRequest) {
  try {
    if (isDemoMode()) {
      return NextResponse.json(DEMO_BOOKING_RESPONSE);
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 bookings per minute
    const rateCheck = checkRateLimit(`book:${session.userId}`, {
      maxRequests: 5,
      windowSeconds: 60,
    });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter: rateCheck.resetInSeconds },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { serviceType, advisorId, date, time, mode } = body;

    // Validate service
    const service = SERVICES[serviceType];
    if (!service) {
      return NextResponse.json(
        { error: "Invalid service type" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!advisorId || !date || !time || !mode) {
      return NextResponse.json(
        { error: "All booking fields are required" },
        { status: 400 }
      );
    }

    if (!["video_call", "phone_call"].includes(mode)) {
      return NextResponse.json(
        { error: "Mode must be video_call or phone_call" },
        { status: 400 }
      );
    }

    // Calculate total with GST
    const gst = Math.round(service.price * 0.18);
    const totalAmount = service.price + gst;

    // Create Razorpay order
    const orderResult = await createOrder({
      amount: totalAmount,
      receipt: `debto_consult_${Date.now()}`,
      notes: {
        userId: session.userId,
        serviceType,
        advisorId,
        date,
        time,
      },
    });

    if (!orderResult.success) {
      return NextResponse.json(
        { error: orderResult.error || "Failed to create payment order" },
        { status: 500 }
      );
    }

    // Create booking record (pending payment)
    const booking = await prisma.consultationBooking.create({
      data: {
        userId: session.userId,
        advisorId,
        serviceType,
        bookingDate: new Date(date),
        bookingTime: new Date(`1970-01-01T${convertTo24(time)}:00.000Z`),
        mode,
        status: "pending",
        amount: totalAmount,
        notes: `Razorpay Order: ${orderResult.orderId}`,
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      razorpay: {
        orderId: orderResult.orderId,
        amount: orderResult.amount,
        currency: orderResult.currency,
        keyId: orderResult.keyId,
      },
      service: {
        name: service.name,
        subtotal: service.price,
        gst,
        total: totalAmount,
      },
    });
  } catch (error) {
    console.error("Consultation booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

/**
 * Convert 12-hour time string to 24-hour format
 */
function convertTo24(time12: string): string {
  const [time, period] = time12.split(" ");
  const [hoursStr, minutes] = time.split(":");
  let hours = parseInt(hoursStr, 10);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}
