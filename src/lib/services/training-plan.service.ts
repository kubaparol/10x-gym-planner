import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  CreateCompleteTrainingPlanCommand,
  CreateTrainingPlanResponseDTO,
  TrainingPlanListDTO,
  TrainingPlanListResponseDTO,
  PaginationDTO,
  TrainingPlanDetailsDTO,
  TrainingDayDTO,
  TrainingDayExerciseDTO,
} from "../../types";

export class TrainingPlanService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createCompletePlan(
    command: CreateCompleteTrainingPlanCommand,
    userId: string
  ): Promise<CreateTrainingPlanResponseDTO> {
    // Start a Supabase transaction
    const { data: plan, error: planError } = await this.supabase
      .from("training_plans")
      .insert({
        name: command.name,
        description: command.description,
        is_active: false,
        user_id: userId,
        source: command.source || "manual",
      })
      .select("id")
      .single();

    if (planError || !plan) {
      throw new Error(`Failed to create training plan: ${planError?.message}`);
    }

    try {
      // Process each training day
      for (const dayCommand of command.training_days) {
        // Create training day
        const { data: day, error: dayError } = await this.supabase
          .from("training_days")
          .insert({
            plan_id: plan.id,
            weekday: dayCommand.weekday,
          })
          .select("id")
          .single();

        if (dayError || !day) {
          throw new Error(`Failed to create training day: ${dayError?.message}`);
        }

        // Process exercises for this day
        for (const exerciseCommand of dayCommand.exercises) {
          // Create or find exercise
          const { data: exercise, error: exerciseError } = await this.supabase
            .from("exercises")
            .insert({ name: exerciseCommand.exercise_name })
            .select("id")
            .single();

          if (exerciseError || !exercise) {
            throw new Error(`Failed to create exercise: ${exerciseError?.message}`);
          }

          // Assign exercise to training day
          const { error: assignError } = await this.supabase.from("training_day_exercises").insert({
            day_id: day.id,
            exercise_id: exercise.id,
            order_index: exerciseCommand.order_index,
            sets: exerciseCommand.sets,
            repetitions: exerciseCommand.repetitions,
            rest_time_seconds: exerciseCommand.rest_time_seconds,
          });

          if (assignError) {
            throw new Error(`Failed to assign exercise to training day: ${assignError.message}`);
          }
        }
      }

      return {
        id: plan.id,
        message: "Training plan created successfully with all exercises",
      };
    } catch (error) {
      // If anything fails, delete the plan and all related data (Supabase cascade will handle this)
      await this.supabase.from("training_plans").delete().eq("id", plan.id);
      throw error;
    }
  }

  async canActivatePlan(planId: string): Promise<boolean> {
    // Check if plan has at least one training day
    const { count: daysCount, error: daysError } = await this.supabase
      .from("training_days")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId);

    if (daysError) {
      throw new Error(`Failed to check training days: ${daysError.message}`);
    }

    if (!daysCount || daysCount === 0) {
      return false;
    }

    // Check if any training day has at least one exercise
    const { count: exercisesCount, error: exercisesError } = await this.supabase
      .from("training_day_exercises")
      .select("*", { count: "exact", head: true })
      .eq(
        "day_id",
        (await this.supabase.from("training_days").select("id").eq("plan_id", planId).single()).data?.id || ""
      );

    if (exercisesError) {
      throw new Error(`Failed to check exercises: ${exercisesError.message}`);
    }

    return exercisesCount !== null && exercisesCount > 0;
  }

  async activatePlan(planId: string): Promise<void> {
    const canActivate = await this.canActivatePlan(planId);

    if (!canActivate) {
      throw new Error(
        "Cannot activate plan: minimum requirements not met (at least one training day with one exercise required)"
      );
    }

    const { error } = await this.supabase.from("training_plans").update({ is_active: true }).eq("id", planId);

    if (error) {
      throw new Error(`Failed to activate plan: ${error.message}`);
    }
  }

  async listPlans(userId: string, page = 1, limit = 10): Promise<TrainingPlanListResponseDTO> {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await this.supabase
      .from("training_plans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      throw new Error(`Failed to get total count: ${countError.message}`);
    }

    // Get paginated plans
    const { data: plans, error: plansError } = await this.supabase
      .from("training_plans")
      .select("id, name, description, is_active, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (plansError) {
      throw new Error(`Failed to fetch training plans: ${plansError.message}`);
    }

    const pagination: PaginationDTO = {
      page,
      limit,
      total: count || 0,
    };

    return {
      plans: (plans || []) as TrainingPlanListDTO[],
      pagination,
    };
  }

  async getDetails(planId: string): Promise<TrainingPlanDetailsDTO> {
    // Get the training plan
    const { data: plan, error: planError } = await this.supabase
      .from("training_plans")
      .select("id, name, description, is_active")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      throw new Error(planError?.message || "Training plan not found");
    }

    // Get training days with exercises
    const { data: days, error: daysError } = await this.supabase
      .from("training_days")
      .select(
        `
        id,
        weekday,
        created_at,
        training_day_exercises (
          id,
          order_index,
          sets,
          repetitions,
          rest_time_seconds,
          exercise:exercises (
            id,
            name
          )
        )
      `
      )
      .eq("plan_id", planId)
      .order("weekday");

    if (daysError) {
      throw new Error(`Failed to fetch training days: ${daysError.message}`);
    }

    // Transform the data to match the DTO structure
    const training_days: TrainingDayDTO[] = (days || []).map((day) => {
      const exercises: TrainingDayExerciseDTO[] = (day.training_day_exercises || [])
        .map((tde) => ({
          id: tde.id,
          exercise: tde.exercise,
          order_index: tde.order_index,
          sets: tde.sets,
          repetitions: tde.repetitions,
          rest_time_seconds: tde.rest_time_seconds,
        }))
        .sort((a, b) => a.order_index - b.order_index);

      return {
        id: day.id,
        weekday: day.weekday,
        created_at: day.created_at,
        exercises,
      };
    });

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      is_active: plan.is_active,
      training_days,
    };
  }

  async deletePlan(planId: string): Promise<void> {
    // Delete the plan (cascade deletion will handle related records)
    const { error } = await this.supabase.from("training_plans").delete().eq("id", planId);

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Training plan not found");
      }
      throw new Error(`Failed to delete training plan: ${error.message}`);
    }
  }
}
