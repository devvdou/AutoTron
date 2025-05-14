"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { useToast } from "@/hooks/use-toast";
import type { Vehicle } from "@/lib/services/vehicle-service"; // Import Vehicle type
import { useRef } from "react";
import React from "react";

// Define an interface for the vehicle form data, similar to AddVehiclePage
interface VehicleFormData extends Omit<Vehicle, 'id' | 'features' | 'year' | 'price' | 'mileage'> {
  year: number | string;
  price: number | string;
  mileage: number | string;
  features?: string; // Keep features as a string for input, convert on submit
}

const EditVehiclePage = ({ params }: { params: { id: string } }) => {
  const unwrappedParams = React.use(params);
  const [formData, setFormData] = useState<Partial<VehicleFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVehicle();
  }, [unwrappedParams.id]);

  useEffect(() => {
    if (formData.images && Array.isArray(formData.images)) {
      setImages(formData.images);
      setMainImageIndex(0);
    }
  }, [formData.images]);

  const fetchVehicle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*") // Select all fields
        .eq("id", unwrappedParams.id)
        .single();
      if (error) throw error;
      if (data) {
        // Convert features array to comma-separated string for the form
        const featuresString = Array.isArray(data.features) ? data.features.join(', ') : '';
        setFormData({ ...data, features: featuresString });
      }
    } catch (error: any) {
      toast({ title: "Error", description: `No se pudo cargar el vehículo: ${error.message}` });
      router.push("/vehiculos"); // Redirigir a la lista de vehículos si no se encuentra o hay error
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 8 - images.length);
    const readers = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(newImages => {
      setImages(prev => [...prev, ...newImages].slice(0, 8));
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    if (mainImageIndex === idx) setMainImageIndex(0);
    else if (mainImageIndex > idx) setMainImageIndex(mainImageIndex - 1);
  };

  const handleSetMainImage = (idx: number) => setMainImageIndex(idx);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
     try {
      // Log detallado del objeto enviado
      console.log("Datos enviados a Supabase:", JSON.stringify(formData, null, 2));
      if (!formData.brand || !formData.model || !formData.year || !formData.price || !formData.type || !formData.transmission || !formData.fuel || !formData.engine || !formData.power || !formData.mileage) {
        toast({ title: "Error", description: "Por favor, completa todos los campos obligatorios.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!unwrappedParams.id) {
        toast({ title: "Error", description: "ID de vehículo no válido.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { id, created_at, updated_at, ...updateData } = formData as any;
      const submissionData = {
        ...updateData,
        year: Number(updateData.year),
        price: Number(updateData.price),
        mileage: Number(updateData.mileage),
        features: typeof updateData.features === 'string' 
          ? updateData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f !== '') 
          : [],
        images: images.length > 0 ? images : [], // Usar array vacío en lugar de undefined
        image: images.length > 0 ? images[mainImageIndex] : (formData.image || null), // Usar null si no hay imagen principal
      };
      // Log del objeto final que se envía a Supabase
      console.log("Objeto final enviado a Supabase:", JSON.stringify(submissionData, null, 2));
      if (isNaN(submissionData.year) || isNaN(submissionData.price) || isNaN(submissionData.mileage)) {
        toast({ title: "Error", description: "Año, precio y kilometraje deben ser números válidos.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { error } = await supabase
        .from("vehicles")
        .update(submissionData)
        .eq("id", unwrappedParams.id);
      if (error) throw error;
      toast({ title: "Éxito", description: "Vehículo actualizado correctamente." });
      router.push("/vehiculos"); // Redirigir a la lista de vehículos
    } catch (error: any) {
      console.error("Error updating vehicle:", error, "Full error object:", JSON.stringify(error, null, 2));
      let errorMessage = "No se pudo actualizar el vehículo.";
      if (error && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && Object.keys(error).length > 0) {
        errorMessage = JSON.stringify(error);
      } else if (typeof error === 'string' && error.trim() !== '') {
        errorMessage = error;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando datos del vehículo...</div>;
  }

  if (!formData.brand) { // Check if formData is populated
    return <div className="p-6 text-center">Vehículo no encontrado o error al cargar.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="w-full max-w-3xl bg-primary-light p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-accent-neon/30">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white neon-text text-center mb-8">
          Editar Vehículo
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="brand" className="text-gray-300 neon-text-subtle">Marca</Label>
              <Input id="brand" name="brand" placeholder="Ej: Toyota" value={formData.brand || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
            <div>
              <Label htmlFor="model" className="text-gray-300 neon-text-subtle">Modelo</Label>
              <Input id="model" name="model" placeholder="Ej: Corolla" value={formData.model || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="year" className="text-gray-300 neon-text-subtle">Año</Label>
              <Input id="year" name="year" type="number" placeholder="Ej: 2023" value={formData.year || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
            <div>
              <Label htmlFor="price" className="text-gray-300 neon-text-subtle">Precio (CLP)</Label>
              <Input id="price" name="price" type="number" placeholder="Ej: 15000000" value={formData.price || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="type" className="text-gray-300 neon-text-subtle">Tipo</Label>
              <Input id="type" name="type" placeholder="Ej: Sedan, SUV" value={formData.type || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
            <div>
              <Label htmlFor="transmission" className="text-gray-300 neon-text-subtle">Transmisión</Label>
              <Input id="transmission" name="transmission" placeholder="Ej: Automática, Manual" value={formData.transmission || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fuel" className="text-gray-300 neon-text-subtle">Combustible</Label>
              <Input id="fuel" name="fuel" placeholder="Ej: Gasolina, Diesel" value={formData.fuel || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
            <div>
              <Label htmlFor="mileage" className="text-gray-300 neon-text-subtle">Kilometraje</Label>
              <Input id="mileage" name="mileage" type="number" placeholder="Ej: 25000" value={formData.mileage || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="engine" className="text-gray-300 neon-text-subtle">Motor</Label>
              <Input id="engine" name="engine" placeholder="Ej: 1.6L" value={formData.engine || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
            <div>
              <Label htmlFor="power" className="text-gray-300 neon-text-subtle">Potencia (HP)</Label>
              <Input id="power" name="power" placeholder="Ej: 120 HP" value={formData.power || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
            </div>
          </div>

          <div>
            <Label className="text-gray-300 neon-text-subtle">Fotos del Vehículo (máx. 8)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageChange}
              disabled={images.length >= 8}
            />
            <Button type="button" className="mt-2 mb-4" onClick={() => fileInputRef.current?.click()} disabled={images.length >= 8}>
              {images.length < 8 ? 'Subir fotos desde tu dispositivo' : 'Máximo de 8 fotos alcanzado'}
            </Button>
            <div className="flex flex-wrap gap-4">
              {images.map((img, idx) => (
                <div key={idx} className={`relative border-2 rounded-md overflow-hidden ${mainImageIndex === idx ? 'border-accent-neon' : 'border-gray-700'}`}>
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-28 h-20 object-cover" />
                  <Button type="button" size="sm" variant="destructive" className="absolute top-1 right-1" onClick={() => handleRemoveImage(idx)}>
                    X
                  </Button>
                  <Button type="button" size="sm" variant={mainImageIndex === idx ? 'default' : 'outline'} className="absolute bottom-1 left-1" onClick={() => handleSetMainImage(idx)}>
                    {mainImageIndex === idx ? 'Principal' : 'Hacer principal'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="image" className="text-gray-300 neon-text-subtle">URL de Imagen Principal</Label>
            <Input id="image" name="image" type="url" placeholder="https://ejemplo.com/imagen.jpg" value={formData.image || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>

          <div>
            <Label htmlFor="features" className="text-gray-300 neon-text-subtle">Características (separadas por coma)</Label>
            <Input id="features" name="features" placeholder="Ej: Aire Acondicionado, Llantas de Aleación" value={formData.features || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300 neon-text-subtle">Descripción</Label>
            <Textarea id="description" name="description" placeholder="Detalles adicionales del vehículo..." value={formData.description || ''} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" rows={4} />
          </div>

          <Button type="submit" className="w-full md:w-auto bg-accent-neon hover:bg-accent-neon-light text-primary-dark font-semibold">Actualizar Vehículo</Button>
        </form>
      </div>
    </div>
  );
};

export default EditVehiclePage;