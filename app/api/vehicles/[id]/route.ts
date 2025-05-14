import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await supabaseServer.from("vehicles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching vehicle:", error)
      return NextResponse.json({ error: "Error al obtener el vehículo" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ vehicle: data })
  } catch (error) {
    console.error("Error processing vehicle request:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    const { data: updatedVehicle, error } = await supabaseServer.from("vehicles").update(data).eq("id", id).select()

    if (error) {
      console.error("Error updating vehicle:", error)
      return NextResponse.json({ error: "Error al actualizar el vehículo" }, { status: 500 })
    }

    return NextResponse.json({ vehicle: updatedVehicle[0] })
  } catch (error) {
    console.error("Error processing vehicle update:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
