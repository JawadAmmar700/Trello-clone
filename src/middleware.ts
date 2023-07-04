import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth-session";

export async function middleware(request: NextRequest) {
  const session = await getSession(request.headers.get("cookie") ?? "");

  if (session && request.nextUrl.pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    !session &&
    [
      "/api/agenda",
      "/api/agenda/create",
      "/api/agenda/delete",
      "/api/completions",
    ].includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|/).*)"],
};
