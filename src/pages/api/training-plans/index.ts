import { z } from "zod";
import type { APIRoute } from "astro";
import { TrainingPlanService } from "../../../lib/services/training-plan.service";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";

// Prevent static generation of API routes
export const prerender = false;

// Validation schema for exercises
const createTrainingDayExerciseSchema = z.object({
  exercise_name: z.string().min(1, "Exercise name is required"),
  order_index: z.number().min(1),
  sets: z.number().min(1),
  repetitions: z.number().min(1),
  rest_time_seconds: z.number().min(1),
});

// Validation schema for training days
const createTrainingDaySchema = z.object({
  weekday: z.number().min(0).max(6),
  exercises: z.array(createTrainingDayExerciseSchema).min(1, "At least one exercise is required"),
});

// Validation schema for the complete training plan
const createCompleteTrainingPlanSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
  training_days: z.array(createTrainingDaySchema).min(1, "At least one training day is required"),
  source: z.enum(["manual", "pdf_import"]).optional().default("manual"),
});

// Validation schema for query parameters
const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const searchParams = Object.fromEntries(url.searchParams);
    const validationResult = listQuerySchema.safeParse(searchParams);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: validationResult.error.errors,
        }),
        { status: 400 }
      );
    }

    const { page, limit } = validationResult.data;
    const trainingPlanService = new TrainingPlanService(locals.supabase);
    const result = await trainingPlanService.listPlans(DEFAULT_USER_ID, page, limit);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error listing training plans:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createCompleteTrainingPlanSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: validationResult.error.errors,
        }),
        { status: 400 }
      );
    }

    const trainingPlanService = new TrainingPlanService(locals.supabase);
    const result = await trainingPlanService.createCompletePlan(validationResult.data, DEFAULT_USER_ID);

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error("Error creating training plan:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
