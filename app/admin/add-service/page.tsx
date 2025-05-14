"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import ServiceService from '@/lib/services/service-service'; // Importar ServiceService

interface ServiceFormData {
  name: string;
  description: string;
  price: string; // Mantener como string para el input, convertir a número antes de enviar
  image_url: string; // Para la URL de la imagen
  // Otros campos específicos del servicio si los hay
}

const AddServicePage = () => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : value) : value, // No convertir a número aquí todavía
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
    setIsSubmitting(true);

    let imageUrl = formData.image_url; // Usar la URL directa si se proporciona

    if (imageFile) { // Si se subió un archivo, priorizarlo
      try {
        const uploadedImageUrl = await ServiceService.uploadServiceImage(imageFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({ title: "Error de Imagen", description: "No se pudo subir la imagen del servicio.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const submissionData = {
        ...formData,
        price: formData.price !== "" ? parseFloat(formData.price) : null, // Convertir a número o null si está vacío
        image_url: imageUrl, // Usar la URL de la imagen (subida o directa)
      };
      
      // Log detallado antes de la inserción
      console.log("Objeto exacto enviado a Supabase para servicio:", JSON.stringify(submissionData, null, 2));
      
      const { error } = await supabase.from("services").insert([submissionData]);
      if (error) {
        console.error("Error de Supabase al agregar servicio:", error);
        toast({ title: "Error", description: error.message || "No se pudo agregar el servicio.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      toast({ title: "Éxito", description: "Servicio agregado correctamente." });
      router.push("/servicios"); // Redirigir a la página de servicios
    } catch (error: any) {
      console.error("Error inesperado al agregar servicio:", error);
      toast({ title: "Error", description: error.message || "No se pudo agregar el servicio.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-dark to-primary py-12 px-4 sm:px-6 lg:px-8 pt-28 md:pt-32">
      <Card className="w-full max-w-2xl bg-primary-light p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-accent-neon/40 transform transition-all duration-500 hover:shadow-accent-neon/30">
        <CardHeader className="p-0 mb-8 sm:mb-10 text-center">
          <div className="inline-block p-3 bg-accent-neon/20 rounded-full mb-4 border border-accent-neon/50 shadow-lg">
            <PlusCircle className="h-10 w-10 md:h-12 md:w-12 text-accent-neon" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-white neon-text">
            Crear Nuevo Servicio
          </CardTitle>
          <p className="text-text-secondary mt-2 text-sm md:text-base">Completa los detalles para añadir un nuevo servicio a la plataforma.</p>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <Label htmlFor="name" className="text-gray-300 neon-text-subtle text-sm font-semibold">Nombre del Servicio</Label>
                <Input id="name" name="name" placeholder="Ej: Mantenimiento Avanzado" value={formData.name} onChange={handleChange} className="mt-2 bg-primary-dark border-gray-700/50 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-lg p-3 shadow-sm transition-all duration-300 hover:border-accent-neon/70" required />
              </div>
              <div>
                <Label htmlFor="price" className="text-gray-300 neon-text-subtle text-sm font-semibold">Precio (CLP)</Label>
                <Input id="price" name="price" type="number" placeholder="Ej: 75000" value={formData.price} onChange={handleChange} className="mt-2 bg-primary-dark border-gray-700/50 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-lg p-3 shadow-sm transition-all duration-300 hover:border-accent-neon/70" />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300 neon-text-subtle text-sm font-semibold">Descripción Detallada</Label>
              <Textarea id="description" name="description" placeholder="Describe los beneficios y características clave del servicio..." value={formData.description} onChange={handleChange} className="mt-2 bg-primary-dark border-gray-700/50 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-lg p-3 shadow-sm transition-all duration-300 hover:border-accent-neon/70" rows={5} required />
            </div>

            <div className="space-y-3">
              <Label htmlFor="image_url" className="text-gray-300 neon-text-subtle text-sm font-semibold">URL de la Imagen (Opcional)</Label>
              <Input id="image_url" name="image_url" placeholder="https://ejemplo.com/imagen-servicio.jpg" value={formData.image_url} onChange={handleChange} className="mt-1 bg-primary-dark border-gray-700/50 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-lg p-3 shadow-sm transition-all duration-300 hover:border-accent-neon/70" />
            </div>
            
            <div className="border-t border-gray-700/50 pt-6 md:pt-8">
              <Label htmlFor="imageFile" className="text-gray-300 neon-text-subtle text-sm font-semibold block mb-3">O Subir Imagen Directamente (Recomendado)</Label>
              <div className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${imagePreview ? 'border-accent-neon/70' : 'border-gray-600 hover:border-gray-500'}`} onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
                {imagePreview ? (
                  <div className="relative w-full h-48 md:h-56 rounded-md overflow-hidden shadow-lg">
                    <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-semibold">Cambiar imagen</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <p className="mt-1 text-sm text-gray-400">Haz clic para seleccionar o arrastra una imagen</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full group relative flex justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-accent-neon hover:bg-accent-neon-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-accent-neon-dark disabled:opacity-60 transition-all duration-300 shadow-lg hover:shadow-accent-neon/40 transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <PlusCircle className="mr-2 h-6 w-6" />
              )}
              {isSubmitting ? 'Guardando Servicio...' : 'Agregar Servicio Ahora'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddServicePage;