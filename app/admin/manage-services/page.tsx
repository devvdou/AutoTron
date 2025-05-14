"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Definir un tipo para los servicios si no existe uno global
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  // Agrega más campos según sea necesario, por ejemplo, duration, category, etc.
}

const ManageServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("services").select("*");
      if (error) throw error;
      setServices(data as Service[]);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Éxito", description: "Servicio eliminado correctamente." });
      fetchServices(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el servicio.",
        variant: "destructive",
      });
    }
  };

  const handleAddService = () => {
    if (services.length >= 3) {
      toast({
        title: "Límite alcanzado",
        description: "No se pueden agregar más de 3 servicios.",
        variant: "destructive",
      });
    } else {
      router.push("/admin/manage-services/add");
    }
  };

  const handleEditService = (id: number) => {
    router.push(`/admin/manage-services/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white neon-text">
            Gestionar Servicios
          </h1>
          <Button onClick={handleAddService} className="bg-accent-neon hover:bg-accent-neon-light text-primary-dark font-semibold">
            <PlusCircle className="mr-2 h-5 w-5" />
            Agregar Servicio
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center text-white py-4">Cargando servicios...</p>
        ) : services.length === 0 ? (
          <div className="text-center py-10 bg-primary-light rounded-lg shadow-xl border border-accent-neon/20">
            <p className="text-xl text-gray-300 mb-2">No hay servicios para mostrar.</p>
            <p className="text-gray-400">Agrega tu primer servicio para comenzar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-primary-light shadow-xl rounded-lg border border-accent-neon/30">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider neon-text-subtle">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider neon-text-subtle">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider neon-text-subtle">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider neon-text-subtle">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-primary-light divide-y divide-gray-700/50">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{service.name}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 max-w-xs truncate">{service.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(service.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditService(service.id)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 mr-2"
                      >
                        <Edit size={16} className="mr-1" /> Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 size={16} className="mr-1" /> Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServicesPage;