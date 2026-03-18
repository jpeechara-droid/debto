import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/kyc"];
const authRoutes = ["/auth/signup", "/auth/login", "/auth/verify-otp"];
const protectedApiRoutes = [
  "/api/kyc",
  "/api/cibil",
  "/api/ai-analysis",
  "/api/dashboard",
  "/api/credit-report",
  "/api/consultation",
  "/api/settings",
];

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Demo mode: skip all auth checks, allow everything through
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  const token = request.cookies.get("debto_session")?.value;

  let session = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecret());
      session = payload;
    } catch {
      // Invalid token — treat as unauthenticated
    }
  }

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isProtectedApi = protectedApiRoutes.some((r) =>
    pathname.startsWith(r)
  );

  // Block unauthenticated API access
  if (isProtectedApi && !session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && session) {
    const kycComplete = (session as Record<string, unknown>).kycComplete;
    if (kycComplete) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/kyc/identity", request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/kyc/:path*",
    "/auth/:path*",
    "/api/kyc/:path*",
    "/api/cibil/:path*",
    "/api/ai-analysis/:path*",
    "/api/dashboard/:path*",
    "/api/credit-report/:path*",
    "/api/consultation/:path*",
    "/api/settings/:path*",
  ],
};
