"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Calendar, Fuel, Settings, Gauge, DollarSign, Car, Heart, Info, MapPin, Phone as PhoneIcon, Mail as MailIcon } from "lucide-react"
import Head from "next/head"
import { VehicleSchema } from "@/components/seo/vehicle-schema"
import { useToast } from "@/components/ui/use-toast"
import UserService from "@/lib/services/user-service"
import { supabase } from "@/lib/supabase" // Import Supabase client
import { type Vehicle } from "@/lib/types" // Import Vehicle type
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { COMPANY_DATA } from "@/lib/constants"

// Remove vehiclesData as we will fetch from Supabase
// const vehiclesData = [ ... ] 

export default function VehiculoDetalle() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null) // Use Vehicle type
  const [isLoading, setIsLoading] = useState(true)
  const [pageUrl, setPageUrl] = useState("")
  // Eliminado: const [isFavorite, setIsFavorite] = useState(false)
  // Eliminado: const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setPageUrl(window.location.href)
    const vehicleId = params.id as string;

    if (!vehicleId) {
      router.push("/vehiculos");
      return;
    }

    const fetchVehicleAndFavoriteStatus = async () => {
      setIsLoading(true);
      try {
        // Fetch vehicle details
        const { data: vehicleData, error: vehicleError } = await supabase
          .from("vehicles")
          .select("*")
          .eq("id", vehicleId)
          .single();

        if (vehicleError || !vehicleData) {
          console.error("Error fetching vehicle:", vehicleError);
          toast({
            title: "Error",
            description: "No se pudo cargar el vehículo.",
            variant: "destructive",
          });
          router.push("/vehiculos");
          return;
        }
        setVehicle(vehicleData as Vehicle);
      } catch (error) {
        console.error("Error in vehicle detail page:", error);
        toast({
          title: "Error",
          description: "Ocurrió un error inesperado.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleAndFavoriteStatus();
  }, [params.id, router, toast]);

  // Eliminado: const toggleFavorite = async () => {
  //   toast({
  //     title: "Función no disponible",
  //     description: "La funcionalidad de favoritos ha sido deshabilitada temporalmente.",
  //     variant: "destructive",
  //   });
  // };

  const handleTestDrive = () => {
    if (vehicle) {
      sessionStorage.setItem(
        "testDriveVehicle",
        JSON.stringify({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          image: vehicle.images?.[0] || '/placeholder.svg'
        }),
      )
    }
    router.push("/test-drive");
  };

  const handleContactForm = () => {
    if (vehicle) {
      sessionStorage.setItem(
        "contactVehicle",
        JSON.stringify({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          image: vehicle.images?.[0] || '/placeholder.svg'
        }),
      )
    }
    router.push("/contacto");
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-40 bg-primary-light/50 rounded mb-4"></div>
          <div className="h-4 w-60 bg-primary-light/30 rounded"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vehículo no encontrado</h2>
          <p className="text-text-secondary mb-6">Lo sentimos, el vehículo que estás buscando no está disponible.</p>
          <Link href="/vehiculos" className="btn-primary">
            Ver todos los vehículos
          </Link>
        </div>
      </div>
    )
  }

  // Formatear precio en CLP
  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined || price === null) return "Precio no disponible";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(price));
  }

  const nextImage = () => {
    if (vehicle && vehicle.images && vehicle.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex === (vehicle.images?.length ?? 0) - 1 ? 0 : prevIndex + 1));
    }
  };

  const prevImage = () => {
    if (vehicle && vehicle.images && vehicle.images.length > 1) {
     setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? (vehicle.images?.length ?? 0) - 1 : prevIndex - 1));
    }
  };

  const pageTitle = vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${COMPANY_DATA.name}` : `${COMPANY_DATA.name}`;
  const pageDescription = vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}. ${vehicle.type}, ${vehicle.transmission}, ${vehicle.fuel_type}. ${vehicle.description?.substring(0, 150)}...` : 'Detalles del vehículo.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {vehicle && (
          <>
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={vehicle.images?.[0] || "/placeholder.svg"} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:type" content="product" />
            <link rel="canonical" href={pageUrl} />
          </>
        )}
      </Head>

      {vehicle && pageUrl && <VehicleSchema vehicle={vehicle} url={pageUrl} />}

      <div className="pt-24 pb-16 bg-gradient-to-br from-primary to-primary-dark text-white min-h-screen">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol
              className="flex items-center text-sm text-text-secondary"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" className="hover:text-accent-neon transition-colors" itemProp="item">
                  <span itemProp="name">Inicio</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span className="mx-2">/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/vehiculos" className="hover:text-accent-neon transition-colors" itemProp="item">
                  <span itemProp="name">Vehículos</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <span className="mx-2">/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" aria-current="page">
                <span className="text-accent-neon" itemProp="name">
                  {vehicle.brand} {vehicle.model}
                </span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 neon-text">
              {vehicle.brand} {vehicle.model} <span className="text-accent-neon">{vehicle.year}</span>
            </h1>
            <p className="text-gray-300 text-lg capitalize">
              {vehicle.type} • {vehicle.transmission} • {vehicle.fuel_type}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda: Galería de imágenes */}
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-accent-neon/30 h-[300px] md:h-[400px] lg:h-[500px] mb-4 bg-primary-light">
                <Image
                  src={vehicle.images?.[currentImageIndex] || "/placeholder.svg"}
                  alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year} - Vista ${currentImageIndex + 1}`}
                  fill
                  className="object-contain transition-transform duration-500 ease-in-out hover:scale-105"
                  priority={currentImageIndex === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                />

                {vehicle.images && vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-accent-neon/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-neon"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-accent-neon/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-neon"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {vehicle.images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-accent-neon scale-125' : 'bg-gray-500/70 hover:bg-gray-400/70'}`}
                                aria-label={`Ir a imagen ${index + 1}`}
                            />
                        ))}
                    </div>
                  </>
                )}
              </div>

              {/* Miniaturas (opcional) */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index ? "border-accent-neon shadow-md" : "border-transparent hover:border-accent-neon/50"}`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Columna derecha: Información y acciones */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-primary-light p-6 rounded-lg shadow-xl border border-accent-neon/20">
                <h2 className="text-2xl font-bold text-accent-neon mb-4">{formatPrice(vehicle.price)}</h2>
                
                <div className="space-y-3 text-gray-200">
                    <InfoItem icon={<Car size={18} />} label="Marca" value={vehicle.brand} />
                    <InfoItem icon={<Car size={18} />} label="Modelo" value={vehicle.model} />
                    <InfoItem icon={<Calendar size={18} />} label="Año" value={vehicle.year?.toString()} />
                    <InfoItem icon={<Settings size={18} />} label="Transmisión" value={vehicle.transmission} />
                    <InfoItem icon={<Fuel size={18} />} label="Combustible" value={vehicle.fuel_type} />
                    <InfoItem icon={<Gauge size={18} />} label="Kilometraje" value={`${vehicle.mileage?.toLocaleString() || 'N/A'} km`} />
                    {vehicle.engine_displacement && <InfoItem icon={<Settings size={18} />} label="Motor" value={`${vehicle.engine_displacement} ${vehicle.engine_power ? `(${vehicle.engine_power} HP)`: '' }`} />}
                    {vehicle.color && <InfoItem icon={<Settings size={18} />} label="Color" value={vehicle.color} />}
                    {vehicle.doors && <InfoItem icon={<Car size={18} />} label="Puertas" value={vehicle.doors.toString()} />}
                </div>

                <div className="mt-6 flex flex-col space-y-3">
                  <Button onClick={handleTestDrive} className="w-full btn-primary text-lg py-3">
                    Agendar Test-Drive
                  </Button>
                  <Button onClick={handleContactForm} variant="secondary" className="w-full btn-secondary text-lg py-3">
                    Consultar por este vehículo
                  </Button>

                </div>
              </div>

              <div className="bg-primary-light p-6 rounded-lg shadow-xl border border-accent-neon/20">
                <h3 className="text-xl font-semibold mb-3 text-white">Descripción</h3>
                <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                  {vehicle.description || "No hay descripción disponible para este vehículo."}
                </p>
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="bg-primary-light p-6 rounded-lg shadow-xl border border-accent-neon/20">
                  <h3 className="text-xl font-semibold mb-3 text-white">Características Destacadas</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <ChevronRight size={16} className="mr-2 text-accent-neon flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Contact Info Section */}
              <div className="bg-primary-light p-6 rounded-lg shadow-xl border border-accent-neon/20">
                <h3 className="text-xl font-semibold mb-4 text-white">¿Interesado? Contáctanos</h3>
                <div className="space-y-3">
                    <a href={`tel:${COMPANY_DATA.phone}`} className="flex items-center text-gray-300 hover:text-accent-neon transition-colors">
                        <PhoneIcon size={18} className="mr-3 text-accent-neon" /> {COMPANY_DATA.phone}
                    </a>
                    <a href={`mailto:${COMPANY_DATA.email}`} className="flex items-center text-gray-300 hover:text-accent-neon transition-colors">
                        <MailIcon size={18} className="mr-3 text-accent-neon" /> {COMPANY_DATA.email}
                    </a>
                    <p className="flex items-start text-gray-300">
                        <MapPin size={18} className="mr-3 text-accent-neon mt-1 flex-shrink-0" /> 
                        <span>{COMPANY_DATA.address}, {COMPANY_DATA.city}, {COMPANY_DATA.country}</span>
                    </p>
                </div>
              </div>

            </div>
          </div>

          {/* TODO: Sección de vehículos relacionados */}
        </div>
      </div>
    </>
  )
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => {
    if (!value) return null;
    return (
        <div className="flex items-center">
            <span className="text-accent-neon mr-2">{icon}</span>
            <span className="font-medium text-gray-400">{label}:</span>
            <span className="ml-2 text-white capitalize">{value}</span>
        </div>
    );
};

// ...existing code...
