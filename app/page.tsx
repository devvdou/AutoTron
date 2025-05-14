import Hero from "@/components/hero"
import FeaturedVehicles from "@/components/featured-vehicles"
import Services from "@/components/services"
import TestDriveSection from "@/components/test-drive-section"
import Testimonials from "@/components/testimonials"
import BrandsSection from "@/components/brands-section"
import ContactSection from "@/components/contact-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autotron | Tu Automotora de Confianza en Valdivia",
  description:
    "Automotora con la mejor selección de vehículos nuevos y usados en Valdivia. Financiamiento, servicio técnico y garantía. ¡Visítanos hoy!",
  keywords: "automotora valdivia, autos usados, autos nuevos, compra venta autos, concesionario",
  openGraph: {
    title: "Autotron | Tu Automotora de Confianza en Valdivia",
    description: "La mejor selección de vehículos con garantía y financiamiento",
    images: [{ url: "/og-home.jpg", width: 1200, height: 630, alt: "Autotron Valdivia" }],
  },
}

export default function Home() {
  return (
    <main>
      {/* Hero section */}
      <Hero />

      {/* Featured Vehicles section */}
      <FeaturedVehicles />

      {/* Services section */}
      <Services />

      {/* Test Drive section */}
      <TestDriveSection />

      {/* Testimonials section */}
      <Testimonials />

      {/* Brands section */}
      <BrandsSection />

      {/* Contact section */}
      <ContactSection />
    </main>
  )
}
