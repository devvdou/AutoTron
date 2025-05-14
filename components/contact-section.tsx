"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { COMPANY_DATA, BUSINESS_HOURS } from "@/lib/constants"
import Script from "next/script"
import { toast } from "@/components/ui/use-toast"

const ContactSection = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    vehicleInfo: "",
  })

  useEffect(() => {
    setIsLoaded(true)

    // Check if there's vehicle info in session storage
    const contactVehicle = sessionStorage.getItem("contactVehicle")
    if (contactVehicle) {
      try {
        const vehicleData = JSON.parse(contactVehicle)
        setFormData((prev) => ({
          ...prev,
          vehicleInfo: `Consulta sobre ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}`,
          message: `Me gustaría recibir más información sobre el ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year} (ID: ${vehicleData.id}).`,
        }))
        // Clear session storage after using it
        sessionStorage.removeItem("contactVehicle")
      } catch (error) {
        console.error("Error parsing vehicle data:", error)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje")
      }

      // Show success message
      toast({
        title: "¡Mensaje enviado!",
        description: result.message || "Tu mensaje ha sido enviado con éxito. Te contactaremos pronto.",
        variant: "default",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        vehicleInfo: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar el mensaje",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="section-padding bg-primary-light/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Contáctanos</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte en todo lo que necesites. No dudes en contactarnos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="text-accent-neon mr-2">
                <MapPin className="inline-block w-5 h-5" />
              </span>
              Información de Contacto
            </h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-accent-neon/20 p-3 rounded-lg mr-4">
                  <MapPin className="w-6 h-6 text-accent-neon" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Dirección</h4>
                  <address className="not-italic text-text-secondary">{COMPANY_DATA.address}</address>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-accent-neon/20 p-3 rounded-lg mr-4">
                  <Phone className="w-6 h-6 text-accent-neon" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Teléfono</h4>
                  <p className="text-text-secondary">
                    <a
                      href={`tel:${COMPANY_DATA.phone.replace(/\s/g, "")}`}
                      className="hover:text-accent-neon transition-colors"
                    >
                      {COMPANY_DATA.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-accent-neon/20 p-3 rounded-lg mr-4">
                  <Mail className="w-6 h-6 text-accent-neon" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-text-secondary">
                    <a href={`mailto:${COMPANY_DATA.email}`} className="hover:text-accent-neon transition-colors">
                      {COMPANY_DATA.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-accent-neon/20 p-3 rounded-lg mr-4">
                  <Clock className="w-6 h-6 text-accent-neon" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Horario de Atención</h4>
                  <p className="text-text-secondary">{BUSINESS_HOURS.weekdays}</p>
                  <p className="text-text-secondary">{BUSINESS_HOURS.saturday}</p>
                </div>
              </div>
            </div>

            {/* Google Maps 3D */}
            <div className="mt-8 rounded-lg overflow-hidden h-[300px] relative neon-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.5076171708584!2d-73.22650492392826!3d-39.81539929249346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9615ee9ff311a8a5%3A0x5f9f3b54c9a86a6c!2sAv.%20Pedro%20Aguirre%20Cerda%201273%2C%20Valdivia%2C%20Los%20R%C3%ADos!5e1!3m2!1ses!2scl!4v1715108400000!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Autotron en Valdivia"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Local Business Schema.org for this location */}
            <Script id="local-business-schema" type="application/ld+json">
              {`
                {
                  "@context": "https://schema.org",
                  "@type": "AutoDealer",
                  "name": "${COMPANY_DATA.name}",
                  "image": "https://www.autotron.cl/storefront.jpg",
                  "@id": "https://www.autotron.cl/#location",
                  "url": "https://www.autotron.cl",
                  "telephone": "${COMPANY_DATA.phone}",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Av. Pedro Aguirre Cerda 1273",
                    "addressLocality": "Valdivia",
                    "addressRegion": "Región de Los Ríos",
                    "postalCode": "5090000",
                    "addressCountry": "CL"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": -39.81539929249346,
                    "longitude": -73.22401925599673
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday"
                      ],
                      "opens": "09:00",
                      "closes": "19:00"
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": "Saturday",
                      "opens": "10:00",
                      "closes": "14:00"
                    }
                  ]
                }
              `}
            </Script>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6">Envíanos un Mensaje</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-neon"
                  placeholder="Tu nombre"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-neon"
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-neon"
                    placeholder="+56 9 1234 5678"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {formData.vehicleInfo && (
                <div>
                  <label htmlFor="contact-vehicle" className="block text-sm font-medium mb-1">
                    Vehículo de Interés
                  </label>
                  <input
                    type="text"
                    id="contact-vehicle"
                    name="vehicleInfo"
                    value={formData.vehicleInfo}
                    onChange={handleChange}
                    className="input-neon"
                    disabled={true}
                  />
                </div>
              )}

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
                  Mensaje
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input-neon resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full relative" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Enviar Mensaje</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  </>
                ) : (
                  "Enviar Mensaje"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
