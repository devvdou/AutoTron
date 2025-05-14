import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get("brand")
    const type = searchParams.get("type")
    const transmission = searchParams.get("transmission")
    const fuel = searchParams.get("fuel")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minYear = searchParams.get("minYear")
    const maxYear = searchParams.get("maxYear")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const featured = searchParams.get("featured") === "true"

    let query = supabaseServer.from("vehicles").select("*")

    // Apply filters
    if (brand && brand !== "Todos") {
      query = query.eq("brand", brand)
    }

    if (type && type !== "Todos") {
      query = query.eq("type", type)
    }

    if (transmission && transmission !== "Todos") {
      query = query.eq("transmission", transmission)
    }

    if (fuel && fuel !== "Todos") {
      query = query.eq("fuel", fuel)
    }

    if (minPrice && maxPrice) {
      query = query.gte("price", minPrice).lte("price", maxPrice)
    } else if (minPrice) {
      query = query.gte("price", minPrice)
    } else if (maxPrice) {
      query = query.lte("price", maxPrice)
    }

    if (minYear && maxYear) {
      query = query.gte("year", minYear).lte("year", maxYear)
    } else if (minYear) {
      query = query.gte("year", minYear)
    } else if (maxYear) {
      query = query.lte("year", maxYear)
    }

    if (search) {
      query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%`)
    }

    if (featured) {
      query = query.eq("featured", true)
    }

    // Apply limit if specified
    if (limit) {
      query = query.limit(limit)
    }

    // Order by newest first
    query = query.order("year", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching vehicles:", error)
      return NextResponse.json({ error: "Error al obtener los vehículos" }, { status: 500 })
    }

    return NextResponse.json({ vehicles: data })
  } catch (error) {
    console.error("Error processing vehicles request:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
