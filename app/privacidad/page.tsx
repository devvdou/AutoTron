import type { Metadata } from "next"
import Link from "next/link"
import { COMPANY_DATA } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Política de Privacidad | Autotron",
  description: "Conoce nuestra política de privacidad y cómo protegemos tus datos personales.",
  robots: "noindex, follow",
}

export default function PrivacidadPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8 text-3xl md:text-4xl font-bold">Política de Privacidad</h1>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>Última actualización: 1 de Enero de 2023</p>

            <p>
              En {COMPANY_DATA.name}, accesible desde {COMPANY_DATA.website}, una de nuestras principales prioridades es
              la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene los tipos de
              información que {COMPANY_DATA.name} recopila y registra y cómo la utilizamos.
            </p>

            <p>
              Si tienes preguntas adicionales o requieres más información sobre nuestra Política de Privacidad, no dudes
              en contactarnos a través de correo electrónico a {COMPANY_DATA.email}.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Información que recopilamos</h2>

            <p>
              La información personal que te solicitamos será utilizada solo para los fines indicados en este documento.
            </p>

            <p>Podemos recopilar la siguiente información:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Nombre y apellido</li>
              <li>Información de contacto incluyendo dirección de correo electrónico y número telefónico</li>
              <li>Información demográfica como código postal, preferencias e intereses</li>
              <li>Otra información relevante para encuestas de clientes y/o ofertas</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Cómo utilizamos la información recopilada</h2>

            <p>
              Recopilamos esta información para comprender tus necesidades y proporcionarte un mejor servicio, y en
              particular por las siguientes razones:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Registro interno</li>
              <li>Mejora de nuestros productos y servicios</li>
              <li>
                Envío de correos promocionales sobre nuevos productos, ofertas especiales u otra información que creemos
                que te puede interesar
              </li>
              <li>Para contactarte con fines de investigación de mercado</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Seguridad</h2>

            <p>
              Estamos comprometidos a garantizar que tu información esté segura. Para evitar el acceso o divulgación no
              autorizados, hemos implementado procedimientos físicos, electrónicos y administrativos adecuados para
              salvaguardar y asegurar la información que recopilamos en línea.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Enlaces a otros sitios web</h2>

            <p>
              Nuestro sitio web puede contener enlaces a otros sitios web de interés. Sin embargo, una vez que hayas
              utilizado estos enlaces para salir de nuestro sitio, debes tener en cuenta que no tenemos ningún control
              sobre ese otro sitio web. Por lo tanto, no podemos ser responsables de la protección y privacidad de
              cualquier información que proporciones al visitar dichos sitios, y dichos sitios no se rigen por esta
              declaración de privacidad.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Control de tu información personal</h2>

            <p>Puedes restringir la recopilación o el uso de tu información personal de las siguientes maneras:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Cuando te soliciten completar un formulario en el sitio web, busca la casilla que puedes marcar para
                indicar que no deseas que la información sea utilizada por alguien con fines de marketing directo
              </li>
              <li>
                Si previamente has aceptado que usemos tu información personal con fines de marketing directo, puedes
                cambiar de opinión en cualquier momento poniéndote en contacto con nosotros por correo electrónico a{" "}
                {COMPANY_DATA.email}
              </li>
            </ul>

            <p>
              No venderemos, distribuiremos ni arrendaremos tu información personal a terceros a menos que tengamos tu
              permiso o estemos obligados por ley a hacerlo.
            </p>

            <p>
              Si crees que cualquier información que tenemos sobre ti es incorrecta o incompleta, escríbenos o envíanos
              un correo electrónico lo antes posible. Corregiremos cualquier información que se determine como
              incorrecta.
            </p>
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
