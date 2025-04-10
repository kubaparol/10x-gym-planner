import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, Upload } from "lucide-react";
import type { PdfTrainingPlanImportResponseDTO } from "../../types";

interface PdfPlanImporterProps {
  onUploadSuccess: (data: PdfTrainingPlanImportResponseDTO) => void;
  onUploadError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export function PdfPlanImporter({ onUploadSuccess, onUploadError, setIsLoading }: PdfPlanImporterProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Please select a PDF file");
      onUploadError("Invalid file type. Please select a PDF file.");
      return;
    }

    try {
      setIsUploading(true);
      setIsLoading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/training-plans/pdf/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF file");
      }

      const data: PdfTrainingPlanImportResponseDTO = await response.json();
      onUploadSuccess(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload PDF";
      setUploadError(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setIsUploading(false);
      setIsLoading(false);
      // Reset the file input
      event.target.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Training Plan from PDF</CardTitle>
        <CardDescription>
          Upload a PDF file containing your training plan. We&apos;ll try to extract the structure automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <label
            htmlFor="pdf-upload"
            className={`
              flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed rounded-lg cursor-pointer 
              hover:bg-muted/50 transition-colors
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF files only</p>
                </>
              )}
            </div>
            <input
              id="pdf-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
