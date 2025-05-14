"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import ServiceService, { Service } from "@/lib/services/service-service"

const Services = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    setIsLoaded(true)
    const fetchServices = async () => {
      try {
        const data = await ServiceService.getAllServices()
        setServices(data)
      } catch (error) {
        console.error("Error al obtener servicios:", error)
      }
    }
    fetchServices()
  }, [])

  return (
    <section id="servicios" className="section-padding bg-primary">

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">
            Nuestros <span className="text-accent-neon">Servicios</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios para satisfacer todas tus necesidades automotrices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px 8px #00fff7cc' }}
              transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 120 }}
              className="card-neon group relative overflow-hidden shadow-2xl border-2 border-accent-neon/50 rounded-3xl bg-gradient-to-br from-primary-light/80 to-primary-dark/90 hover:from-accent-neon/20 hover:to-primary-dark/95 transition-all duration-300 backdrop-blur-xl"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent-neon/25 rounded-full blur-3xl opacity-70 animate-pulse pointer-events-none"></div>
              <div className="p-10 flex flex-col items-center text-center relative z-10">
                {service.image_url && (
                  <div className="relative w-full h-40 mb-5 rounded-2xl overflow-hidden border-4 border-accent-neon/60 shadow-neon">
                    <img src={service.image_url} alt={service.title || service.name} className="object-cover w-full h-full" />
                  </div>
                )}
                <h3 className="text-2xl font-extrabold mb-3 group-hover:text-accent-neon transition-colors drop-shadow-glow flex items-center justify-center gap-2">
                  {index === 0 && <span role="img" aria-label="herramienta">🛠️</span>}
                  {index === 1 && <span role="img" aria-label="computadora">💻</span>}
                  {index === 2 && <span role="img" aria-label="lavado">🧽</span>}
                  {service.title || service.name}
                </h3>
                <p className="text-text-secondary mb-5 text-base font-medium drop-shadow-glow-soft min-h-[60px]">{service.description}</p>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full flex justify-center"
                >
                  <Link href="#contacto" className="btn-primary mt-2 shadow-neon w-full max-w-xs text-lg font-bold py-3 rounded-xl transition-all duration-200">
                    Solicitar este servicio
                  </Link>
                </motion.div>
              </div>
              <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-accent-neon/60 to-transparent animate-glow-bar"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
