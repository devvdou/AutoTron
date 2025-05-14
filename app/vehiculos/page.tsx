"use client"

import { useState, useEffect, useMemo } from 'react';
import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import Script from "next/script";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { type Vehicle } from '@/lib/types';
import { COMPANY_DATA } from "@/lib/constants";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ListFilter, DollarSign, Calendar, Gauge, Fuel, Car, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons
import VehicleSearchFilters from "@/components/vehicle-search-filters";

const ITEMS_PER_PAGE = 9;

export default function VehiculosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // Added useRouter
  const [filters, setFilters] = useState({
    brand: 'Todos',
    type: 'Todos', // Corresponde a los modelos en el contexto actual, se pasará uniqueModels como 'types'
    transmission: 'Todos', // Añadir si se gestiona en VehicleSearchFilters
    fuel: 'Todos',
    priceRange: [0, 50000000], // Estructura de VehicleSearchFilters
    yearRange: [2015, 2023],    // Estructura de VehicleSearchFilters
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
  const [uniqueModels, setUniqueModels] = useState<string[]>([]);
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueFuelTypes, setUniqueFuelTypes] = useState<string[]>([]);

  // Placeholder for admin check - replace with actual auth logic
  const isAdmin = true; // Assume admin for now

  useEffect(() => {
    const fetchVehiclesAndMetadata = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbError) throw dbError;
        // Visualización temporal para depuración
        console.log('Vehículos obtenidos de la base de datos:', data);
        // Filtrar solo vehículos publicados (si existe el campo published)
        const filteredData = Array.isArray(data) ? data.filter(v => v.published !== false) : [];
        setVehicles(filteredData);
        if (filteredData) {
          setUniqueBrands([...new Set(filteredData.map(v => v.brand).filter(Boolean) as string[])].sort());
          setUniqueModels([...new Set(filteredData.map(v => v.model).filter(Boolean) as string[])].sort());
          setUniqueYears([...new Set(filteredData.map(v => v.year?.toString()).filter(Boolean) as string[])].sort((a,b) => Number(b) - Number(a)));
          setUniqueFuelTypes([...new Set(filteredData.map(v => v.fuel).filter(Boolean) as string[])].sort());
        }
      } catch (e) {
        console.error("Error fetching vehicles:", e);
        setError("No se pudieron cargar los vehículos. Inténtalo de nuevo más tarde.");
      }
      setIsLoading(false);
    };
    fetchVehiclesAndMetadata();
  }, []);

  const handleEditVehicle = (id: string | number) => {
    router.push(`/admin/edit-vehicle/${id}`);
  };

  const handleDeleteVehicle = async (id: string | number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        const { error: deleteError } = await supabase
          .from('vehicles')
          .delete()
          .match({ id: id });

        if (deleteError) throw deleteError;

        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
        // Optionally, show a success toast message here
        alert('Vehículo eliminado con éxito');
      } catch (e) {
        console.error("Error deleting vehicle:", e);
        // Optionally, show an error toast message here
        alert('Error al eliminar el vehículo.');
      }
    }
  };

  const handleFilterChange = (newFiltersFromChild: any) => {
    setFilters(newFiltersFromChild);
    setCurrentPage(1);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        vehicle.brand?.toLowerCase().includes(searchLower) ||
        vehicle.model?.toLowerCase().includes(searchLower) ||
        vehicle.year?.toString().includes(searchLower);
      const matchesFilters = 
        (filters.brand === 'Todos' || !filters.brand || vehicle.brand === filters.brand) &&
        (filters.type === 'Todos' || !filters.type || vehicle.model === filters.type) && // Usa filters.type, que corresponde a vehicle.model
        (filters.transmission === 'Todos' || !filters.transmission || vehicle.transmission === filters.transmission) && // Añadir si se gestiona
        (filters.fuel === 'Todos' || !filters.fuel || vehicle.fuel === filters.fuel) &&
        (vehicle.price !== undefined && vehicle.price !== null && vehicle.price >= filters.priceRange[0]) &&
        (vehicle.price !== undefined && vehicle.price !== null && vehicle.price <= filters.priceRange[1]) &&
        (vehicle.year !== undefined && vehicle.year !== null && vehicle.year >= filters.yearRange[0]) &&
        (vehicle.year !== undefined && vehicle.year !== null && vehicle.year <= filters.yearRange[1]);
      return matchesSearch && matchesFilters;
    });
  }, [vehicles, searchTerm, filters]);

  // Asegurarse de que la lista de vehículos no se limpie por error
  useEffect(() => {
    if (!isLoading && vehicles.length === 0 && !error) {
      setVehicles([]); // Esto asegura que no se limpie por error externo
    }
  }, [isLoading, vehicles.length, error]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);

  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined || price === null) return "N/A";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const dynamicVehicleSchema = useMemo(() => {
    if (isLoading || paginatedVehicles.length === 0) return null;
    const itemListElement = paginatedVehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      "position": (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
      "item": {
        "@type": "Vehicle",
        "name": `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        "manufacturer": vehicle.brand,
        "model": vehicle.model,
        "vehicleModelDate": vehicle.year?.toString(),
        "description": vehicle.description || `Vehículo ${vehicle.brand} ${vehicle.model} del año ${vehicle.year}`,
        "image": vehicle.images?.[0] || undefined,
        "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/vehiculos/${vehicle.id}`,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "CLP",
            "price": vehicle.price?.toString(),
            "availability": "https://schema.org/InStock"
        }
      }
    }));
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": itemListElement,
      "numberOfItems": filteredVehicles.length,
      "url": typeof window !== 'undefined' ? window.location.href : ''
    };
  }, [paginatedVehicles, isLoading, currentPage, filteredVehicles.length]);

  return (
    <>
      {isLoading ? (
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Cargando vehículos...</div>
        </div>
      ) : error ? (
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{error}</h2>
            <Link href="/" className="btn-primary mt-4">Volver al inicio</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Título y barra de búsqueda */}
          <div className="pt-24 pb-8 bg-gradient-to-br from-primary to-primary-dark text-white">
            <div className="container-custom">
              <h1 className="text-4xl md:text-5xl font-extrabold neon-text text-center mb-4">
                Nuestro Inventario
              </h1>
              <p className="text-center text-lg text-gray-300 mb-8">
                Explora nuestra amplia selección. Usa los filtros para encontrar tu vehículo ideal en Valdivia.
              </p>
              <VehicleSearchFilters
                initialFilters={filters} // Pasar el estado actual de filtros como iniciales
                initialSearchTerm={searchTerm}
                brands={uniqueBrands}
                types={uniqueModels} // uniqueModels se mapea a 'types' en el componente hijo
                transmissions={[]} // Asumiendo que no hay datos de transmisiones únicas por ahora
                fuels={uniqueFuelTypes}
                onFiltersChange={handleFilterChange} // El hijo ahora llama a esto con el objeto completo de filtros
                onSearch={setSearchTerm} // El hijo llama a esto con el nuevo término de búsqueda
              />
              {isAdmin && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => router.push('/admin/add-vehicle')}
                    className="btn-primary"
                  >
                    Agregar Nuevo Vehículo
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Catálogo de vehículos en la ubicación correcta */}
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {paginatedVehicles.length === 0 ? (
                <div className="col-span-full text-center text-gray-300 py-12">
                  No se encontraron vehículos que coincidan con tu búsqueda.
                </div>
              ) : (
                paginatedVehicles.map((vehicle) => (
                  <Card key={vehicle.id || `${vehicle.brand}-${vehicle.model}-${vehicle.year}`}
                    className="bg-primary-light border-accent-neon/30 text-white overflow-hidden shadow-lg hover:shadow-accent-neon/20 transition-shadow duration-300 flex flex-col">
                    <CardHeader className="p-0">
                      <div className="aspect-video relative w-full">
                        <Image
                          src={vehicle.images?.[0] || '/placeholder.svg'}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          layout="fill"
                          objectFit="cover"
                          className="hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <CardTitle className="text-xl lg:text-2xl font-bold neon-text-subtle truncate mb-1 group-hover:text-accent-neon transition-colors">
                        {vehicle.brand} {vehicle.model}
                      </CardTitle>
                      <p className="text-2xl lg:text-3xl font-semibold text-accent-neon mb-2">
                        {formatPrice(vehicle.price)}
                      </p>
                      <div className="text-sm text-gray-400 space-y-1 mb-3">
                        <p className="flex items-center"><Calendar size={14} className="mr-2 text-accent-neon/80" /> Año: {vehicle.year}</p>
                        <p className="flex items-center"><Gauge size={14} className="mr-2 text-accent-neon/80" /> {vehicle.mileage?.toLocaleString() || 0} km</p>
                        <p className="flex items-center capitalize"><Fuel size={14} className="mr-2 text-accent-neon/80" /> {vehicle.fuel}</p>
                        {vehicle.type && <p className="flex items-center capitalize"><Car size={14} className="mr-2 text-accent-neon/80" /> {vehicle.type}</p>}
                      </div>
                      {vehicle.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {vehicle.description}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 bg-primary-dark/30 mt-auto flex flex-col items-stretch">
                      <Link href={`/vehiculos/${vehicle.id}`} passHref className="w-full mb-2">
                        <Button variant="outline" className="w-full text-accent-neon border-accent-neon hover:bg-accent-neon hover:text-primary transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent-neon focus:ring-offset-2 focus:ring-offset-primary-light shadow-md hover:shadow-lg hover:shadow-accent-neon/30">
                          Ver Detalles
                        </Button>
                      </Link>
                      {isAdmin && (
                        <div className="flex space-x-2 mt-2 w-full">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1 text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-primary transition-all duration-300"
                            onClick={() => handleEditVehicle(vehicle.id!)}
                          >
                            <Edit size={16} className="mr-1" /> Editar
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-500 border-red-500 hover:bg-red-500 hover:text-primary transition-all duration-300"
                            onClick={() => handleDeleteVehicle(vehicle.id!)}
                          >
                            <Trash2 size={16} className="mr-1" /> Eliminar
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="mr-2"
                >
                  Anterior
                </Button>
                <span className="text-white mx-2">Página {currentPage} de {totalPages}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-2"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
          {/* Schema.org dinámico para SEO */}
          {dynamicVehicleSchema && (
            <Script type="application/ld+json" id="vehicle-list-schema" dangerouslySetInnerHTML={{ __html: JSON.stringify(dynamicVehicleSchema) }} />
          )}
        </>
      )}
    </>
  );
}
