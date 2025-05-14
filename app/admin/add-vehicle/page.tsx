"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label
import { Textarea } from "@/components/ui/textarea"; // Import Textarea for description
import { useToast } from "@/components/ui/use-toast"; // Corrected import path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { PlusCircle } from 'lucide-react'; // Icon for the button
import { useRef } from "react";

// Define an interface for the vehicle form data
interface VehicleFormData {
  brand: string;
  model: string;
  year: number | string; // Allow string for input, convert to number on submit
  price: number | string;
  type: string;
  transmission: string;
  fuel: string;
  image: string; // URL
  mileage: number | string;
  engine: string;
  power: string;
  description: string;
  // Optional fields, can be added later
  // color?: string;
  // seats?: number;
  // features?: string[]; // This would need a more complex input
  // acceleration?: string;
  // topSpeed?: string;
}

const AddVehiclePage = () => {
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: "",
    model: "",
    year: "",
    price: "",
    type: "",
    transmission: "",
    fuel: "",
    image: "",
    mileage: "",
    engine: "",
    power: "",
    description: "",
  });
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsSubmitting(true);
    try {
      // Asegurarse de que todos los campos requeridos estén presentes
      const submissionData = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        images: Array.isArray(images) ? images : [],
        image: images.length > 0 ? images[mainImageIndex] : "",
        features: [], // Si features es requerido, lo agregamos como arreglo vacío
      };
      // Log detallado antes de la inserción
      console.log("Objeto exacto enviado a Supabase:", JSON.stringify(submissionData, null, 2));
      const { error } = await supabase.from("vehicles").insert([submissionData]);
      if (error) {
        console.error("Error de Supabase:", error);
        toast({ title: "Error", description: error.message || "No se pudo agregar el vehículo.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      toast({ title: "Éxito", description: "Vehículo agregado correctamente." });
      router.push("/vehiculos"); // Redirigir a la lista de vehículos
    } catch (error: any) {
      console.error("Error inesperado al agregar vehículo:", error);
      toast({ title: "Error", description: error.message || "No se pudo agregar el vehículo.", variant: "destructive" });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <Card className="w-full max-w-3xl bg-primary-light p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-accent-neon/30">
        <CardHeader className="p-0 mb-6 sm:mb-8">
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-white neon-text text-center">
            <PlusCircle className="inline-block mr-3 h-8 w-8 text-accent-neon" />
            Agregar Nuevo Vehículo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="brand" className="text-gray-300 neon-text-subtle">Marca</Label>
            <Input id="brand" name="brand" placeholder="Ej: Toyota" value={formData.brand} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
          <div>
            <Label htmlFor="model" className="text-gray-300 neon-text-subtle">Modelo</Label>
            <Input id="model" name="model" placeholder="Ej: Corolla" value={formData.model} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="year" className="text-gray-300 neon-text-subtle">Año</Label>
            <Input id="year" name="year" type="number" placeholder="Ej: 2023" value={formData.year} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
          <div>
            <Label htmlFor="price" className="text-gray-300 neon-text-subtle">Precio (CLP)</Label>
            <Input id="price" name="price" type="number" placeholder="Ej: 15000000" value={formData.price} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="type" className="text-gray-300 neon-text-subtle">Tipo</Label>
            <Input id="type" name="type" placeholder="Ej: Sedan, SUV" value={formData.type} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
          <div>
            <Label htmlFor="transmission" className="text-gray-300 neon-text-subtle">Transmisión</Label>
            <Input id="transmission" name="transmission" placeholder="Ej: Automática, Manual" value={formData.transmission} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fuel" className="text-gray-300 neon-text-subtle">Combustible</Label>
            <Input id="fuel" name="fuel" placeholder="Ej: Gasolina, Diesel" value={formData.fuel} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
          <div>
            <Label htmlFor="mileage" className="text-gray-300 neon-text-subtle">Kilometraje</Label>
            <Input id="mileage" name="mileage" type="number" placeholder="Ej: 25000" value={formData.mileage} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="engine" className="text-gray-300 neon-text-subtle">Motor</Label>
            <Input id="engine" name="engine" placeholder="Ej: 1.6L" value={formData.engine} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
          <div>
            <Label htmlFor="power" className="text-gray-300 neon-text-subtle">Potencia (HP)</Label>
            <Input id="power" name="power" placeholder="Ej: 120 HP" value={formData.power} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" required />
          </div>
        </div>

        <div>
          <Label htmlFor="image" className="text-gray-300 neon-text-subtle">Fotos del Vehículo (máx. 8)</Label>
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
                <Button type="button" size="sm" variant={mainImageIndex === idx ? "default" : "outline"} className="absolute bottom-1 left-1 text-xs px-2 py-1" onClick={() => handleSetMainImage(idx)}>
                  {mainImageIndex === idx ? "Principal" : "Hacer principal"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-300 neon-text-subtle">Descripción</Label>
          <Textarea id="description" name="description" placeholder="Detalles adicionales del vehículo..." value={formData.description} onChange={handleChange} className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-accent-neon focus:border-accent-neon rounded-md" rows={4} />
        </div>

        <Button
          type="submit"
          className="w-full group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-neon hover:bg-accent-neon-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-neon-dark disabled:opacity-50 transition-colors duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <PlusCircle className="mr-2 h-5 w-5" />
          )}
          {isSubmitting ? 'Agregando...' : 'Agregar Vehículo'}
        </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVehiclePage;