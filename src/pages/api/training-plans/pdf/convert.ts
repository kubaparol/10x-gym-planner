import type { APIRoute } from "astro";
import { PdfImportService } from "../../../../lib/services/pdf-import.service";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !file.name.endsWith(".pdf")) {
      return new Response(
        JSON.stringify({
          error: "Invalid file - only PDF files are supported",
        }),
        { status: 400 }
      );
    }

    const pdfImportService = new PdfImportService();
    const plan = await pdfImportService.convertPdfToPlan(file);

    return new Response(JSON.stringify({ plan }), { status: 200 });
  } catch (error) {
    console.error("Error converting PDF to training plan:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
