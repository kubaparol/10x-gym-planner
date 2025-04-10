import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlanModeSelector } from "../create-plan/PlanModeSelector";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CreateCompleteTrainingPlanCommand, PdfTrainingPlanImportResponseDTO } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { ManualPlanForm } from "../create-plan/ManualPlanForm";
import { PdfPlanImporter } from "../create-plan/PdfPlanImporter";
import { ConfirmationModal } from "../ui/ConfirmationModal";

// Type for the form data
export interface TrainingPlanFormViewModel {
  id: string;
  name: string;
  description: string;
  training_days: TrainingDayFormViewModel[];
  source?: "manual" | "pdf_import";
}

export interface TrainingDayFormViewModel {
  id: string;
  weekday: number | null;
  exercises: ExerciseFormViewModel[];
}

export interface ExerciseFormViewModel {
  id: string;
  exercise_name: string;
  order_index: number;
  sets: number;
  repetitions: number;
  rest_time_seconds: number;
}

// Schema type that matches the form view model
const createTrainingPlanFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be at most 500 characters"),
  training_days: z
    .array(
      z.object({
        id: z.string(),
        weekday: z.number().min(0).max(6).nullable(),
        exercises: z
          .array(
            z.object({
              id: z.string(),
              exercise_name: z.string().min(1, "Exercise name is required"),
              order_index: z.number(),
              sets: z.coerce
                .number()
                .min(1, "Sets must be at least 1")
                .max(100, "Sets must be at most 100")
                .int("Sets must be a whole number"),
              repetitions: z.coerce
                .number()
                .min(1, "Repetitions must be at least 1")
                .max(1000, "Repetitions must be at most 1000")
                .int("Repetitions must be a whole number"),
              rest_time_seconds: z.coerce
                .number()
                .min(1, "Rest time must be at least 1 second")
                .max(600, "Rest time must be at most 600 seconds")
                .int("Rest time must be a whole number"),
            })
          )
          .min(1, "At least one exercise is required"),
      })
    )
    .min(1, "At least one training day is required")
    .refine((days) => {
      const weekdays = days.map((d) => d.weekday).filter((w): w is number => w !== null);
      return new Set(weekdays).size === weekdays.length;
    }, "Each weekday must be unique"),
  source: z.enum(["manual", "pdf_import"]).optional(),
});

export function CreateTrainingPlanView() {
  const [mode, setMode] = useState<"manual" | "pdf">("manual");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const form = useForm<TrainingPlanFormViewModel>({
    resolver: zodResolver(createTrainingPlanFormSchema),
    defaultValues: {
      id: uuidv4(),
      name: "Name",
      description: "Description",
      training_days: [
        {
          id: uuidv4(),
          weekday: 1, // Monday
          exercises: [
            {
              id: uuidv4(),
              exercise_name: "Bench Press",
              order_index: 1,
              sets: 3,
              repetitions: 12,
              rest_time_seconds: 60,
            },
            {
              id: uuidv4(),
              exercise_name: "Squat",
              order_index: 2,
              sets: 4,
              repetitions: 10,
              rest_time_seconds: 90,
            },
          ],
        },
        {
          id: uuidv4(),
          weekday: 3, // Wednesday
          exercises: [
            {
              id: uuidv4(),
              exercise_name: "Deadlift",
              order_index: 1,
              sets: 3,
              repetitions: 8,
              rest_time_seconds: 120,
            },
            {
              id: uuidv4(),
              exercise_name: "Pull-ups",
              order_index: 2,
              sets: 4,
              repetitions: 12,
              rest_time_seconds: 60,
            },
          ],
        },
      ],
    },
  });

  const handlePdfUploadSuccess = (data: PdfTrainingPlanImportResponseDTO) => {
    // Convert API response to form data format
    const formData: TrainingPlanFormViewModel = {
      id: uuidv4(),
      name: data.plan.name,
      description: data.plan.description,
      source: "pdf_import",
      training_days: data.plan.training_days.map((day) => ({
        id: uuidv4(),
        weekday: day.weekday,
        exercises: day.exercises.map((exercise) => ({
          id: uuidv4(),
          exercise_name: exercise.exercise_name,
          order_index: exercise.order_index,
          sets: exercise.sets,
          repetitions: exercise.repetitions,
          rest_time_seconds: exercise.rest_time_seconds,
        })),
      })),
    };

    form.reset(formData);
    setMode("manual");
    toast.success("PDF imported successfully", {
      description: "You can now edit the imported training plan.",
    });
  };

  const handlePdfUploadError = (error: string) => {
    toast.error("Error importing PDF", {
      description: error,
    });
  };

  const handleSave = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Validation Error", {
        description: "Please fix the form errors before saving.",
      });
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      setIsSaving(true);
      setIsLoading(true);

      const formData = form.getValues();

      // Validate that all required fields are present
      const validDays = formData.training_days.every((day) => day.weekday !== null);
      if (!validDays) {
        throw new Error("Please select a weekday for all training days");
      }

      const command: CreateCompleteTrainingPlanCommand = {
        name: formData.name,
        description: formData.description,
        source: formData.source,
        training_days: formData.training_days.map((day) => ({
          weekday: day.weekday as number,
          exercises: day.exercises.map((exercise) => ({
            exercise_name: exercise.exercise_name,
            order_index: exercise.order_index,
            sets: exercise.sets,
            repetitions: exercise.repetitions,
            rest_time_seconds: exercise.rest_time_seconds,
          })),
        })),
      };

      const response = await fetch("/api/training-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error("Failed to save training plan");
      }

      toast.success("Training plan saved successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <PlanModeSelector currentMode={mode} onModeChange={setMode} />

      {mode === "pdf" ? (
        <PdfPlanImporter
          onUploadSuccess={handlePdfUploadSuccess}
          onUploadError={handlePdfUploadError}
          setIsLoading={setIsLoading}
        />
      ) : (
        <ManualPlanForm form={form} />
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
          {isSaving ? "Saving..." : "Save Training Plan"}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Save Training Plan"
        description="Are you sure you want to save this training plan?"
        isLoading={isSaving}
      />
    </div>
  );
}
