"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface FilterOptions {
  brands: string[];
  types: string[];
  transmissions: string[];
  fuels: string[];
}

interface VehicleSearchFiltersProps {
  // filterOptions: FilterOptions; // Se eliminará esta línea
  brands: string[]; // Se añadirá esta línea
  types: string[]; // Se añadirá esta línea
  transmissions: string[]; // Se añadirá esta línea
  fuels: string[]; // Se añadirá esta línea
  onSearch: (searchTerm: string) => void;
  onFiltersChange: (filters: any) => void;
  initialSearchTerm?: string;
  initialFilters?: any;
}

export default function VehicleSearchFilters({
  // filterOptions, // Se eliminará esta línea
  brands, // Se añadirá esta línea
  types, // Se añadirá esta línea
  transmissions, // Se añadirá esta línea
  fuels, // Se añadirá esta línea
  onSearch,
  onFiltersChange,
  initialSearchTerm = "",
  initialFilters = {},
}: VehicleSearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: initialFilters.brand || "Todos",
    type: initialFilters.type || "Todos",
    transmission: initialFilters.transmission || "Todos",
    fuel: initialFilters.fuel || "Todos",
    priceRange: initialFilters.priceRange || [0, 50000000],
    yearRange: initialFilters.yearRange || [2015, 2023],
  });
  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]);

  return (
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
          onClick={handleToggleFilters}
          className={`btn-outline flex items-center justify-center gap-2 group transition-all duration-300 shadow-lg hover:shadow-accent-neon/40 hover:bg-accent-neon/20 hover:border-accent-neon focus:ring-2 focus:ring-accent-neon focus:outline-none relative overflow-hidden ${showFilters ? 'bg-accent-neon/10 border-accent-neon ring-2 ring-accent-neon' : ''}`}
          aria-expanded={showFilters}
          aria-controls="vehicle-filters"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-accent-neon/30 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none animate-pulse" />
          <Filter className="h-5 w-5 group-hover:text-accent-neon animate-spin-slow transition-colors" />
          <span className="font-semibold tracking-wide text-base group-hover:text-accent-neon transition-colors">Filtros</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-300", showFilters ? "rotate-180 text-accent-neon" : "")}
          />
        </button>
      </div>
      {showFilters && (
        <div id="vehicle-filters" className="card-neon mb-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Filtro por marca */}
            <div className="space-y-2">
              <label htmlFor="filter-brand" className="block text-sm font-medium mb-1 text-text-secondary">
                Marca
              </label>
              <select
                id="filter-brand"
                className="input-neon"
                value={filters.brand}
                onChange={(e) => setFilters((prev:any) => ({ ...prev, brand: e.target.value }))}
              >
                <option value="Todos">Todos</option>
                {brands.map((brand: string) => (
                  <option key={brand} value={brand}>{brand}</option>
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
                value={filters.type}
                onChange={(e) => setFilters((prev:any) => ({ ...prev, type: e.target.value }))}
              >
                <option value="Todos">Todos</option>
                {types.map((type: string) => (
                  <option key={type} value={type}>{type}</option>
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
                value={filters.transmission}
                onChange={(e) => setFilters((prev:any) => ({ ...prev, transmission: e.target.value }))}
              >
                <option value="Todos">Todos</option>
                {transmissions.map((transmission: string) => (
                  <option key={transmission} value={transmission}>{transmission}</option>
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
                value={filters.fuel}
                onChange={(e) => setFilters((prev:any) => ({ ...prev, fuel: e.target.value }))}
              >
                <option value="Todos">Todos</option>
                {fuels.map((fuel: string) => (
                  <option key={fuel} value={fuel}>{fuel}</option>
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
                  {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                id="price-range"
                defaultValue={[0, 50000000]}
                max={50000000}
                step={1000000}
                value={filters.priceRange}
                onValueChange={(value) => setFilters((prev:any) => ({ ...prev, priceRange: value }))}
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
                  {filters.yearRange[0]} - {filters.yearRange[1]}
                </span>
              </div>
              <Slider
                id="year-range"
                defaultValue={[2015, 2023]}
                min={2015}
                max={2023}
                step={1}
                value={filters.yearRange}
                onValueChange={(value) => setFilters((prev:any) => ({ ...prev, yearRange: value }))}
                className="py-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}