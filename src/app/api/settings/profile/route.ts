import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/demo";
import { DEMO_PROFILE } from "@/lib/demo/data";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(DEMO_PROFILE);
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      city: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get latest report date
  const latestReport = await prisma.creditReport.findFirst({
    where: { userId: session.userId },
    orderBy: { fetchedAt: "desc" },
    select: { fetchedAt: true },
  });

  return NextResponse.json({
    ...user,
    lastReportSync: latestReport?.fetchedAt || null,
  });
}

export async function PUT(req: NextRequest) {
  if (isDemoMode()) {
    const body = await req.json();
    return NextResponse.json({
      ...DEMO_PROFILE,
      ...(body.fullName !== undefined && { fullName: body.fullName }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.city !== undefined && { city: body.city }),
    });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { fullName, email, city } = body;

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(fullName !== undefined && { fullName }),
      ...(email !== undefined && { email }),
      ...(city !== undefined && { city }),
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      city: true,
    },
  });

  // Update session name if changed
  if (fullName) {
    await updateSession({ name: fullName });
  }

  return NextResponse.json(user);
}
