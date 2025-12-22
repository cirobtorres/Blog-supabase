import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./supabase/middleware";

export async function proxy(request: NextRequest) {
  // const supabaseResponse = await updateSession(request);
  // const headers = new Headers(supabaseResponse.headers);
  // headers.set("x-current-path", request.nextUrl.pathname);
  // return NextResponse.next({ ...supabaseResponse, headers });
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
