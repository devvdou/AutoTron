"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, X, Zap, Gauge, Clock, Heart, Car } from "lucide-react";
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CompareVehicles } from "@/components/compare-vehicles"
import VehicleService from "@/lib/services/vehicle-service"
import UserService from "@/lib/services/user-service"
import Particles from "@/components/particles"

const FeaturedVehicles = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([])
  const [quickViewVehicle, setQuickViewVehicle] = useState<number | null>(null)
  // Eliminado: import UserService from "@/lib/services/user-service"
  // Eliminado: const [favorites, setFavorites] = useState<number[]>([])
  // Eliminado: Carga de favoritos en useEffect (UserService.getFavorites y setFavorites)
  // Eliminado: función toggleFavorite y llamadas relacionadas
  // Eliminado: props y botones de favoritos en el renderizado (Heart, isFavorite, onToggleFavorite, etc.)
  const [isLoading, setIsLoading] = useState(true)

  // Estados para filtros
  const [selectedBrand, setSelectedBrand] = useState("Todos")
  const [selectedType, setSelectedType] = useState("Todos")
  const [selectedTransmission, setSelectedTransmission] = useState("Todos")
  const [selectedFuel, setSelectedFuel] = useState("Todos")
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [yearRange, setYearRange] = useState([2015, 2023])
  const [filterOptions, setFilterOptions] = useState<any>({
    brands: [],
    types: [],
    transmissions: [],
    fuels: [],
  })

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })

  // Load vehicles and filter options
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Load vehicles
        const vehiclesData = await VehicleService.getAllVehicles()
        setVehicles(vehiclesData)
        setFilteredVehicles(vehiclesData)

        // Load filter options
        const options = await VehicleService.getFilterOptions()
        setFilterOptions(options)

        // Eliminado: Load user favorites
        // const userFavorites = await UserService.getFavorites()
        // setFavorites(userFavorites)

        setIsLoaded(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters when filter values change
  useEffect(() => {
    if (!isLoaded) return

    const applyFilters = async () => {
      try {
        const filtered = await VehicleService.filterVehicles({
          brand: selectedBrand,
          type: selectedType,
          transmission: selectedTransmission,
          fuel: selectedFuel,
          priceRange: [priceRange[0], priceRange[1]],
          yearRange: [yearRange[0], yearRange[1]],
          searchTerm: searchTerm,
        })

        setFilteredVehicles(filtered)
      } catch (error) {
        console.error("Error applying filters:", error)
      }
    }

    applyFilters()
  }, [isLoaded, selectedBrand, selectedType, selectedTransmission, selectedFuel, priceRange, yearRange, searchTerm])

  const toggleVehicleComparison = (id: number) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((vehicleId) => vehicleId !== id))
    } else {
      if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, id])
      }
    }
  }

  const clearComparison = () => {
    setSelectedForComparison([])
    setCompareMode(false)
  }

  const handleQuickView = (id: number | null) => {
    setQuickViewVehicle(id)
  }

  const toggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const updatedFavorites = await UserService.toggleFavorite(id)
      setFavorites(updatedFavorites)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="vehiculos" ref={sectionRef} className="section-padding bg-primary relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20 z-0"></div>

      {/* Subtle particle effect */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={30}
        colorPalette={["#00FFBB", "#4D00FF"]}
        particleType="dust"
        speed={0.3}
        fadeEffect={true}
        opacity={0.3}
      />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">
            Explora Nuestro <span className="text-accent-neon animate-glow">Inventario</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Descubre nuestra selección de vehículos premium con las mejores características y tecnología del mercado.
          </p>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1 group">
              <label htmlFor="search-vehicles" className="sr-only">
                Buscar vehículos
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary group-focus-within:text-accent-neon transition-colors duration-300" />
              <input
                type="text"
                id="search-vehicles"
                placeholder="Buscar por marca, modelo..."
                className="input-neon pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-neon/50 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center justify-center gap-2 group"
              aria-expanded={showFilters}
              aria-controls="vehicle-filters"
            >
              <Filter className="h-5 w-5 group-hover:text-accent-neon transition-colors" />
              Filtros
              <ChevronDown
                className={cn("h-4 w-4 transition-transform duration-300", showFilters ? "rotate-180" : "")}
              />
            </button>

            {selectedForComparison.length > 0 && (
              <button
                onClick={() => setCompareMode(true)}
                className="btn-primary flex items-center justify-center gap-2"
              >
                Comparar ({selectedForComparison.length})
              </button>
            )}
          </div>

          {/* Panel de filtros avanzados */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                id="vehicle-filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="card-neon mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Filtro por marca */}
                  <div className="space-y-2">
                    <label htmlFor="filter-brand" className="block text-sm font-medium mb-1 text-text-secondary">
                      Marca
                    </label>
                    <select
                      id="filter-brand"
                      className="input-neon"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      {filterOptions.brands.map((brand: string) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por tipo */}
                  <div className="space-y-2">
                    <label htmlFor="filter-type" className="block text-sm font-medium mb-1 text-text-secondary">
                      Tipo
                    </label>
                    <select
                      id="filter-type"
                      className="input-neon"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {filterOptions.types.map((type: string) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por transmisión */}
                  <div className="space-y-2">
                    <label htmlFor="filter-transmission" className="block text-sm font-medium mb-1 text-text-secondary">
                      Transmisión
                    </label>
                    <select
                      id="filter-transmission"
                      className="input-neon"
                      value={selectedTransmission}
                      onChange={(e) => setSelectedTransmission(e.target.value)}
                    >
                      {filterOptions.transmissions.map((transmission: string) => (
                        <option key={transmission} value={transmission}>
                          {transmission}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por combustible */}
                  <div className="space-y-2">
                    <label htmlFor="filter-fuel" className="block text-sm font-medium mb-1 text-text-secondary">
                      Combustible
                    </label>
                    <select
                      id="filter-fuel"
                      className="input-neon"
                      value={selectedFuel}
                      onChange={(e) => setSelectedFuel(e.target.value)}
                    >
                      {filterOptions.fuels.map((fuel: string) => (
                        <option key={fuel} value={fuel}>
                          {fuel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Rango de precios */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label htmlFor="price-range" className="block text-sm font-medium text-text-secondary">
                        Rango de Precio
                      </label>
                      <span className="text-sm text-accent-neon">
                        {VehicleService.formatPrice(priceRange[0])} - {VehicleService.formatPrice(priceRange[1])}
                      </span>
                    </div>
                    <Slider
                      id="price-range"
                      defaultValue={[0, 50000000]}
                      max={50000000}
                      step={1000000}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                      className="py-4"
                    />
                  </div>

                  {/* Rango de años */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label htmlFor="year-range" className="block text-sm font-medium text-text-secondary">
                        Año
                      </label>
                      <span className="text-sm text-accent-neon">
                        {yearRange[0]} - {yearRange[1]}
                      </span>
                    </div>
                    <Slider
                      id="year-range"
                      defaultValue={[2015, 2023]}
                      min={2015}
                      max={2023}
                      step={1}
                      value={[yearRange[0], yearRange[1]]}
                      onValueChange={(value) => setYearRange([value[0], value[1]])}
                      className="py-4"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-t-accent-neon border-r-accent-neon-secondary border-b-accent-neon-tertiary border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-2 border-t-accent-neon-secondary border-r-accent-neon-tertiary border-b-accent-neon border-l-transparent rounded-full animate-spin-slow"></div>
            </div>
          </div>
        )}

        {/* Grid de vehículos */}
        {!isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <motion.article
                  key={vehicle.id}
                  variants={itemVariants}
                  className="card-neon hover:scale-[1.03] hover:shadow-neon-sm group relative"
                  itemScope
                  itemType="https://schema.org/Vehicle"
                >
                  <meta itemProp="manufacturer" content={vehicle.brand} />
                  <meta itemProp="model" content={vehicle.model} />
                  <meta itemProp="vehicleModelDate" content={vehicle.year.toString()} />
                  <meta itemProp="mileageFromOdometer" content={`${vehicle.mileage} km`} />

                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={vehicle.image || "/placeholder.svg"}
                      alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${vehicle.color}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      itemProp="image"
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="bg-accent-neon text-white font-semibold">
                        {vehicle.type}
                      </Badge>
                    </div>

                    

                    {/* Overlay con acciones rápidas */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-primary/80 border-accent-neon/50 hover:bg-accent-neon/20 text-white"
                          onClick={() => handleQuickView(vehicle.id)}
                        >
                          Vista Rápida
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedForComparison.includes(vehicle.id) ? "default" : "outline"}
                          className={cn(
                            "border-accent-neon/50 text-white",
                            selectedForComparison.includes(vehicle.id)
                              ? "bg-accent-neon hover:bg-accent-neon/80"
                              : "bg-primary/80 hover:bg-accent-neon/20",
                          )}
                          onClick={() => toggleVehicleComparison(vehicle.id)}
                        >
                          {selectedForComparison.includes(vehicle.id) ? "Seleccionado" : "Comparar"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3
                      className="text-xl font-bold mb-1 group-hover:text-accent-neon transition-colors"
                      itemProp="name"
                    >
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-text-secondary mb-3">
                      {vehicle.year} • {vehicle.transmission} • {vehicle.fuel}
                    </p>

                    {/* Características destacadas */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vehicle.features.slice(0, 2).map((feature: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-surface-light text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {vehicle.features.length > 2 && (
                        <Badge variant="outline" className="bg-surface-light text-xs">
                          +{vehicle.features.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className="text-lg font-bold text-accent-neon neon-text"
                        itemProp="offers"
                        itemScope
                        itemType="https://schema.org/Offer"
                      >
                        <meta itemProp="priceCurrency" content="CLP" />
                        <span itemProp="price" content={vehicle.price.toString()}>
                          {VehicleService.formatPrice(vehicle.price)}
                        </span>
                      </span>
                      <Link
                        href={`/vehiculos/${vehicle.id}`}
                        className="btn-outline py-2 px-4 text-sm group-hover:border-accent-neon group-hover:shadow-neon-sm"
                        itemProp="url"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <Search className="h-12 w-12 text-accent-neon/50 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No se encontraron vehículos</h3>
                  <p className="text-text-secondary mb-6">
                    No hay vehículos que coincidan con los criterios de búsqueda. Intenta con otros filtros.
                  </p>
                  <Button
                    variant="outline"
                    className="border-accent-neon text-white hover:bg-accent-neon/20"
                    onClick={() => {
                      setSelectedBrand("Todos")
                      setSelectedType("Todos")
                      setSelectedTransmission("Todos")
                      setSelectedFuel("Todos")
                      setPriceRange([0, 50000000])
                      setYearRange([2015, 2023])
                      setSearchTerm("")
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Botón para ver más */}
        {!isLoading && filteredVehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/vehiculos" className="btn-primary group">
              <span className="relative z-10">Ver Todos los Vehículos</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Modal de vista rápida */}
      <AnimatePresence>
        {quickViewVehicle !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm"
            onClick={() => handleQuickView(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickview-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card-neon max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {vehicles.find((v) => v.id === quickViewVehicle) && (
                <QuickViewContent
                  vehicle={vehicles.find((v) => v.id === quickViewVehicle)!}
                  onClose={() => handleQuickView(null)}
                  formatPrice={VehicleService.formatPrice}
                  isSelected={selectedForComparison.includes(quickViewVehicle)}
                  onToggleCompare={() => toggleVehicleComparison(quickViewVehicle)}
                  
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de comparación */}
      <AnimatePresence>
        {compareMode && selectedForComparison.length > 0 && (
          <CompareVehicles
            vehicleIds={selectedForComparison}
            vehicles={vehicles}
            onClose={clearComparison}
            formatPrice={VehicleService.formatPrice}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// Componente para la vista rápida
const QuickViewContent = ({
  vehicle,
  onClose,
  isSelected,
  onToggleCompare,
}: {
  vehicle: any;
  onClose: () => void;
  isSelected: boolean;
  onToggleCompare: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Mostrar hasta 3 imágenes distintas si existen, si no, rellenar con placeholder
  const images = Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images.slice(0, 3)
    : [vehicle.image || "/placeholder.svg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="quickview-modal">
      <button onClick={onClose} aria-label="Cerrar vista rápida" className="absolute top-4 right-4 z-10 text-white bg-accent-neon rounded-full p-2 hover:bg-accent-neon/80 transition-colors">
        <X size={24} />
      </button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-900">
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year} - Vista ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-10" aria-label="Imagen anterior">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-10" aria-label="Imagen siguiente">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            {/* Indicador de imagen */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-3 py-1 text-xs text-white">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
          {/* Puntos de navegación */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={
                    idx === currentImageIndex
                      ? "bg-accent-neon w-6 h-2 rounded-full"
                      : "bg-gray-600 hover:bg-gray-500 w-2 h-2 rounded-full"
                  }
                  aria-label={`Ver imagen ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <h3 id="quickview-title" className="text-2xl font-bold mb-1 text-accent-neon">
            {vehicle.brand} {vehicle.model}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <span>{vehicle.year}</span>
            <span>•</span>
            <span>{vehicle.transmission}</span>
            <span>•</span>
            <span>{vehicle.fuel}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-4">
            ${Number(vehicle.price).toLocaleString()}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-primary-dark/40 rounded-lg p-3 flex flex-col items-center">
              <Zap className="text-accent-neon mb-1" size={20} />
              <span className="text-xs text-gray-400">Motor</span>
              <span className="font-semibold text-white">{vehicle.engine || '-'}</span>
            </div>
            <div className="bg-primary-dark/40 rounded-lg p-3 flex flex-col items-center">
              <Gauge className="text-accent-neon mb-1" size={20} />
              <span className="text-xs text-gray-400">Potencia</span>
              <span className="font-semibold text-white">{vehicle.power || '-'}</span>
            </div>
            <div className="bg-primary-dark/40 rounded-lg p-3 flex flex-col items-center">
              <Clock className="text-accent-neon mb-1" size={20} />
              <span className="text-xs text-gray-400">0-100 km/h</span>
              <span className="font-semibold text-white">{vehicle.acceleration || '-'}</span>
            </div>
            <div className="bg-primary-dark/40 rounded-lg p-3 flex flex-col items-center">
              <Car className="text-accent-neon mb-1" size={20} />
              <span className="text-xs text-gray-400">Kilometraje</span>
              <span className="font-semibold text-white">{(vehicle.mileage !== undefined && vehicle.mileage !== null) ? vehicle.mileage.toLocaleString() + ' km' : '-'}</span>
            </div>
          </div>
          <div className="mb-4">
            <span className="block text-gray-400 text-sm mb-1">Características</span>
            <span className="text-white text-sm">{vehicle.features?.join(', ') || '-'}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="primary" className="flex-1">Ver Detalles</Button>
            <Button variant="outline" className="flex-1">Comparar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVehicles
