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

      const systemPrompt = `You are a professional fitness trainer assistant. Analyze the provided PDF training plan and extract its structure.`;

      const userPrompt = `Please analyze the provided PDF file and extract the training plan data.`;

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
              required: ["name", "description", "training_days"],
              additionalProperties: false,
            },
          },
        }
      );

      await this.openAIService.deleteFile(uploadResponse.fileId);

      if (!completion.parsedOutput) {
        throw new Error("Failed to parse training plan data from OpenAI response");
      }

      return completion.parsedOutput;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during processing";
      throw new Error(`PDF processing failed: ${errorMessage}`);
    }
  }
}
