"use client"
import type { Metadata } from "next"
import ServiceService, { Service } from "@/lib/services/service-service"
import UserService from "@/lib/services/user-service"; // Importar UserService
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"; // Importar useRouter
import { Button } from "@/components/ui/button"; // Importar Button
import { useToast } from "@/components/ui/use-toast"; // Importar useToast
import { Car, Key, Droplets, PlusCircle, Edit, Trash2 } from "lucide-react"
import { COMPANY_DATA } from "@/lib/constants"

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (user && user.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al verificar el estado de administrador:", error);
        setIsAdmin(false); // Assume not admin on error
        toast({
          title: "Error de Autenticación",
          description: "No se pudo verificar el estado de administrador.",
          variant: "destructive",
        });
      }
    };
    checkAdminStatus();
  }, [toast]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await ServiceService.getAllServices();
        setServices(data);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los servicios.",
          variant: "destructive",
        });
      }
    };
    fetchServices();
  }, [toast]);

  const handleAddService = () => {
    router.push("/admin/add-service");
  };

  const handleEditService = (id: string | number) => {
    router.push(`/admin/manage-services/edit/${id}`);
  };

  const handleDeleteService = async (id: string | number) => {
    const originalServices = [...services];
    setServices(services.filter(service => service.id !== id)); // Optimistic update
    try {
      await ServiceService.deleteService(id);
      toast({ title: "Éxito", description: "Servicio eliminado correctamente." });
      // No es necesario llamar a fetchServices() si la actualización optimista es suficiente
      // o si el backend confirma la eliminación y no hay riesgo de desincronización.
    } catch (error) {
      setServices(originalServices); // Revertir en caso de error
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el servicio.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="mb-4">
            Nuestros <span className="text-accent-neon">Servicios</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Ofrecemos una experiencia integral para satisfacer todas tus necesidades automotrices con la más alta calidad y atención personalizada.
          </p>
        </div>
        {isAdmin && (
          <div className="mb-8 flex justify-end space-x-4">
            <Button onClick={handleAddService} className="bg-accent-neon hover:bg-accent-neon-light text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> Agregar Servicio
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {services.map((service) => (
            <div key={service.id} className="bg-primary-light border border-accent-neon/30 rounded-xl shadow-xl overflow-hidden flex flex-col group hover:shadow-accent-neon/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative w-full h-56 md:h-64">
                <Image
                  src={service.image_url || "/images/placeholder-service.svg"}
                  alt={service.name || "Imagen del servicio"}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex space-x-2 z-10">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditService(service.id)}
                      className="bg-blue-600/80 hover:bg-blue-500 text-white border-blue-500 backdrop-blur-sm"
                      title="Editar servicio"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteService(service.id)}
                      className="bg-red-600/80 hover:bg-red-500 text-white border-red-500 backdrop-blur-sm"
                      title="Eliminar servicio"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-accent-neon drop-shadow-glow-soft-sm group-hover:text-accent-neon-light transition-colors">
                  {service.name}
                </h3>
                <p className="text-text-secondary mb-4 text-sm font-medium min-h-[70px] flex-grow">
                  {service.description}
                </p>
                {service.price && (
                  <p className="font-semibold text-xl text-accent-neon mb-4 animate-pulse">
                    Desde ${service.price}
                  </p>
                )}
                <Button
                  className="mt-auto w-full bg-accent-neon hover:bg-accent-neon-light text-primary-dark font-semibold rounded-lg py-3 transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Solicitar este servicio
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
