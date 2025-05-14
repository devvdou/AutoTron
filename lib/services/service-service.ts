import { supabase } from "@/lib/supabase";

export interface Service {
  id: number; // O string, dependiendo de cómo Supabase genere/devuelva los IDs
  name: string;
  description: string;
  price?: number | null;
  image_url?: string | null;
  duration?: string | null;
  // created_at?: string;
  // updated_at?: string;
}

export const ServiceService = {
  getAllServices: async (): Promise<Service[]> => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Error al obtener servicios:", error);
      throw error;
    }
    return data || [];
  },
  getServiceById: async (id: number): Promise<Service | null> => {
    const { data, error } = await supabase.from("services").select("*").eq("id", id).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error(`Error al obtener servicio con id ${id}:`, error);
      throw error;
    }
    return data;
  },
  addService: async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
    const { data, error } = await supabase.from("services").insert([serviceData]).select().single();
    if (error) {
      console.error("Error al agregar servicio:", error);
      throw error;
    }
    return data;
  },
  updateService: async (id: number, serviceData: Partial<Omit<Service, 'id'>>): Promise<Service | null> => {
    const { data, error } = await supabase.from("services").update(serviceData).eq("id", id).select().single();
    if (error) {
      console.error(`Error al actualizar servicio con id ${id}:`, error);
      throw error;
    }
    return data;
  },
  deleteService: async (id: number): Promise<void> => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error(`Error al eliminar servicio con id ${id}:`, error);
      throw error;
    }
  },
  // Nueva función para subir imágenes de servicios
  uploadServiceImage: async (file: File, filePath: string): Promise<string | null> => {
    // Subir la imagen al bucket 'service-images'
    const { data, error } = await supabase.storage.from("service-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (error || !data) {
      let mensajeError = "Error al subir imagen de servicio: ";
      if (error) {
        mensajeError += JSON.stringify(error);
      } else {
        mensajeError += "Respuesta vacía de Supabase.";
      }
      console.error(mensajeError);
      throw new Error(mensajeError);
    }
    // Verificar que la imagen se subió correctamente
    if (!data.path) {
      throw new Error("No se obtuvo la ruta de la imagen subida.");
    }
    // Obtener la URL pública de la imagen subida
    const { data: publicUrlData, error: publicUrlError } = supabase.storage.from("service-images").getPublicUrl(data.path);
    if (publicUrlError || !publicUrlData || !publicUrlData.publicUrl) {
      let mensajeError = "Error al obtener URL pública de la imagen: ";
      if (publicUrlError) {
        mensajeError += JSON.stringify(publicUrlError);
      } else {
        mensajeError += "Respuesta vacía al obtener la URL pública.";
      }
      console.error(mensajeError);
      throw new Error(mensajeError);
    }
    return publicUrlData.publicUrl;
  },
};

export default ServiceService;