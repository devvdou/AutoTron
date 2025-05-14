"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ServiceFormData {
  name: string;
  description: string;
  price: number | string;
  duration: string;
}

const AddServicePage = () => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: "",
    duration: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submissionData = {
        ...formData,
        price: Number(formData.price),
      };

      const { error } = await supabase.from("services").insert([submissionData]);
      if (error) throw error;
      toast({ title: "Éxito", description: "Servicio agregado correctamente." });
      router.push("/admin/manage-services");
      router.refresh(); // To ensure the list on the manage page updates
    } catch (error: any) {
      console.error("Error adding service:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el servicio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 pt-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-white neon-text">
        Agregar Nuevo Servicio
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-primary-light p-8 rounded-lg shadow-xl border border-accent-neon/30">
        <div>
          <Label htmlFor="name" className="text-gray-300">Nombre del Servicio</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ej: Cambio de Aceite"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-300">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Detalles del servicio..."
            value={formData.description}
            onChange={handleChange}
            className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price" className="text-gray-300">Precio (CLP)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Ej: 50000"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
              required
            />
          </div>
          <div>
            <Label htmlFor="duration" className="text-gray-300">Duración Estimada</Label>
            <Input
              id="duration"
              name="duration"
              placeholder="Ej: 1 hora, 30 minutos"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 bg-gray-800 text-white border-gray-700 focus:ring-accent-neon focus:border-accent-neon"
            />
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto bg-accent-neon hover:bg-accent-neon-light text-primary-dark font-semibold" disabled={isLoading}>
          {isLoading ? "Agregando..." : "Agregar Servicio"}
        </Button>
      </form>
    </div>
  );
};

export default AddServicePage;