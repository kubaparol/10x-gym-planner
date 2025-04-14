import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { loginFormSchema } from "../../../lib/auth/validation";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const validatedData = loginFormSchema.parse(data);

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({
        user: authData.user,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 400,
      }
    );
  }
};
