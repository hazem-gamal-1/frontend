import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public and private routes
export const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
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
  const refreshToken = req.cookies.has("refreshToken");

  // console.log("rt", refreshToken);
  // const isPrivateRoute = privateRoutes.some((route) =>
  //   pathname.startsWith(route),
  // );
  // const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // if (isPrivateRoute && !refreshToken) {
  //   const nextResponse = NextResponse.redirect(new URL("/sign-in", req.url));
  //   nextResponse.cookies.delete("token");
  //   return nextResponse;
  // }

  // if (isAuthRoute && refreshToken) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  // //public routes (landingPage, pricing, About, ...etc)
  // return NextResponse.next();
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
