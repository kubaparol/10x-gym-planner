import type { APIRoute } from "astro";
import { TrainingPlanService } from "../../../../lib/services/training-plan.service";

export const prerender = false;

export const POST: APIRoute = async ({ params, locals }) => {
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

    const trainingPlanService = new TrainingPlanService(locals.supabase);

    await trainingPlanService.activatePlan(planId);

    return new Response(
      JSON.stringify({
        message: "Training plan activated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("minimum requirements not met")) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 400 }
      );
    }

    console.error("Error activating training plan:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
