import { VEHICLES_DATA, FILTER_OPTIONS } from "@/lib/constants"
import { supabase } from "@/lib/supabase"; // Import Supabase client

/**
 * Interface for vehicle data
 */
export interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
  price: number
  type: string
  transmission: string
  fuel: string
  image: string
  mileage: number
  engine: string
  power: string
  acceleration?: string
  topSpeed?: string
  features: string[]
  description?: string
  color?: string
  seats?: number
  images?: string[]
}

/**
 * Interface for filter options
 */
export interface VehicleFilters {
  brand?: string
  type?: string
  transmission?: string
  fuel?: string
  priceRange?: [number, number]
  yearRange?: [number, number]
  searchTerm?: string
}

/**
 * Service for vehicle-related operations
 * This simulates backend functionality that would typically be API calls
 */
export const VehicleService = {
  /**
   * Get all vehicles from Supabase
   * @returns Promise with array of vehicles
   */
  getAllVehicles: async (): Promise<Vehicle[]> => {
    // Simulate API call delay
    // await new Promise((resolve) => setTimeout(resolve, 300))
    // return VEHICLES_DATA
    const { data, error } = await supabase.from("vehicles").select("*");
    if (error) {
      console.error("Error fetching vehicles from Supabase:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Get vehicle by ID from Supabase
   * @param id Vehicle ID (string, as Supabase uses UUIDs or auto-incrementing int which might be treated as string in some contexts)
   * @returns Promise with vehicle data or null if not found
   */
  getVehicleById: async (id: string | number): Promise<Vehicle | null> => {
    // Simulate API call delay
    // await new Promise((resolve) => setTimeout(resolve, 200))
    // const vehicle = VEHICLES_DATA.find((v) => v.id === id)
    // return vehicle || null
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') { // PostgREST error for no rows found
        return null;
      }
      console.error(`Error fetching vehicle with id ${id}:`, error);
      throw error;
    }
    return data;
  },

  /**
   * Add a new vehicle to Supabase
   * @param vehicleData Data for the new vehicle
   * @returns Promise with the added vehicle data
   */
  addVehicle: async (vehicleData: Omit<Vehicle, 'id' | 'features'> & { features?: string }): Promise<Vehicle> => {
    // Convert features string to array if it exists
    const submissionData: any = { ...vehicleData };
    if (vehicleData.features && typeof vehicleData.features === 'string') {
      submissionData.features = vehicleData.features.split(',').map(f => f.trim());
    } else if (!vehicleData.features) {
      submissionData.features = []; // Default to empty array if not provided
    }

    const { data, error } = await supabase
      .from("vehicles")
      .insert([submissionData])
      .select()
      .single(); // Assuming insert returns the created record

    if (error) {
      console.error("Error adding vehicle to Supabase:", error);
      throw error;
    }
    return data;
  },

  /**
   * Update an existing vehicle in Supabase
   * @param id Vehicle ID
   * @param vehicleData Data to update
   * @returns Promise with the updated vehicle data
   */
  updateVehicle: async (id: string | number, vehicleData: Partial<Omit<Vehicle, 'id' | 'features'> & { features?: string }>): Promise<Vehicle | null> => {
    const submissionData: any = { ...vehicleData };
    if (vehicleData.features && typeof vehicleData.features === 'string') {
      submissionData.features = vehicleData.features.split(',').map(f => f.trim());
    } else if (vehicleData.features === undefined && 'features' in vehicleData) {
      // If features is explicitly set to undefined, handle as needed or remove if it means no change
      // For now, let's assume if 'features' key is present and undefined, it means clear them or set to empty array
      submissionData.features = [];
    }

    const { data, error } = await supabase
      .from("vehicles")
      .update(submissionData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating vehicle with id ${id}:`, error);
      throw error;
    }
    return data;
  },

  /**
   * Delete a vehicle from Supabase
   * @param id Vehicle ID
   * @returns Promise that resolves when deletion is successful
   */
  deleteVehicle: async (id: string | number): Promise<void> => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      console.error(`Error deleting vehicle with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get featured vehicles (top 3 by default)
   * @param count Number of vehicles to return
   * @returns Promise with array of featured vehicles
   */
  getFeaturedVehicles: async (count = 3): Promise<Vehicle[]> => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*") // Select all columns
      .limit(count); // Limit the number of results

    if (error) {
      console.error("Error fetching featured vehicles from Supabase:", error);
      // Return an empty array or re-throw, depending on desired error handling
      // For now, let's return empty array to avoid breaking the UI entirely
      return [];
    }
    // In a real app, you might want to add a specific column like 'is_featured' to sort by
    // or implement a more sophisticated logic for selecting featured vehicles.
    return data || [];
  },

  /**
   * Filter vehicles based on criteria
   * @param filters Filter criteria
   * @returns Promise with filtered vehicles array
   */
  filterVehicles: async (filters: VehicleFilters): Promise<Vehicle[]> => {
    // Simulate API call delay
    // await new Promise((resolve) => setTimeout(resolve, 400))

    // return VEHICLES_DATA.filter((vehicle) => {
    //   // Search term filter
    //   if (filters.searchTerm && filters.searchTerm !== "") {
    //     const searchTerm = filters.searchTerm.toLowerCase()
    //     const matchesBrand = vehicle.brand.toLowerCase().includes(searchTerm)
    //     const matchesModel = vehicle.model.toLowerCase().includes(searchTerm)

    //     if (!matchesBrand && !matchesModel) {
    //       return false
    //     }
    //   }

    //   // Brand filter
    //   if (filters.brand && filters.brand !== "Todos" && vehicle.brand !== filters.brand) {
    //     return false
    //   }

    //   // Type filter
    //   if (filters.type && filters.type !== "Todos" && vehicle.type !== filters.type) {
    //     return false
    //   }

    //   // Transmission filter
    //   if (filters.transmission && filters.transmission !== "Todos" && vehicle.transmission !== filters.transmission) {
    //     return false
    //   }

    //   // Fuel filter
    //   if (filters.fuel && filters.fuel !== "Todos" && vehicle.fuel !== filters.fuel) {
    //     return false
    //   }

    //   // Price range filter
    //   if (filters.priceRange) {
    //     const [minPrice, maxPrice] = filters.priceRange
    //     if (vehicle.price < minPrice || vehicle.price > maxPrice) {
    //       return false
    //     }
    //   }

    //   // Year range filter
    //   if (filters.yearRange) {
    //     const [minYear, maxYear] = filters.yearRange
    //     if (vehicle.year < minYear || vehicle.year > maxYear) {
    //       return false
    //     }
    //   }

    //   return true
    // })

    let query = supabase.from("vehicles").select("*");

    if (filters.searchTerm && filters.searchTerm !== "") {
      const searchTerm = filters.searchTerm.toLowerCase();
      query = query.or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
    }
    if (filters.brand && filters.brand !== "Todos") {
      query = query.eq("brand", filters.brand);
    }
    if (filters.type && filters.type !== "Todos") {
      query = query.eq("type", filters.type);
    }
    if (filters.transmission && filters.transmission !== "Todos") {
      query = query.eq("transmission", filters.transmission);
    }
    if (filters.fuel && filters.fuel !== "Todos") {
      query = query.eq("fuel", filters.fuel);
    }
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      query = query.gte("price", minPrice).lte("price", maxPrice);
    }
    if (filters.yearRange) {
      const [minYear, maxYear] = filters.yearRange;
      query = query.gte("year", minYear).lte("year", maxYear);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error filtering vehicles from Supabase:", error);
      throw error;
    }
    return data || [];
  },

  /**
   * Get available filter options
   * @returns Promise with filter options
   */
  getFilterOptions: async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return FILTER_OPTIONS
  },

  /**
   * Format price in CLP
   * @param price Price to format
   * @returns Formatted price string
   */
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(price)
  },

  /**
   * Calculate monthly payment
   * @param price Vehicle price
   * @param downPayment Down payment amount
   * @param months Loan term in months
   * @param interestRate Annual interest rate (as decimal)
   * @returns Monthly payment amount
   */
  calculateMonthlyPayment: (price: number, downPayment = 0, months = 48, interestRate = 0.0699): number => {
    const loanAmount = price - downPayment
    const monthlyRate = interestRate / 12
    const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    return Math.round(payment)
  },

  /**
   * Compare vehicles
   * @param vehicleIds Array of vehicle IDs to compare
   * @returns Promise with array of vehicles to compare
   */
  compareVehicles: async (vehicleIds: number[]): Promise<Vehicle[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return VEHICLES_DATA.filter((vehicle) => vehicleIds.includes(vehicle.id))
  },
}

export default VehicleService
