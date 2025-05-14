import { supabase } from "../supabase";

/**
 * Interface for user data
 */
export interface User {
  id: string; // Supabase Auth User ID
  name: string | null;
  email: string | undefined;
  phone?: string | null;
  role?: 'admin' | 'user'; // ADDED: User role
  // These will be fetched by dedicated functions or populated if needed
  // favorites: number[];
  // testDrives: TestDrive[];
  // inquiries: Inquiry[];
}

/**
 * Interface for test drive data
 */
export interface TestDrive {
  id: string; // UUID or serial, depending on DB schema
  user_id: string; // Supabase Auth User ID
  vehicle_id: number;
  date: string;
  time: string;
  name: string; // Name of the person for the test drive
  email: string; // Email for the test drive contact
  phone?: string | null; // Phone for the test drive contact
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
}

/**
 * Interface for inquiry data
 */
export interface Inquiry {
  id: string; // UUID or serial, depending on DB schema
  user_id: string;
  vehicle_id?: number;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  created_at: string;
}

/**
 * Service for user-related operations using Supabase
 */
export const UserService = {
  /**
   * Obtener datos del usuario actual solo si es el admin
   */
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      // Manejar sesión ausente sin lanzar error
      return null;
    }
    // Solo permitir acceso al admin (correo fijo)
    const adminEmail = "admin@autotron.com"; // Cambia este correo por el del dueño
    const isAdminUser = authUser.email === adminEmail;

    // Si no es admin y la política es devolver null para no admins, descomentar la siguiente línea:
    // if (!isAdminUser) return null;
    // O, si se quiere devolver un usuario normal sin rol de admin:
    // if (!isAdminUser) {
    //   return {
    //     id: authUser.id,
    //     email: authUser.email,
    //     name: authUser.user_metadata?.full_name || null,
    //     phone: authUser.phone || null,
    //     role: 'user'
    //   };
    // }
    // Por ahora, si no es admin, se devuelve null como antes para mantener la lógica original de acceso restringido.
    if (!isAdminUser) {
        return null;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, phone")
      .eq("id", authUser.id)
      .single();
    if (error) {
      // Si hay un error al buscar en 'profiles' pero es el admin, devolver datos básicos con rol admin
      if (isAdminUser) {
        return {
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || null,
          phone: authUser.phone || null,
          role: 'admin',
        };
      }
      return null; // Si no es admin y hay error, devuelve null
    }
    // Si se encuentran datos en 'profiles' y es admin, añadir rol admin
    return data ? { ...data, email: authUser.email, role: isAdminUser ? 'admin' : 'user' } : null;
  },
  /**
   * Actualizar perfil solo si es admin
   */
  updateProfile: async (userData: Partial<Pick<User, 'name' | 'phone'>>): Promise<User | null> => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    const adminEmail = "admin@autotron.com";
    if (authError || !authUser || authUser.email !== adminEmail) {
      console.error("User not authenticated for profile update");
      return null;
    }
    const { data, error } = await supabase
      .from("profiles")
      .update({ name: userData.name, phone: userData.phone })
      .eq("id", authUser.id)
      .select("id, name, email, phone")
      .single();
    if (error) {
      console.error("Error updating profile:", error.message);
      return null;
    }
    return data ? { ...data, email: authUser.email } : null;
  },
  /**
   * Solo el admin puede marcar favoritos
   */
  toggleFavorite: async (vehicleId: number): Promise<number[]> => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    const adminEmail = "admin@autotron.com";
    if (authError || !authUser || authUser.email !== adminEmail) {
      console.error("Solo el admin puede modificar favoritos");
      return [];
    }
    const { data: existingFavorite, error: fetchError } = await supabase
      .from("user_favorites")
      .select("*")
      .eq("user_id", authUser.id)
      .eq("vehicle_id", vehicleId)
      .maybeSingle();
    if (fetchError) {
      console.error("Error checking favorite status:", fetchError.message);
      return await UserService.getFavoriteVehicleIds();
    }
    if (existingFavorite) {
      const { error: deleteError } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", authUser.id)
        .eq("vehicle_id", vehicleId);
      if (deleteError) {
        console.error("Error removing favorite:", deleteError.message);
      }
    } else {
      const { error: insertError } = await supabase
        .from("user_favorites")
        .insert({ user_id: authUser.id, vehicle_id: vehicleId });
      if (insertError) {
        console.error("Error adding favorite:", insertError.message);
      }
    }
    return await UserService.getFavoriteVehicleIds();
  },
  /**
   * Solo el admin puede ver favoritos
   */
  getFavoriteVehicleIds: async (): Promise<number[]> => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    const adminEmail = "admin@autotron.com";
    if (authError || !authUser || authUser.email !== adminEmail) return [];
    const { data, error } = await supabase
      .from("user_favorites")
      .select("vehicle_id")
      .eq("user_id", authUser.id);
    if (error) {
      console.error("Error fetching favorite IDs:", error.message);
      return [];
    }
    return data ? data.map(fav => fav.vehicle_id) : [];
  },
  /**
   * Solo el admin puede consultar si un vehículo es favorito
   */
  isFavorite: async (vehicleId: number): Promise<boolean> => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    const adminEmail = "admin@autotron.com";
    if (authError || !authUser || authUser.email !== adminEmail) return false;
    const { data, error } = await supabase
      .from("user_favorites")
      .select("vehicle_id")
      .eq("user_id", authUser.id)
      .eq("vehicle_id", vehicleId)
      .maybeSingle();
    if (error) {
      console.error("Error checking if favorite:", error.message);
      return false;
    }
    return !!data;
  },
};

export default UserService
