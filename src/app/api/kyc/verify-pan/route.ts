import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { verifyPAN } from "@/lib/services/decentro";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { panNumber } = body;

    if (!panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid PAN format" },
        { status: 400 }
      );
    }

    const result = await verifyPAN(panNumber.toUpperCase());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "PAN verification failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: result.verified,
      name: result.name,
      panNumber: result.panNumber,
      decentroTxnId: result.decentroTxnId,
    });
  } catch (error) {
    console.error("PAN verification error:", error);
    return NextResponse.json(
      { error: "PAN verification failed" },
      { status: 500 }
    );
  }
}
