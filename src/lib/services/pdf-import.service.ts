import type { CreateCompleteTrainingPlanCommand } from "../../types";

export class PdfImportService {
  async convertPdfToPlan(file: File): Promise<CreateCompleteTrainingPlanCommand> {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock PDF processing - in reality this would use AI to extract data
    return {
      name: file.name.replace(".pdf", ""),
      description: "Training plan extracted from PDF file",
      training_days: [
        {
          weekday: 1, // Monday
          exercises: [
            {
              exercise_name: "Bench Press",
              order_index: 1,
              sets: 3,
              repetitions: 12,
              rest_time_seconds: 60,
            },
            {
              exercise_name: "Squat",
              order_index: 2,
              sets: 4,
              repetitions: 10,
              rest_time_seconds: 90,
            },
          ],
        },
        {
          weekday: 3, // Wednesday
          exercises: [
            {
              exercise_name: "Deadlift",
              order_index: 1,
              sets: 3,
              repetitions: 8,
              rest_time_seconds: 120,
            },
            {
              exercise_name: "Pull-ups",
              order_index: 2,
              sets: 4,
              repetitions: 12,
              rest_time_seconds: 60,
            },
          ],
        },
      ],
    };
  }
}
