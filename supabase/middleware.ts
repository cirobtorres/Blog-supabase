import { protectedRoutes } from "@/routes/protectedRoutes";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  // DO NOT WRITE CODE HERE!!!
  const {
    data: { user },
  } = await supabase.auth.getUser(); // DO NOT REMOVE auth.getUser()

  const url = request.nextUrl.clone();
  const currentPath = url.pathname;

  if (!user && protectedRoutes.some((regex) => regex.test(currentPath))) {
    return NextResponse.error();
    // url.pathname = "/";
    // return NextResponse.redirect(url);
  }

  // http://supabase.com/docs/guides/auth/server-side/nextjs

  // CREATING A NEW RESPONSE:
  // const myNewResponse = NextResponse.next({ request })
  // myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // ---
  // ALTER myNewResponse HERE, BUT AVOID CHANGING THE COOKIES!!!
  // ---
  // return myNewResponse

  return supabaseResponse;
}
