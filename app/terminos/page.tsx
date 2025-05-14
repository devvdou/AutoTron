import type { Metadata } from "next"
import Link from "next/link"
import { COMPANY_DATA } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Términos y Condiciones | Autotron",
  description: "Conoce nuestros términos y condiciones para el uso de nuestro sitio web y servicios.",
  robots: "noindex, follow",
}

export default function TerminosPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8 text-3xl md:text-4xl font-bold">Términos y Condiciones</h1>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>Última actualización: 1 de Enero de 2023</p>

            <p>
              Bienvenido a {COMPANY_DATA.name}. Los siguientes términos y condiciones rigen todas las interacciones y
              operaciones comerciales con nuestra empresa.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Aceptación de los Términos</h2>

            <p>
              Al acceder y utilizar este sitio web, así como al contratar cualquiera de nuestros servicios, aceptas
              cumplir con estos términos y condiciones, nuestra política de privacidad y todas las leyes y regulaciones
              aplicables. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder a nuestro sitio
              web ni utilizar nuestros servicios.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Venta de Vehículos</h2>

            <p>
              2.1 Todas las ventas de vehículos están sujetas a la disponibilidad de inventario en el momento de la
              compra.
            </p>

            <p>
              2.2 Los precios, características y especificaciones de los vehículos mostrados en nuestro sitio web son
              referenciales y pueden cambiar sin previo aviso.
            </p>

            <p>
              2.3 Para la compra de un vehículo, se requerirá un depósito inicial no reembolsable que asegurará la
              reserva del vehículo.
            </p>

            <p>
              2.4 {COMPANY_DATA.name} garantiza que todos los vehículos vendidos cumplen con las normativas vigentes y
              se encuentran libres de gravámenes y prohibiciones.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Garantía</h2>

            <p>
              3.1 Todos los vehículos nuevos cuentan con la garantía de fábrica, según las condiciones establecidas por
              cada marca.
            </p>

            <p>
              3.2 Los vehículos usados pueden contar con una garantía limitada proporcionada por {COMPANY_DATA.name},
              cuya duración y condiciones se especificarán en el contrato de compraventa.
            </p>

            <p>
              3.3 La garantía no cubre desperfectos causados por mal uso, negligencia, accidentes o modificaciones no
              autorizadas del vehículo.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Servicios de Mantenimiento</h2>

            <p>
              4.1 {COMPANY_DATA.name} ofrece servicios de mantenimiento y reparación para vehículos de todas las marcas.
            </p>

            <p>4.2 Todos los servicios deben ser agendados previamente y están sujetos a disponibilidad.</p>

            <p>
              4.3 Los precios de los servicios son referenciales y el costo final puede variar según el diagnóstico
              detallado del vehículo.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Política de Devoluciones</h2>

            <p>
              5.1 Una vez completada la compra de un vehículo y realizada la transferencia a nombre del comprador, no se
              aceptarán devoluciones.
            </p>

            <p>
              5.2 En caso de detectarse fallas no declaradas previamente en un vehículo recién adquirido, el cliente
              deberá contactar inmediatamente a {COMPANY_DATA.name} para evaluar la situación.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitación de Responsabilidad</h2>

            <p>
              6.1 {COMPANY_DATA.name} no será responsable por daños indirectos, incidentales, especiales o consecuentes
              derivados de la compra o uso de nuestros vehículos o servicios.
            </p>

            <p>
              6.2 La responsabilidad total de {COMPANY_DATA.name} en ningún caso excederá el monto pagado por el cliente
              por el vehículo o servicio en cuestión.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Modificaciones a estos Términos</h2>

            <p>
              {COMPANY_DATA.name} se reserva el derecho de modificar estos términos y condiciones en cualquier momento.
              Las modificaciones entrarán en vigor inmediatamente después de su publicación en nuestro sitio web. El uso
              continuado de nuestros servicios después de dichas modificaciones constituirá tu aceptación de los nuevos
              términos.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Contacto</h2>

            <p>Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos a través de:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Email: {COMPANY_DATA.email}</li>
              <li>Teléfono: {COMPANY_DATA.phone}</li>
              <li>Dirección: {COMPANY_DATA.address}</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="btn-primary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
