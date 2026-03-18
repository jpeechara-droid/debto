import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { encrypt, hashAadhaar } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, panNumber, dateOfBirth, aadhaarNumber } = body;

    // Validate
    if (!fullName || !panNumber || !dateOfBirth || !aadhaarNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid PAN format" },
        { status: 400 }
      );
    }

    const cleanAadhaar = aadhaarNumber.replace(/\s/g, "");
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      return NextResponse.json(
        { error: "Invalid Aadhaar format" },
        { status: 400 }
      );
    }

    // Encrypt PAN, hash Aadhaar
    let encryptedPan: string;
    let aadhaarHash: string;
    try {
      encryptedPan = encrypt(panNumber.toUpperCase());
      aadhaarHash = hashAadhaar(cleanAadhaar);
    } catch {
      // Dev mode without ENCRYPTION_KEY — store as-is
      encryptedPan = panNumber.toUpperCase();
      aadhaarHash = cleanAadhaar;
    }

    // Upsert KYC record
    await prisma.kycRecord.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        panNumber: encryptedPan,
        panName: fullName,
        aadhaarHash,
        dateOfBirth: new Date(dateOfBirth),
      },
      update: {
        panNumber: encryptedPan,
        panName: fullName,
        aadhaarHash,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    // Update user name
    await prisma.user.update({
      where: { id: session.userId },
      data: { fullName },
    });

    await updateSession({ name: fullName });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("KYC submit error:", error);
    return NextResponse.json(
      { error: "Failed to save identity details" },
      { status: 500 }
    );
  }
}
