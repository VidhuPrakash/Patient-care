import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const origin = request.nextUrl.origin; // Get origin as string

    // Skip static assets and API routes
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    // Verify required environment variable
    if (!process.env.NEXT_PUBLIC_COOKIE_SECRET) {
      throw new Error("Missing COOKIE_SECRET environment variable");
    }

    // Get cookies
    const cookies = {
      session: request.cookies.get("session_token")?.value,
      email: request.cookies.get("email")?.value,
      secret: request.cookies.get("app_secret")?.value,
    };

    // Validate session
    const isValid =
      cookies.session &&
      cookies.email &&
      cookies.secret === process.env.NEXT_PUBLIC_COOKIE_SECRET;

    // Handle authenticated users
    if (isValid) {
      if (pathname === "/" || pathname === "/auth") {
        // Use string template for redirect
        return NextResponse.redirect(`${origin}/register`);
      }
      return NextResponse.next();
    }

    // Handle unauthenticated users
    if (pathname.startsWith("/register") || pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(origin); // origin is already a string
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Safely create error URL using origin
    const errorUrl = new URL("/error", request.nextUrl.origin).toString();
    return NextResponse.redirect(errorUrl);
  }
}

export const config = {
  matcher: [
    "/",
    "/register/:path*",
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
