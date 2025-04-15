import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/auth/login",
  "/auth/register",
  "/auth/register/success",
  "/auth/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/auth/logout",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Always set supabase client in locals
  locals.supabase = supabase;

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle auth redirects
  const isAuthPage = url.pathname.startsWith("/auth");
  const isPublicPath = PUBLIC_PATHS.includes(url.pathname);

  if (user) {
    // Set user in locals
    locals.user = {
      email: user.email ?? null,
      id: user.id,
    };

    // Redirect authenticated users away from auth pages
    if (isAuthPage && !url.pathname.startsWith("/api/auth")) {
      return redirect("/dashboard");
    }
  } else if (!isPublicPath) {
    // Redirect unauthenticated users to login from protected routes
    return redirect("/auth/login");
  }

  return next();
});
