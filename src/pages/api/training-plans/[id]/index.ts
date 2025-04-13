import { z } from "zod";
import type { APIRoute } from "astro";
import { TrainingPlanService } from "../../../../lib/services/training-plan.service";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

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

export const DELETE: APIRoute = async ({ params, locals }) => {
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

    // Verify the plan exists and belongs to the user
    const { data: plan, error: planError } = await locals.supabase
      .from("training_plans")
      .select("id")
      .eq("id", planId)
      .eq("user_id", DEFAULT_USER_ID)
      .single();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({
          error: "Training plan not found or you don't have permission to delete it",
        }),
        { status: 404 }
      );
    }

    // Delete the plan using the service
    const trainingPlanService = new TrainingPlanService(locals.supabase);
    await trainingPlanService.deletePlan(planId);

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Training plan deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting training plan:", error);

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
