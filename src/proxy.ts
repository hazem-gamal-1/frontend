import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public and private routes
export const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/reset-password",
];

export const publicRoutes = ["/"]; //landing page, pricing, about, ...etc

export const privateRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/projects",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !refreshToken) {
    const response = NextResponse.redirect(new URL("/auth/sign-in", req.url));
    response.cookies.delete("token");
    return response;
  }

  if (!token && refreshToken) {
    const authRes = await fetch(
      process.env.NEXT_PUBLIC_BASE_BACKEND_URL + "/api/Auth/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: { "Content-Type": "application/json" },
      },
    );
    if (authRes.ok) {
      const result = await authRes.json();
      const {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn,
        refreshTokenExpiration,
      } = result.data;

      const response = NextResponse.next();
      response.cookies.set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: expiresIn,
      });
      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        expires: new Date(refreshTokenExpiration),
      });

      response.headers.set(
        "Cookie",
        `token=${newToken}; refreshToken=${newRefreshToken}`,
      ); //for the server component to see the latest token values

      return response;
    }
  }

  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  //public routes (landingPage, pricing, About, ...etc)
  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (internal routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// API proxy config (if needed)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
