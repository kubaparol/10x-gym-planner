// DTO and Command Model definitions for the API based on the database models and API plan.

// Common types
export type UUID = string;
export type Timestamp = string;

// -------------------------------
// Pagination
// -------------------------------
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

// -------------------------------
// Training Plan DTOs & Commands
// -------------------------------

// Represents a training plan in a list
export interface TrainingPlanListDTO {
  id: UUID;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Timestamp;
}

export interface TrainingPlanListResponseDTO {
  plans: TrainingPlanListDTO[];
  pagination: PaginationDTO;
}

// Command to create a new training plan
export interface CreateTrainingPlanCommand {
  name: string;
  description: string;
  is_active?: boolean;
}

export interface CreateTrainingPlanResponseDTO {
  id: UUID;
  message: string;
}

// Detailed view of a training plan, including its training days
export interface TrainingPlanDetailsDTO {
  id: UUID;
  name: string;
  description: string | null;
  is_active: boolean;
  training_days: TrainingDayDTO[];
}

// Generic delete response
export interface DeleteResponseDTO {
  message: string;
}

// -------------------------------
// Training Day DTOs & Commands
// -------------------------------

export interface TrainingDayDTO {
  id: UUID;
  weekday: number;
  created_at: Timestamp;
}

// Command to create a new training day
export interface CreateTrainingDayCommand {
  weekday: number;
}

export interface CreateTrainingDayResponseDTO {
  id: UUID;
  message: string;
}

export interface ListTrainingDaysResponseDTO {
  training_days: TrainingDayDTO[];
}

// -------------------------------
// Training Day Exercise DTOs & Commands
// -------------------------------

// Command to add an exercise to a training day
export interface AddExerciseToTrainingDayCommand {
  exercise_id: UUID;
  order_index?: number;
  sets: number;
  repetitions: number;
  rest_time_seconds: number;
}

export interface AddExerciseToTrainingDayResponseDTO {
  id: UUID;
  message: string;
}

// Basic Exercise DTO used within Training Day Exercise
export interface ExerciseDTO {
  id: UUID;
  name: string;
}

// Represents an exercise added to a training day
export interface TrainingDayExerciseDTO {
  id: UUID;
  exercise: ExerciseDTO;
  order_index: number;
  sets: number;
  repetitions: number;
  rest_time_seconds: number;
}

export interface ListTrainingDayExercisesResponseDTO {
  exercises: TrainingDayExerciseDTO[];
}

// -------------------------------
// Exercise DTOs & Commands
// -------------------------------

// Command to create a new exercise
export interface CreateExerciseCommand {
  name: string;
}

export interface CreateExerciseResponseDTO {
  id: UUID;
  message: string;
}

export interface ListExercisesResponseDTO {
  exercises: ExerciseDTO[];
}

// -------------------------------
// Exercise Set DTOs & Commands
// -------------------------------

// Command to record a new exercise set
export interface RecordExerciseSetCommand {
  weight: number;
  repetitions: number;
  performed_at?: Timestamp;
}

export interface RecordExerciseSetResponseDTO {
  id: UUID;
  message: string;
}

// Represents an exercise set
export interface ExerciseSetDTO {
  id: UUID;
  weight: number | null;
  repetitions: number;
  performed_at: Timestamp;
}

export interface ListExerciseSetsResponseDTO {
  sets: ExerciseSetDTO[];
}

// -------------------------------
// Workout Flow DTOs & Commands
// -------------------------------

// DTO for today's workout
export interface TodayWorkoutDTO {
  training_plan: TrainingPlanListDTO;
  training_day: TrainingDayDTO;
  exercises: TrainingDayExerciseDTO[];
}

// A single completed workout set command
export interface CompletedWorkoutSet {
  training_day_exercise_id: UUID;
  weight: number;
  repetitions: number;
}

// Command to complete a workout session
export interface CompleteWorkoutSessionCommand {
  sets: CompletedWorkoutSet[];
}

export interface CompleteWorkoutSessionResponseDTO {
  message: string;
}

// Summary of a workout for history listing
export interface WorkoutSummaryDTO {
  id: UUID;
  date: Timestamp;
  details: Record<string, unknown>; // flexible structure for summary details
}

export interface WorkoutHistoryResponseDTO {
  workouts: WorkoutSummaryDTO[];
  pagination: PaginationDTO;
}

// Detailed view of a workout session
export interface WorkoutDetailsDTO {
  id: UUID;
  date: Timestamp;
  exercises: TrainingDayExerciseDTO[]; // includes set and exercise details
}

// -------------------------------
// PDF Conversion DTOs
// -------------------------------

export interface PDFUploadResponseDTO {
  import_id: UUID;
  message: string;
}

export interface PDFConversionCandidateDTO {
  import_id: UUID;
  candidate_plan: TrainingPlanDetailsDTO | Record<string, unknown>;
  status: "pending" | "reviewed";
}
