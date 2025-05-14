"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, Shield } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const TestDriveSection = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    model: "",
    date: "",
    time: "",
    notes: "",
    vehicleId: "",
  })
  const [vehicles, setVehicles] = useState([
    { id: "1", brand: "Toyota", model: "RAV4", year: 2023 },
    { id: "2", brand: "Chevrolet", model: "Camaro", year: 2022 },
    { id: "3", brand: "Mitsubishi", model: "L200", year: 2018 },
    { id: "4", brand: "Subaru", model: "WRX", year: 2017 },
    { id: "5", brand: "Toyota", model: "RAV4", year: 2019 },
    { id: "6", brand: "Honda", model: "Civic", year: 2020 },
  ])
  const [availableTimes, setAvailableTimes] = useState(["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"])
  const [minDate, setMinDate] = useState("")
  const [maxDate, setMaxDate] = useState("")

  useEffect(() => {
    setIsLoaded(true)

    // Check if there's vehicle info in session storage
    const testDriveVehicle = sessionStorage.getItem("testDriveVehicle")
    if (testDriveVehicle) {
      try {
        const vehicleData = JSON.parse(testDriveVehicle)
        setFormData((prev) => ({
          ...prev,
          vehicleId: vehicleData.id.toString(),
          model: `${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}`,
        }))
        // Clear session storage after using it
        sessionStorage.removeItem("testDriveVehicle")
      } catch (error) {
        console.error("Error parsing vehicle data:", error)
      }
    }
  }, [])

  useEffect(() => {
    const today = new Date()
    const min = today.toISOString().split("T")[0]
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + 30)
    const max = maxDate.toISOString().split("T")[0]

    setMinDate(min)
    setMaxDate(max)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // If vehicle ID is selected, update the model field
    if (name === "vehicleId" && value) {
      const selectedVehicle = vehicles.find((v) => v.id === value)
      if (selectedVehicle) {
        setFormData((prev) => ({
          ...prev,
          model: `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year}`,
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/test-drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el formulario")
      }

      // Show success message
      toast({
        title: "¡Test drive agendado!",
        description:
          result.message || "Tu test drive ha sido agendado con éxito. Te contactaremos pronto para confirmar.",
        variant: "default",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        model: "",
        date: "",
        time: "",
        notes: "",
        vehicleId: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar el formulario",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="test-drive" className="section-padding bg-primary-light/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Agenda un <span className="text-accent-neon neon-text">Test Drive</span>
            </h2>
            <p className="text-text-secondary mb-6">
              Experimenta la emoción de conducir tu próximo vehículo. Agenda una prueba de manejo y descubre por qué
              nuestros autos son la mejor opción para ti.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-accent-neon/20 p-3 rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-accent-neon" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Proceso Simple</h4>
                  <p className="text-text-secondary">
                    Agenda en minutos y recibe confirmación inmediata. Sin complicaciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-accent-neon/20 p-3 rounded-lg mr-4">
                  <Clock className="w-6 h-6 text-accent-neon" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Horarios Flexibles</h4>
                  <p className="text-text-secondary">Disponibilidad de lunes a sábado, adaptándonos a tu agenda.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-accent-neon/20 p-3 rounded-lg mr-4">
                  <Shield className="w-6 h-6 text-accent-neon" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Experiencia Segura</h4>
                  <p className="text-text-secondary">
                    Vehículos sanitizados y personal capacitado para una experiencia segura.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card-neon">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h3 className="text-xl font-bold mb-4">Solicita tu Test Drive</h3>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
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
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
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
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-neon"
                      placeholder="+56 9 1234 5678"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicle" className="block text-sm font-medium mb-1">
                    Vehículo de Interés
                  </label>
                  <select
                    id="vehicle"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    required
                    className="input-neon"
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona un vehículo</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="input-neon"
                      min={minDate}
                      max={maxDate}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-1">
                      Hora
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="input-neon"
                      disabled={isSubmitting}
                    >
                      <option value="">Selecciona una hora</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1">
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="input-neon resize-none"
                    placeholder="Información adicional o preguntas específicas"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full relative" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="opacity-0">Agendar Test Drive</span>
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
                    "Agendar Test Drive"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TestDriveSection
