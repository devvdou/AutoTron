import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { COMPANY_DATA, BUSINESS_HOURS } from "@/lib/constants"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-light/50 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Logo e info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-heading font-bold neon-text">
                {COMPANY_DATA.name}
                <span className="text-accent-neon">TRON</span>
              </span>
            </Link>
            <p className="text-text-secondary">
              Tu concesionario de confianza con más de {currentYear - 2015} años de experiencia en el mercado
              automotriz.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href={COMPANY_DATA.socialMedia.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5 text-white hover:text-accent-neon transition-colors" />
              </Link>
              <Link
                href={COMPANY_DATA.socialMedia.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 text-white hover:text-accent-neon transition-colors" />
              </Link>
              <Link
                href={COMPANY_DATA.socialMedia.twitter}
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5 text-white hover:text-accent-neon transition-colors" />
              </Link>
              <Link href="#" aria-label="Youtube" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-5 h-5 text-white hover:text-accent-neon transition-colors" />
              </Link>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/vehiculos" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Vehículos
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/test-drive" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Test Drive
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h4 className="text-lg font-bold mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios#venta" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Venta de Vehículos
                </Link>
              </li>
              <li>
                <Link href="/servicios#lavado" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Servicio de Lavado
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios#alquiler"
                  className="text-text-secondary hover:text-accent-neon transition-colors"
                >
                  Alquiler de Vehículos
                </Link>
              </li>
              <li>
                <Link href="/financiamiento" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Financiamiento
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-text-secondary hover:text-accent-neon transition-colors">
                  Consultas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <address className="not-italic">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-accent-neon mr-2 mt-0.5" />
                  <a href={`mailto:${COMPANY_DATA.email}`} className="text-text-secondary hover:text-accent-neon">
                    {COMPANY_DATA.email}
                  </a>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-accent-neon mr-2 mt-0.5" />
                  <a
                    href={`tel:${COMPANY_DATA.phone.replace(/\s/g, "")}`}
                    className="text-text-secondary hover:text-accent-neon"
                  >
                    {COMPANY_DATA.phone}
                  </a>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-accent-neon mr-2 mt-0.5" />
                  <span className="text-text-secondary">{COMPANY_DATA.address}</span>
                </li>
                <li className="flex items-start mt-4">
                  <span className="text-text-secondary">{BUSINESS_HOURS.weekdays}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-text-secondary">{BUSINESS_HOURS.saturday}</span>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm mb-4 md:mb-0">
              © {currentYear} {COMPANY_DATA.name}. RUT: {COMPANY_DATA.rut}. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4">
              <Link href="/terminos" className="text-text-secondary hover:text-accent-neon text-sm transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/privacidad" className="text-text-secondary hover:text-accent-neon text-sm transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
