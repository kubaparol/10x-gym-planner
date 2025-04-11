import { OpenAI } from "openai";
import type { ResponseUsage } from "openai/resources/responses/responses.mjs";

interface OpenAIServiceConfig {
  apiKey: string;
  modelName: string;
  modelParams: {
    temperature: number;
    topP: number;
    maxTokens: number;
  };
}

interface FileUploadResponse {
  fileId: string;
  filename: string;
  status: "success" | "error";
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  error?: string;
}

interface ChatResponse {
  content: string;
  role: "assistant";
  usage?: ResponseUsage;
}

interface StructuredOutputConfig {
  format: {
    type: "json_schema";
    name: string;
    schema: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
      additionalProperties?: boolean;
    };
  };
}

/**
 * Service for interacting with OpenAI API
 * Handles chat completions, file uploads, and file management
 */
export class OpenAIService {
  private readonly client: OpenAI;
  private readonly modelName: string;
  private readonly modelParams: OpenAIServiceConfig["modelParams"];
  private readonly logger: Console;

  constructor(config: Partial<OpenAIServiceConfig> = {}) {
    // Validate and set up configuration
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OpenAI API key is required. Please provide it in constructor or set OPENAI_API_KEY environment variable."
      );
    }

    this.client = new OpenAI({ apiKey });

    this.modelName = config.modelName || "gpt-4o-mini";
    this.modelParams = {
      temperature: config.modelParams?.temperature ?? 0.7,
      topP: config.modelParams?.topP ?? 1,
      maxTokens: config.modelParams?.maxTokens ?? 2000,
    };

    this.logger = console;
  }

  /**
   * Sends a chat completion request to OpenAI with file analysis
   * @param fileId The ID of the file to analyze
   * @param systemMessage The system message providing context
   * @param userMessage The user's message
   * @returns Promise<ChatResponse>
   */
  public async chatCompletionWithFile<T = unknown>(
    fileId: string,
    systemMessage: string,
    userMessage: string,
    structuredOutput?: StructuredOutputConfig
  ): Promise<ChatResponse & { parsedOutput?: T }> {
    try {
      const response = await this.client.responses.create({
        model: this.modelName,
        input: [
          { role: "system", content: systemMessage },
          {
            role: "user",
            content: [
              { type: "input_file", file_id: fileId },
              { type: "input_text", text: userMessage },
            ],
          },
        ],
        temperature: this.modelParams.temperature,
        max_output_tokens: this.modelParams.maxTokens,
        ...(structuredOutput && { text: structuredOutput }),
      });

      if (!response.output_text) {
        throw new Error("Invalid response format from OpenAI API");
      }

      const result: ChatResponse & { parsedOutput?: T } = {
        content: response.output_text,
        role: "assistant",
        usage: response.usage,
      };

      if (structuredOutput) {
        try {
          result.parsedOutput = JSON.parse(response.output_text) as T;
        } catch (error) {
          this.logger.error("Failed to parse structured output:", error);
          throw new Error("Failed to parse structured output from OpenAI API");
        }
      }

      return result;
    } catch (error) {
      this.logger.error("Chat completion error:", error);
      throw error;
    }
  }

  /**
   * Uploads a file to OpenAI
   * @param file The file to upload
   * @returns Promise<FileUploadResponse>
   */
  public async uploadFile(file: File): Promise<FileUploadResponse> {
    try {
      const response = await this.client.files.create({
        file: file,
        purpose: "assistants",
      });

      return {
        fileId: response.id,
        filename: response.filename,
        status: "success",
      };
    } catch (error) {
      this.logger.error("File upload error:", error);
      return {
        fileId: "",
        filename: file.name,
        status: "error",
        error: (error as Error).message,
      };
    }
  }

  /**
   * Deletes a file from OpenAI
   * @param fileId The ID of the file to delete
   * @returns Promise<DeleteResponse>
   */
  public async deleteFile(fileId: string): Promise<DeleteResponse> {
    try {
      const response = await this.client.files.del(fileId);
      return {
        success: response.deleted,
      };
    } catch (error) {
      this.logger.error("File deletion error:", error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}
