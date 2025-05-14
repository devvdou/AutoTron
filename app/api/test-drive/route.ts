import { NextResponse } from "next/server";
import { UserService, TestDrive } from "@/lib/services/user-service";

// Define a type for the expected request body, excluding fields managed by the service
interface TestDriveRequestBody extends Omit<TestDrive, "id" | "user_id" | "status" | "created_at"> {}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields from the original API structure
    // UserService.scheduleTestDrive will expect vehicle_id, date, time, name, email. Phone and notes are optional.
    const { vehicle_id, date, time, name, email, phone, notes } = body as TestDriveRequestBody;

    if (!vehicle_id || !date || !time || !name || !email) {
      return NextResponse.json(
        { error: "Los campos vehicle_id, date, time, name, y email son obligatorios." },
        { status: 400 }
      );
    }

    // Prepare data for the service. user_id will be handled by UserService based on auth.
    const testDriveData: Omit<TestDrive, "id" | "user_id" | "status" | "created_at"> = {
      vehicle_id,
      date,
      time,
      name,
      email,
      phone: phone || null, // Ensure phone is null if not provided
      notes: notes || undefined,
    };

    const scheduledTestDrive = await UserService.scheduleTestDrive(testDriveData);

    if (!scheduledTestDrive) {
      return NextResponse.json(
        { error: "Error al agendar la prueba de manejo. El usuario podría no estar autenticado o hubo un error en el servidor." },
        { status: 500 } // Or 401 if auth is the primary suspect and you can determine that
      );
    }

    return NextResponse.json({
      success: true,
      message: "¡Prueba de manejo agendada con éxito! Nos pondremos en contacto pronto para confirmar.",
      data: scheduledTestDrive,
    });
  } catch (error) {
    console.error("Error processing test drive request:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: "Error interno del servidor: " + errorMessage }, { status: 500 });
  }
}
