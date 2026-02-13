import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Rate limiting üçün sadə in-memory store (production-da Redis istifadə et)
const loginAttempts = new Map();

export async function POST(req) {
  const clientIp = req.headers.get("x-forwarded-for") || "unknown";

  // Rate limiting - 5 dəqiqə ərzində 5 cəhd
  const attempts = loginAttempts.get(clientIp) || [];
  const now = Date.now();
  const recentAttempts = attempts.filter((time) => now - time < 5 * 60 * 1000);

  if (recentAttempts.length >= 5) {
    return NextResponse.json(
      { error: "Çox sayda cəhdə görə 5 dəqiqə gözləyin" },
      { status: 429 }
    );
  }

  recentAttempts.push(now);
  loginAttempts.set(clientIp, recentAttempts);

  const { username, password } = await req.json();

  // Environment variable-dən istifadə et
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true, // XSS-dən qoruyur
      secure: process.env.NODE_ENV === "production", // HTTPS-ə məcbur et
      sameSite: "lax", // CSRF-dən qoruyur
      maxAge: 8 * 60 * 60, // 8 saat
      path: "/",
    });
    return response;
  } else {
    return NextResponse.json(
      { error: "Username və ya password səhvdir" },
      { status: 401 }
    );
  }
}
