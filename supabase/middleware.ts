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
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
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
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("admin")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  const url = request.nextUrl.clone();
  const currentPath = url.pathname;

  if (
    (currentPath.startsWith("/admin") && !profile?.admin) ||
    (currentPath.startsWith("/user") && profile?.admin)
  ) {
    return NextResponse.error();
  }

  // http://supabase.com/docs/guides/auth/server-side/nextjs

  return supabaseResponse;
}
