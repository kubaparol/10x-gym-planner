import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { OpenAIService } from "../openai.service";
import { OpenAI } from "openai";

// Mock OpenAI
vi.mock("openai", () => {
  return {
    OpenAI: vi.fn(() => ({
      responses: {
        create: vi.fn(),
      },
      files: {
        create: vi.fn(),
        del: vi.fn(),
      },
    })),
  };
});

describe("OpenAIService", () => {
  // Setup environment for tests
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.OPENAI_API_KEY = "test-api-key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("constructor", () => {
    it("should initialize with provided config", () => {
      const config = {
        apiKey: "custom-api-key",
        modelName: "custom-model",
        modelParams: {
          temperature: 0.5,
          topP: 0.8,
          maxTokens: 1000,
        },
      };

      new OpenAIService(config);

      expect(OpenAI).toHaveBeenCalledWith({ apiKey: "custom-api-key" });
    });

    it("should use environment API key if not provided in config", () => {
      new OpenAIService();

      expect(OpenAI).toHaveBeenCalledWith({ apiKey: "test-api-key" });
    });

    it("should throw error if no API key is available", () => {
      delete process.env.OPENAI_API_KEY;

      expect(() => new OpenAIService()).toThrow(
        "OpenAI API key is required. Please provide it in constructor or set OPENAI_API_KEY environment variable."
      );
    });

    it("should use default model parameters if not provided", () => {
      new OpenAIService();

      // We can't directly test private properties, but we can test the behavior
      // that depends on these properties in other tests
      expect(OpenAI).toHaveBeenCalled();
    });
  });

  describe("chatCompletionWithFile", () => {
    let service: OpenAIService;
    const mockOpenAIInstance = {
      responses: {
        create: vi.fn(),
      },
      files: {
        create: vi.fn(),
        del: vi.fn(),
      },
    };

    beforeEach(() => {
      (OpenAI as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockOpenAIInstance);
      service = new OpenAIService();
    });

    it("should call OpenAI API with correct parameters", async () => {
      const fileId = "file-123";
      const systemMessage = "system message";
      const userMessage = "user message";

      mockOpenAIInstance.responses.create.mockResolvedValueOnce({
        output_text: "response text",
        usage: { total_tokens: 100 },
      });

      await service.chatCompletionWithFile(fileId, systemMessage, userMessage);

      expect(mockOpenAIInstance.responses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: expect.any(String),
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
        })
      );
    });

    it("should return properly formatted response", async () => {
      mockOpenAIInstance.responses.create.mockResolvedValueOnce({
        output_text: "response text",
        usage: { total_tokens: 100 },
      });

      const result = await service.chatCompletionWithFile("file-123", "system", "user");

      expect(result).toEqual({
        content: "response text",
        role: "assistant",
        usage: { total_tokens: 100 },
      });
    });

    it("should parse structured output when provided", async () => {
      const outputJson = { result: "success", data: [1, 2, 3] };
      mockOpenAIInstance.responses.create.mockResolvedValueOnce({
        output_text: JSON.stringify(outputJson),
        usage: { total_tokens: 100 },
      });

      const structuredOutputConfig = {
        format: {
          type: "json_schema" as const,
          name: "TestOutput",
          schema: {
            type: "object" as const,
            properties: {
              result: { type: "string" },
              data: { type: "array" },
            },
            required: ["result"],
          },
        },
      };

      const result = await service.chatCompletionWithFile<typeof outputJson>(
        "file-123",
        "system",
        "user",
        structuredOutputConfig
      );

      expect(result.parsedOutput).toEqual(outputJson);
    });

    it("should throw error if API returns invalid response", async () => {
      mockOpenAIInstance.responses.create.mockResolvedValueOnce({});

      await expect(service.chatCompletionWithFile("file-123", "system", "user")).rejects.toThrow(
        "Invalid response format from OpenAI API"
      );
    });

    it("should throw error if structured output parsing fails", async () => {
      mockOpenAIInstance.responses.create.mockResolvedValueOnce({
        output_text: "invalid json",
        usage: { total_tokens: 100 },
      });

      const structuredOutputConfig = {
        format: {
          type: "json_schema" as const,
          name: "TestOutput",
          schema: {
            type: "object" as const,
            properties: {},
          },
        },
      };

      await expect(
        service.chatCompletionWithFile("file-123", "system", "user", structuredOutputConfig)
      ).rejects.toThrow("Failed to parse structured output from OpenAI API");
    });

    it("should propagate OpenAI API errors", async () => {
      const testError = new Error("API error");
      mockOpenAIInstance.responses.create.mockRejectedValueOnce(testError);

      await expect(service.chatCompletionWithFile("file-123", "system", "user")).rejects.toThrow("API error");
    });
  });

  describe("uploadFile", () => {
    let service: OpenAIService;
    const mockOpenAIInstance = {
      responses: {
        create: vi.fn(),
      },
      files: {
        create: vi.fn(),
        del: vi.fn(),
      },
    };

    beforeEach(() => {
      (OpenAI as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockOpenAIInstance);
      service = new OpenAIService();
    });

    it("should upload file successfully", async () => {
      const mockFile = new File(["test"], "test.txt");
      mockOpenAIInstance.files.create.mockResolvedValueOnce({
        id: "file-123",
        filename: "test.txt",
      });

      const result = await service.uploadFile(mockFile);

      expect(result).toEqual({
        fileId: "file-123",
        filename: "test.txt",
        status: "success",
      });
      expect(mockOpenAIInstance.files.create).toHaveBeenCalledWith({
        file: mockFile,
        purpose: "assistants",
      });
    });

    it("should handle upload errors gracefully", async () => {
      const mockFile = new File(["test"], "test.txt");
      const testError = new Error("Upload failed");
      mockOpenAIInstance.files.create.mockRejectedValueOnce(testError);

      const result = await service.uploadFile(mockFile);

      expect(result).toEqual({
        fileId: "",
        filename: "test.txt",
        status: "error",
        error: "Upload failed",
      });
    });
  });

  describe("deleteFile", () => {
    let service: OpenAIService;
    const mockOpenAIInstance = {
      responses: {
        create: vi.fn(),
      },
      files: {
        create: vi.fn(),
        del: vi.fn(),
      },
    };

    beforeEach(() => {
      (OpenAI as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockOpenAIInstance);
      service = new OpenAIService();
    });

    it("should delete file successfully", async () => {
      mockOpenAIInstance.files.del.mockResolvedValueOnce({
        deleted: true,
      });

      const result = await service.deleteFile("file-123");

      expect(result).toEqual({
        success: true,
      });
      expect(mockOpenAIInstance.files.del).toHaveBeenCalledWith("file-123");
    });

    it("should handle deletion errors gracefully", async () => {
      const testError = new Error("Deletion failed");
      mockOpenAIInstance.files.del.mockRejectedValueOnce(testError);

      const result = await service.deleteFile("file-123");

      expect(result).toEqual({
        success: false,
        error: "Deletion failed",
      });
    });
  });
});
