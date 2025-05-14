"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Carlos Mendoza",
    role: "Empresario",
    quote:
      "Excelente servicio y atención. El proceso de compra fue rápido y transparente. Mi nuevo Toyota RAV4 superó todas mis expectativas.",
    rating: 5,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "María Fernández",
    role: "Ingeniera",
    quote:
      "La experiencia de compra fue excepcional. El asesor me ayudó a encontrar el vehículo perfecto para mis necesidades y presupuesto.",
    rating: 5,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Roberto Sánchez",
    role: "Médico",
    quote:
      "El servicio técnico es de primera calidad. Rápidos, eficientes y con precios justos. Recomiendo totalmente esta automotora.",
    rating: 4,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Ana Martínez",
    role: "Profesora",
    quote:
      "Alquilé un vehículo para mis vacaciones y fue una experiencia perfecta. El auto estaba impecable y el proceso fue muy sencillo.",
    rating: 5,
    image: "/placeholder.svg?height=200&width=200",
  },
]

const Testimonials = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="section-padding bg-primary-light/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">
            Lo que dicen nuestros <span className="text-accent-neon">Clientes</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mayor recompensa. Conoce sus experiencias con nuestros
            servicios.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Controles de navegación */}
          <div className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 z-10">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-primary-light/50 flex items-center justify-center hover:bg-accent-neon/20 transition-colors"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 z-10">
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-primary-light/50 flex items-center justify-center hover:bg-accent-neon/20 transition-colors"
              aria-label="Testimonio siguiente"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Carrusel de testimonios */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-primary/60 backdrop-blur-sm rounded-lg p-8 border border-accent-neon/20 hover:border-accent-neon/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-accent-neon">
                        <Image
                          src={testimonial.image || "/placeholder.svg?height=200&width=200"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating ? "text-accent-neon fill-accent-neon" : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-lg italic mb-4">"{testimonial.quote}"</p>

                        <div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-text-secondary text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-accent-neon w-6" : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
