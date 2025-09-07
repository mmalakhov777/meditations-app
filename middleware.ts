import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const pathname = request.nextUrl.pathname;

  if (isLocal) return NextResponse.next();

  // Block admin UI and API off localhost
  const isApi = pathname.startsWith("/api/admin");
  if (isApi) {
    return new NextResponse(JSON.stringify({ ok: false, error: "forbidden" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


