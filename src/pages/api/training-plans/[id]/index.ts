import { z } from "zod";
import type { APIRoute } from "astro";
import { TrainingPlanService } from "../../../../lib/services/training-plan.service";

// Prevent static generation of API routes
export const prerender = false;

// Validation schema for UUID
const uuidSchema = z.string().uuid("Invalid plan ID format");

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const planId = params.id;
    if (!planId) {
      return new Response(
        JSON.stringify({
          error: "Plan ID is required",
        }),
        { status: 400 }
      );
    }

    // Validate plan ID format
    const validationResult = uuidSchema.safeParse(planId);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid plan ID format",
          details: validationResult.error.errors,
        }),
        { status: 400 }
      );
    }

    const trainingPlanService = new TrainingPlanService(locals.supabase);
    // TODO: Implement getDetails method in TrainingPlanService
    const result = await trainingPlanService.getDetails(planId);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error getting training plan details:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return new Response(
          JSON.stringify({
            error: "Training plan not found",
          }),
          { status: 404 }
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
