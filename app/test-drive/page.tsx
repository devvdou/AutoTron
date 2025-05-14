import type { Metadata } from "next"
import TestDriveSection from "@/components/test-drive-section"

export const metadata: Metadata = {
  title: "Agenda un Test Drive | Autotron Valdivia",
  description:
    "Agenda una prueba de manejo personalizada y vive la experiencia de conducir el vehículo de tus sueños. Sin compromiso y totalmente gratuito.",
  keywords: "test drive, prueba de manejo, agendar test drive, probar auto, valdivia",
}

const TestDrivePage = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="mb-4">
            Agenda un <span className="text-accent-neon">Test Drive</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Vive la experiencia de conducir el vehículo de tus sueños. Agenda una prueba de manejo personalizada y
            descubre por qué somos la mejor opción.
          </p>
        </div>
      </div>

      <TestDriveSection />
    </div>
  )
}

export default TestDrivePage
