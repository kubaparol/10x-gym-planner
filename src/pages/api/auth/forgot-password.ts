import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { resetPasswordFormSchema } from "../../../lib/auth/validation";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const validatedData = resetPasswordFormSchema.parse(data);

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${new URL(request.url).origin}/auth/new-password`,
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
        message: "Password reset email sent successfully",
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
