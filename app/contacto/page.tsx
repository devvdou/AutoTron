import type { Metadata } from "next"
import ContactSection from "@/components/contact-section"

export const metadata: Metadata = {
  title: "Contacto | Autotron Valdivia",
  description:
    "Contáctanos para obtener más información sobre nuestros vehículos y servicios. Estamos ubicados en Valdivia y listos para ayudarte a encontrar el vehículo perfecto.",
  keywords: "contacto automotora, contacto concesionario, venta autos valdivia, servicio automotriz",
  openGraph: {
    title: "Contacto | Autotron Valdivia",
    description: "Contáctanos para obtener más información sobre nuestros vehículos y servicios",
    images: [{ url: "/og-contact.jpg", width: 1200, height: 630, alt: "Contacto Autotron" }],
  },
}

export default function ContactoPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="mb-4">
            Contacta con <span className="text-accent-neon">Nosotros</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Estamos aquí para responder todas tus preguntas y ayudarte a encontrar el vehículo perfecto para ti. No
            dudes en ponerte en contacto con nuestro equipo.
          </p>
        </div>
      </div>

      <ContactSection />
    </div>
  )
}
