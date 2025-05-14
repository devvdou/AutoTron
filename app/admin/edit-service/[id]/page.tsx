"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"; 
import ServiceService, { Service } from "@/lib/services/service-service";
import { Edit } from 'lucide-react';

interface ServiceFormData extends Omit<Service, 'id' | 'price' | 'created_at' | 'updated_at'> {
  price: number | string;
}

const EditServicePage = ({ params }: { params: { id: string } }) => {
  const [formData, setFormData] = useState<Partial<ServiceFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", params.id)
        .single();
      if (error) throw error;
      if (data) {
        setFormData({ 
          ...data, 
          price: data.price !== null ? String(data.price) : "" 
        });
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error: any) {
      toast({ title: "Error", description: `No se pudo cargar el servicio: ${error.message}`, variant: "destructive" });
      router.push("/servicios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : value) : value,
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsLoading(true);
    let imageUrl = formData.image_url;

    if (imageFile) {
      try {
        const uploadedImageUrl = await ServiceService.uploadServiceImage(imageFile, `service-${params.id}-${Date.now()}`);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({ title: "Error de Imagen", description: "No se pudo subir la nueva imagen del servicio.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
    }

    try {
      const { id, created_at, updated_at, ...updateData } = formData as any;
      const submissionData = {
        ...updateData,
        price: updateData.price !== "" && updateData.price !== null ? parseFloat(updateData.price) : null,
        image_url: imageUrl,
      };
      
      const { error } = await supabase
        .from("services")
        .update(submissionData)
        .eq("id", params.id);

      if (error) throw error;
      toast({ title: "Éxito", description: "Servicio actualizado correctamente." });
      router.push("/servicios");
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast({ title: "Error", description: error.message || "No se pudo actualizar el servicio.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white text-xl">Cargando datos del servicio...</div>;
  }

  if (!formData.name) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white text-xl">Servicio no encontrado o error al cargar.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <Card className="w-full max-w-xl bg-primary-light p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-accent-neon/30">
        <CardHeader className="p-0 mb-6 sm:mb-8">
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-white neon-text text-center">
            <Edit className="inline-block mr-3 h-8 w-8 text-accent-neon" />
            Editar Servicio
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-300 neon-text-subtle">Nombre del Servicio</Label>
              <Input id="name" name="name" placeholder="Ej: Mantenimiento Premium" value={formData.name || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>

            <div>
              <Label htmlFor="price" className="text-gray-300 neon-text-subtle">Precio (CLP)</Label>
              <Input id="price" name="price" type="number" placeholder="Ej: 50000" value={formData.price || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300 neon-text-subtle">Descripción</Label>
              <Textarea id="description" name="description" placeholder="Detalles del servicio..." value={formData.description || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" rows={4} required />
            </div>

            <div>
              <Label htmlFor="image_url" className="text-gray-300 neon-text-subtle">URL de la Imagen Actual (Opcional)</Label>
              <Input id="image_url" name="image_url" placeholder="https://example.com/imagen.jpg" value={formData.image_url || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" />
            </div>
            
            <div>
              <Label htmlFor="imageFile" className="text-gray-300 neon-text-subtle">O Subir Nueva Imagen (Opcional, reemplazará la URL o imagen actual)</Label>
              <input
                ref={fileInputRef}
                id="imageFile"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageFileChange}
              />
              <Button type="button" className="mt-2 mb-2" onClick={() => fileInputRef.current?.click()}>
                Seleccionar archivo
              </Button>
              {imagePreview && (
                <div className="mt-2 relative w-40 h-30 border-2 rounded-md overflow-hidden border-accent-neon">
                  <img src={imagePreview} alt="Vista previa de la imagen" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-neon hover:bg-accent-neon-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-neon-dark disabled:opacity-50 transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Edit className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Actualizando...' : 'Actualizar Servicio'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditServicePage;