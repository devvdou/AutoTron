import { NextResponse } from "next/server";
import { ContactService, ContactFormData } from "@/lib/services/contact-service";

export async function POST(request: Request) {
  try {
    const formData = (await request.json()) as ContactFormData;

    // Basic validation, ContactService will also validate
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son obligatorios." },
        { status: 400 }
      );
    }

    const result = await ContactService.submitContactForm(formData);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 }); // Or 500 depending on error type
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      // Optionally, you might not need to return any specific data for contact form submission
      // data: {} // Or remove if not needed
    });
  } catch (error) {
    console.error("Error processing contact request:", error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: "Error interno del servidor: " + errorMessage }, { status: 500 });
  }
}
