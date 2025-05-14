import Script from "next/script"

interface VehicleSchemaProps {
  vehicle: {
    id: number
    brand: string
    model: string
    year: number
    price: number
    type: string
    transmission: string
    fuel: string
    mileage: number
    engine: string
    power: string
    color: string
    features: string[]
    description: string
    images: string[]
  }
  url: string
}

export const VehicleSchema = ({ vehicle, url }: VehicleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    brand: {
      "@type": "Brand",
      name: vehicle.brand,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    description: vehicle.description,
    vehicleIdentificationNumber: `DEMO-VIN-${vehicle.id}`,
    vehicleEngine: {
      "@type": "EngineSpecification",
      name: vehicle.engine,
    },
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    driveWheelConfiguration: vehicle.features.includes("Tracción AWD")
      ? "AWD"
      : vehicle.features.includes("Tracción 4x4")
        ? "4WD"
        : "FWD",
    color: vehicle.color,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "KMT",
    },
    vehicleInteriorType: vehicle.features.find((f) => f.includes("Asientos")) || "Estándar",
    url: url,
    image: vehicle.images,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "CLP",
      availability: "https://schema.org/InStock",
      itemCondition: vehicle.type === "Nuevo" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      seller: {
        "@type": "AutoDealer",
        name: "Autotron",
        url: "https://www.autotron.cl",
      },
    },
  }

  return (
    <Script id="vehicle-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  )
}
