import { NextResponse } from "next/server";
import { UserService } from "@/lib/services/user-service";
import { supabase } from "@/lib/supabase"; // We need this to get the current user session server-side

export async function GET(request: Request) {
  try {
    // No need for userId from query params, UserService handles auth
    const favoriteIds = await UserService.getFavoriteVehicleIds();

    return NextResponse.json({ favorites: favoriteIds });
  } catch (error) {
    console.error("Error processing GET favorites request:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: "Error interno del servidor: " + errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { vehicleId } = await request.json();

    if (typeof vehicleId !== 'number') {
      return NextResponse.json({ error: "Se requiere el ID del vehículo (vehicleId) y debe ser un número." }, { status: 400 });
    }

    // UserService.toggleFavorite will handle getting the authenticated user
    const updatedFavorites = await UserService.toggleFavorite(vehicleId);

    return NextResponse.json({ 
      success: true, 
      message: "Favorito actualizado correctamente.", 
      favorites: updatedFavorites 
    });

  } catch (error) {
    console.error("Error processing POST favorites request:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: "Error interno del servidor: " + errorMessage }, { status: 500 });
  }
}
