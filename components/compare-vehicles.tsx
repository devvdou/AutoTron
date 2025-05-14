"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { X, Check, Minus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CompareVehiclesProps {
  vehicleIds: number[]
  vehicles: any[] // Replace 'any' with the actual vehicle type if available
  onClose: () => void
  formatPrice: (price: number) => string
}

export const CompareVehicles: React.FC<CompareVehiclesProps> = ({ vehicleIds, vehicles, onClose, formatPrice }) => {
  const [isLoaded, setIsLoaded] = useState(true)

  const selectedVehicles = vehicles.filter((vehicle) => vehicleIds.includes(vehicle.id))

  // Get all unique feature categories from all vehicles
  const getFeatureCategories = () => {
    const categories = [
      { name: "Marca", key: "brand" },
      { name: "Modelo", key: "model" },
      { name: "Año", key: "year" },
      { name: "Precio", key: "price", format: (value: number) => formatPrice(value) },
      { name: "Tipo", key: "type" },
      { name: "Transmisión", key: "transmission" },
      { name: "Combustible", key: "fuel" },
      { name: "Kilometraje", key: "mileage", format: (value: number) => `${value.toLocaleString()} km` },
      { name: "Motor", key: "engine" },
      { name: "Potencia", key: "power" },
    ]

    // Add all features as categories
    const allFeatures = new Set<string>()
    selectedVehicles.forEach((vehicle) => {
      vehicle.features.forEach((feature: string) => {
        allFeatures.add(feature)
      })
    })

    // Add features to categories
    allFeatures.forEach((feature) => {
      categories.push({
        name: feature,
        key: `feature_${feature}`,
        isFeature: true,
        featureName: feature,
      })
    })

    return categories
  }

  const featureCategories = getFeatureCategories()

  // Check if a vehicle has a specific feature
  const hasFeature = (vehicle: any, featureName: string) => {
    return vehicle.features.includes(featureName)
  }

  // Get value for a category
  const getCategoryValue = (vehicle: any, category: any) => {
    if (category.isFeature) {
      return hasFeature(vehicle, category.featureName) ? (
        <Check className="w-5 h-5 text-accent-neon-secondary mx-auto" />
      ) : (
        <Minus className="w-5 h-5 text-text-muted mx-auto" />
      )
    }

    const value = vehicle[category.key]
    if (value === undefined || value === null) return "-"

    return category.format ? category.format(value) : value
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="card-neon max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1 text-text-secondary hover:text-white transition-colors z-10"
            aria-label="Cerrar comparación"
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">Comparación de Vehículos</h2>

          {selectedVehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-3 text-left border-b border-gray-700 w-1/4">Característica</th>
                    {selectedVehicles.map((vehicle) => (
                      <th key={vehicle.id} className="p-3 text-center border-b border-gray-700">
                        <div className="relative h-32 w-full mb-3">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-accent-neon">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-text-secondary">{vehicle.year}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureCategories.map((category, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-surface-light/30" : ""}>
                      <td className="p-3 border-b border-gray-700 font-medium">{category.name}</td>
                      {selectedVehicles.map((vehicle) => (
                        <td key={vehicle.id} className="p-3 text-center border-b border-gray-700">
                          {getCategoryValue(vehicle, category)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-text-secondary text-center">No se han seleccionado vehículos para comparar.</p>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {selectedVehicles.length > 0 && (
              <Link href={`/vehiculos/${selectedVehicles[0].id}`} className="btn-primary">
                Ver Detalles
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CompareVehicles
