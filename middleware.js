import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // login page açıq qalır
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // admin route qorunur
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
