import type { CreateCompleteTrainingPlanCommand } from "../../types";
import { OpenAIService } from "./openai.service";

export class PdfImportService {
  private readonly openAIService: OpenAIService;

  constructor(openAIConfig?: { apiKey: string }) {
    this.openAIService = new OpenAIService({
      apiKey: openAIConfig?.apiKey,
    });
  }

  async convertPdfToPlan(file: File): Promise<CreateCompleteTrainingPlanCommand> {
    try {
      // Step 1: Upload the PDF file to OpenAI
      const uploadResponse = await this.openAIService.uploadFile(file);
      if (uploadResponse.status === "error" || !uploadResponse.fileId) {
        throw new Error(`Failed to upload PDF: ${uploadResponse.error}`);
      }

      const systemPrompt = `You are a professional fitness trainer assistant specialized in analyzing training plan PDFs. Your task is to extract structured training plan data ONLY if the PDF contains a valid training plan with exercises, sets, and repetitions.

IMPORTANT VALIDATION RULES:
1. If the PDF contains a valid training plan:
   - Set status to "ok"
   - Fill in all required fields with extracted data
2. If the PDF is invalid or doesn't contain a proper training plan:
   - Set status to "error"
3. Only extract data if you are 100% certain about the values
4. Do not make assumptions or fill in missing data
5. Each exercise must have clearly specified sets, repetitions and rest times`;

      const userPrompt = `Analyze the provided PDF file and extract the training plan data following these rules:
1. First, verify if this is actually a training plan document
2. If it's not a valid training plan or required data is missing:
   - Return response with status "error"
3. If it is a valid training plan:
   - Set status to "ok"
   - Extract only information that is explicitly stated
   - Ensure all exercises have complete data
4. Never make assumptions about missing values`;

      const completion = await this.openAIService.chatCompletionWithFile<CreateCompleteTrainingPlanCommand>(
        uploadResponse.fileId,
        systemPrompt,
        userPrompt,
        {
          format: {
            type: "json_schema",
            name: "training_plan",
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["ok", "error"],
                },
                name: { type: "string" },
                description: { type: "string" },
                training_days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      weekday: {
                        type: "integer",
                      },
                      exercises: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            exercise_name: { type: "string" },
                            order_index: { type: "integer" },
                            sets: { type: "integer" },
                            repetitions: { type: "integer" },
                            rest_time_seconds: { type: "integer" },
                          },
                          required: ["exercise_name", "order_index", "sets", "repetitions", "rest_time_seconds"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["weekday", "exercises"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["status", "name", "description", "training_days"],
              additionalProperties: false,
            },
          },
        }
      );

      await this.openAIService.deleteFile(uploadResponse.fileId);

      if (!completion.parsedOutput) {
        throw new Error("Failed to parse training plan data from OpenAI response");
      }

      if ("error" in completion.parsedOutput) {
        throw new Error(`Invalid training plan: ${completion.parsedOutput.error}`);
      }

      return completion.parsedOutput;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during processing";
      throw new Error(`PDF processing failed: ${errorMessage}`);
    }
  }
}
