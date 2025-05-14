"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"

// Car brand logos
const CAR_BRANDS = [
  { id: 1, name: "Chevrolet", logo: "/logos/chevrolet.png" },
  { id: 2, name: "Mitsubishi", logo: "/logos/mitsubishi.png" },
  { id: 3, name: "Subaru", logo: "/logos/subaru.png" },
  { id: 4, name: "Nissan", logo: "/logos/nissan.png" },
  { id: 5, name: "Peugeot", logo: "/logos/peugeot.png" },
  { id: 6, name: "Honda", logo: "/logos/honda.png" },
  { id: 7, name: "Mazda", logo: "/logos/mazda.png" },
  { id: 8, name: "Hyundai", logo: "/logos/hyundai.png" },
  { id: 9, name: "Toyota", logo: "/logos/toyota.png" },
  { id: 10, name: "Ford", logo: "/logos/ford.png" },
]

const BrandsSection = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    setIsLoaded(true)
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Duplicamos las marcas para crear un efecto de carrusel infinito
  const duplicatedBrands = [...CAR_BRANDS, ...CAR_BRANDS]

  return (
    <section className="py-12 bg-primary" ref={containerRef}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">
            Marcas <span className="text-accent-neon">Representadas</span>
          </h2>
          <p className="text-text-secondary">
            Trabajamos con las mejores marcas del mercado para ofrecerte calidad y confianza.
          </p>
        </motion.div>

        {/* Carrusel de marcas */}
        <div className="relative overflow-hidden py-4">
          {/* Primera fila - movimiento hacia la derecha */}
          <motion.div
            className="flex space-x-8 mb-8"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`row1-${brand.id}-${index}`}
                className="bg-primary-light/20 rounded-lg p-4 flex items-center justify-center hover:bg-primary-light/40 transition-all duration-300 min-w-[180px] h-20"
              >
                <motion.div
                  className="relative h-12 w-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image
                    src={brand.logo || "/placeholder.svg?height=100&width=200"}
                    alt={`Logo de ${brand.name}`}
                    fill
                    alt={`Logo de ${brand.name}`}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                  <p className="absolute -bottom-5 left-0 right-0 text-center text-sm text-accent-neon">{brand.name}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Segunda fila - movimiento hacia la izquierda */}
          <motion.div
            className="flex space-x-8"
            animate={{
              x: [-1920, 0],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedBrands.reverse().map((brand, index) => (
              <div
                key={`row2-${brand.id}-${index}`}
                className="bg-primary-light/20 rounded-lg p-4 flex items-center justify-center hover:bg-primary-light/40 transition-all duration-300 min-w-[180px] h-20"
              >
                <motion.div
                  className="relative h-12 w-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image
                    src={brand.logo || "/placeholder.svg?height=100&width=200"}
                    alt={`Logo de ${brand.name}`}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                  <p className="absolute -bottom-5 left-0 right-0 text-center text-sm text-accent-neon">{brand.name}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BrandsSection
