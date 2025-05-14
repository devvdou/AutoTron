"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import Particles from "@/components/particles"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { GlitchText } from "@/components/ui/glitch-text"
import { VEHICLES_DATA } from "@/lib/constants"
import VehicleService from "@/lib/services/vehicle-service"

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Mouse parallax effect for the car image
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 50, stiffness: 300 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (clientX - left - width / 2) / 20
    const y = (clientY - top - height / 2) / 20

    mouseX.set(x)
    mouseY.set(y)
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Text for typewriter effect
  const words = [
    {
      text: "Tu",
    },
    {
      text: "Automotora",
    },
    {
      text: "de",
    },
    {
      text: "Confianza",
      className: "text-accent-neon neon-text-intense",
    },
    {
      text: "en",
    },
    {
      text: "Valdivia",
    },
  ]

  const [vehicles, setVehicles] = useState<any[]>([])
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await VehicleService.getAllVehicles()
        setVehicles(data)
      } catch (error) {
        console.error("Error al obtener vehículos:", error)
        setVehicles([])
      }
    }
    fetchVehicles()
  }, [])

  useEffect(() => {
    // Rotar entre vehículos cada 3 segundos
    const rotationInterval = setInterval(() => {
      setCurrentVehicleIndex((prevIndex) => {
        if (vehicles.length === 0) return 0
        return (prevIndex + 1) % vehicles.length
      })
    }, 3000)
    return () => clearInterval(rotationInterval)
  }, [vehicles])

  // Obtener el vehículo actual a mostrar
  const currentVehicle = vehicles.length > 0 ? vehicles[currentVehicleIndex] : null

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced particle effects */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        colorPalette={["#FF0040", "#00FFBB", "#4D00FF", "#FFFFFF"]}
        particleType="mixed"
        interactive={true}
        speed={0.8}
        glowEffect={true}
        fadeEffect={true}
      />

      {/* Scan line effect */}
      <div className="scan-line"></div>

      {/* Background grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20 z-0"></div>

      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>

      <div className="container-custom relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y, opacity }}
            className="flex flex-col space-y-6"
          >
            <div className="mb-4">
              <h1 className="sr-only">Tu Automotora de Confianza en Valdivia</h1>
              <TypewriterEffect words={words} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" />
            </div>

            <motion.p
              className="text-lg md:text-xl text-text-secondary max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Descubre nuestra exclusiva selección de vehículos premium con la mejor tecnología y diseño del mercado.
              Somos expertos en el sector automotriz con más de 8 años de experiencia.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <Link href="/vehiculos" className="btn-primary group">
                <span className="relative z-10">Ver Inventario Ahora</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>

              <Link href="/test-drive" className="btn-outline group">
                <span className="relative z-10">Agendar Test-Drive</span>
                <span className="absolute -inset-[1px] rounded-md bg-gradient-to-r from-accent-neon/0 via-accent-neon/50 to-accent-neon/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full"
            style={{
              x: springX,
              y: springY,
            }}
          >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <Image
                src={currentVehicle && currentVehicle.image ? currentVehicle.image : "/placeholder.svg?height=800&width=1200"}
                alt={currentVehicle ? `${currentVehicle.brand} ${currentVehicle.model} ${currentVehicle.year} - Vehículo destacado` : "Vehículo destacado"}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>

              {/* Neon glow effect */}
              <motion.div
                className="absolute inset-0 opacity-0 transition-opacity duration-300"
                whileHover={{ opacity: 1 }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255, 0, 64, 0.5)",
                    "0 0 20px rgba(255, 0, 64, 0.7)",
                    "0 0 10px rgba(255, 0, 64, 0.5)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className="absolute inset-0 rounded-lg neon-glow-intense"></div>
              </motion.div>
            </div>

            {/* Cyberpunk-style data overlay */}
            <div className="cyber-data-display absolute bottom-4 right-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>MODELO:</span>
                  <GlitchText text={currentVehicle ? `${currentVehicle.brand} ${currentVehicle.model}` : "-"} />
                </div>
                <div className="flex justify-between">
                  <span>POTENCIA:</span>
                  <span className="neon-flicker">{currentVehicle ? currentVehicle.power : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>AÑO:</span>
                  <span>{currentVehicle ? currentVehicle.year : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>KM:</span>
                  <span>{currentVehicle ? currentVehicle.mileage?.toLocaleString() : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>PRECIO:</span>
                  <span className="text-accent-neon">{currentVehicle ? VehicleService.formatPrice(currentVehicle.price) : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>ESTADO:</span>
                  <span className="text-accent-neon-secondary">DISPONIBLE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
