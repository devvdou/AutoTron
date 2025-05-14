"use client";

import React, { useEffect, useState, useRef } from "react"; // Remove direct `use` import, rely on React.use
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image"; // ADDED
import ServiceService from "@/lib/services/service-service"; // ADDED

// Define a type for Service data (adjust as per your actual Service schema)
interface ServiceFormData {
  id?: string;
  name?: string;
  description?: string;
  price?: number | string; // Allow string for input, convert to number on submit
  duration?: string; // e.g., "30 mins", "1 hour"
  image_url?: string; // ADDED
  // Add other relevant fields for a service
}

interface EditServicePageProps {
  params: { id: string }; // Mimic EditVehiclePage, params is an object to be unwrapped
}

import { Edit3 } from 'lucide-react'; 

const EditServicePage = ({ params }: { params: Promise<{ id: string }> }) => { // Type params as Promise, as per Next.js docs
  const unwrappedParams = React.use(params); // Use React.use()
  const id = unwrappedParams.id; // Get id from unwrapped params
  console.log("[EditServicePage] Service ID from unwrappedParams:", id);

  const [formData, setFormData] = useState<Partial<ServiceFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceExists, setServiceExists] = useState<boolean | null>(null); // ADDED: null for indeterminate, true for exists, false for not found
  const router = useRouter();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null); // ADDED
  const [imagePreview, setImagePreview] = useState<string | null>(null); // ADDED
  const fileInputRef = useRef<HTMLInputElement>(null); // ADDED

  useEffect(() => {
    if (id) {
      fetchService();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    console.log("[EditServicePage] formData state updated:", formData);
  }, [formData]);

  const fetchService = async () => {
    setIsLoading(true);
    setServiceExists(null); // Reset while fetching
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

      console.log("[fetchService] Data from Supabase:", data);
      console.log("[fetchService] Keys from Supabase data:", data ? Object.keys(data) : 'No data');
      console.log("[fetchService] Error from Supabase:", error);

      if (error) {
        if (error.code === 'PGRST116') { // Standard Supabase code for "No rows found" from .single()
          setServiceExists(false);
          setFormData({}); // Clear form data if any
        } else {
          throw error; // Other errors will be caught by the catch block below
        }
      } else if (data) {
        // Explicitly map database fields to formData fields
        // This handles potential mismatches in naming conventions (e.g., snake_case vs camelCase)
        const mappedData: Partial<ServiceFormData> = {
          id: data.id || data.ID,
          name: data.name || data.Name || data.NAME || data.service_name,
          description: data.description || data.Description || data.DESCRIPTION || data.service_description,
          price: data.price !== undefined ? data.price : 
                 (data.Price !== undefined ? data.Price : 
                 (data.PRICE !== undefined ? data.PRICE : 
                 (data.price_clp !== undefined ? data.price_clp : undefined))),
          duration: data.duration || data.Duration || data.DURATION || data.estimated_duration,
          image_url: data.image_url || data.ImageUrl || data.IMAGE_URL || data.image_path, // Added common alternatives
        };

        // Filter out properties that are explicitly undefined from the mapping
        // to avoid setting undefined values in formData if neither primary nor fallback DB columns exist.
        const cleanedMappedData = Object.entries(mappedData).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key as keyof ServiceFormData] = value;
          }
          return acc;
        }, {} as Partial<ServiceFormData>);

        console.log("[fetchService] Mapped data for form:", cleanedMappedData);
        setFormData(cleanedMappedData);
        setServiceExists(true);
        if (cleanedMappedData.image_url) {
          setImagePreview(cleanedMappedData.image_url);
        }
      } else {
        // This case should ideally be covered by error.code === 'PGRST116'
        // if .single() is used and no data is found.
        setServiceExists(false);
        setFormData({});
      }
    } catch (error: any) {
      console.error("Error fetching service:", error); // Log the actual error
      toast({ title: "Error", description: `No se pudo cargar el servicio: ${error.message}`, variant: "destructive" });
      setServiceExists(false); // Explicitly set to false on any other error during fetch
      // Consider if redirect is always desired or if user should see the error on the page
      // router.push("/servicios"); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Keep price as string for input, convert to number on submit
      [name]: value,
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { // ADDED FUNCTION
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentServiceId = unwrappedParams?.id;
    if (!currentServiceId) {
      toast({ title: "Error", description: "ID de servicio no disponible para actualizar.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    let newImageUrl = formData.image_url;

    try {
      if (imageFile) {
        try {
          const uploadedImageUrl = await ServiceService.uploadServiceImage(imageFile, `service-${currentServiceId}-${Date.now()}`);
          if (uploadedImageUrl) {
            newImageUrl = uploadedImageUrl;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({ title: "Error de Imagen", description: "No se pudo subir la nueva imagen del servicio.", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      }

      const { id: formDataId, created_at, updated_at, ...updateData } = formData as any;
      const submissionData: Partial<ServiceFormData> = {
        ...updateData,
        price: updateData.price !== "" && updateData.price !== null && updateData.price !== undefined
               ? parseFloat(String(updateData.price))
               : null,
        image_url: newImageUrl,
      };
      Object.keys(submissionData).forEach(key => {
        const typedKey = key as keyof ServiceFormData;
        if (submissionData[typedKey] === undefined) {
          delete submissionData[typedKey];
        }
      });

      try {
        await ServiceService.updateService(currentServiceId, submissionData);
        toast({ title: "Éxito", description: "Servicio actualizado correctamente." });
        router.push("/servicios");
      } catch (error: any) {
        console.error("Error updating service:", error);
        toast({ title: "Error", description: error.message || "No se pudo actualizar el servicio.", variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast({ title: "Error", description: error.message || "No se pudo actualizar el servicio.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="text-center text-white neon-text text-xl">
          <svg className="animate-spin h-8 w-8 text-accent-neon mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando datos del servicio...
        </div>
      </div>
    );
  }

  // After loading, if serviceExists is false, then it was not found or an error occurred.
  if (serviceExists === false) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="text-center text-white neon-text text-xl p-8 bg-primary-light rounded-lg shadow-xl border border-red-500/50">
          Servicio no encontrado o error al cargar.
          <Button onClick={() => router.push('/servicios')} className="mt-4 bg-accent-neon hover:bg-accent-neon-light text-primary-dark">
            Volver a Servicios
          </Button>
        </div>
      </div>
    );
  }

  // If serviceExists is null and not loading, it might mean the initial fetch for ID hasn't completed or ID is invalid.
  // However, useEffect for fetchService depends on 'id', so this state should resolve quickly.
  // If serviceExists is true, or if it's null but we're past loading (fallback, should ideally be true), render form.
  // The form will render with formData, which is {} if service not found (but serviceExists would be false then) or populated data.
  if (serviceExists === null && !isLoading) {
    // This state should ideally not be hit if 'id' is processed correctly and fetchService runs.
    // Could be a brief moment if 'id' from params is slow to resolve and fetchService hasn't set serviceExists yet.
    // Or if 'id' is invalid from the start and fetchService isn't even called.
    // For robustness, can show a generic message or rely on router to redirect if 'id' is fundamentally missing.
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="text-center text-white neon-text text-xl p-8 bg-primary-light rounded-lg shadow-xl">
          Verificando servicio...
        </div>
      </div>
    );
  }

  console.log("[EditServicePage] Rendering form with formData:", formData);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-dark to-primary py-12 px-4 sm:px-6 lg:px-8 pt-28 md:pt-32">
      <div className="w-full max-w-2xl bg-primary-light p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-accent-neon/40 transform transition-all duration-500 hover:shadow-accent-neon/30">
        <div className="p-0 mb-8 sm:mb-10 text-center">
          <div className="inline-block p-3 bg-accent-neon/20 rounded-full mb-4 border border-accent-neon/50 shadow-lg">
            <Edit3 className="h-10 w-10 md:h-12 md:w-12 text-accent-neon" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white neon-text">
            Editar Servicio
          </h1>
          <p className="text-text-secondary mt-2 text-sm md:text-base">Modifica los detalles del servicio seleccionado.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <Label htmlFor="name" className="text-gray-300">Nombre del Servicio</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ej: Mantenimiento Avanzado"
                value={formData.name || ''}
                onChange={handleChange}
                className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
                required
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-gray-300">Precio (CLP)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Ej: 75000"
                value={formData.price === null || formData.price === undefined ? '' : String(formData.price)}
                onChange={handleChange}
                className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Descripción Detallada</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe los beneficios y características clave del servicio..."
              value={formData.description || ''}
              onChange={handleChange}
              className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
              rows={5}
            />
          </div>
          
          <div>
            <Label htmlFor="duration" className="text-gray-300">Duración Estimada (Opcional)</Label>
            <Input
              id="duration"
              name="duration"
              placeholder="Ej: 1 hora, 45 minutos"
              value={formData.duration || ''}
              onChange={handleChange}
              className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
            />
          </div>

          {/* Image URL Input (Optional) - ADDED BLOCK START */}
          <div>
            <Label htmlFor="image_url" className="text-gray-300">URL de la Imagen (Opcional)</Label>
            <Input
              id="image_url"
              name="image_url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
            />
          </div>

          {/* Image File Upload */}
          <div>
            <Label htmlFor="imageFile" className="text-gray-300 neon-text-subtle text-sm font-semibold">O Subir Nueva Imagen (Reemplazará la URL o imagen actual)</Label>
            <input
              ref={fileInputRef}
              id="imageFile"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageFileChange}
              className="mt-1"
            />
            <Button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Seleccionar Archivo
            </Button>
            {imagePreview && (
              <div className="mt-4 relative w-48 h-32 border-2 border-accent-neon/50 rounded-lg overflow-hidden shadow-md">
                <Image src={imagePreview} alt="Vista previa de la imagen" layout="fill" objectFit="cover" />
              </div>
            )}
          </div>
          {/* ADDED BLOCK END */}

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full group relative flex justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-accent-neon hover:bg-accent-neon-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-accent-neon-dark disabled:opacity-60 transition-all duration-300 shadow-lg hover:shadow-accent-neon/40 transform hover:scale-105"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Edit3 className="mr-2 h-6 w-6" />
              )}
              {isSubmitting ? 'Actualizando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServicePage;