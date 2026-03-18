import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isDemoMode } from "@/lib/demo";
import { DEMO_SESSION_USER } from "@/lib/demo/data";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({ authenticated: true, user: DEMO_SESSION_USER });
  }

  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session,
  });
}
