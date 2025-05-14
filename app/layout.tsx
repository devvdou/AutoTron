import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Script from "next/script"
import AnimatedBackground from "@/components/animated-background"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Autotron | Automotora de Vehículos en Valdivia",
  description:
    "Encuentra tu vehículo ideal entre nuestra selección premium de autos semi-nuevos y usados en Valdivia. Servicio personalizado y financiamiento a tu medida.",
  keywords: "automotora, Valdivia, vehículos, autos usados, autos nuevos, comprar auto, financiamiento autos",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.autotron.cl",
    siteName: "Autotron",
    title: "Autotron | Automotora Premium en Valdivia",
    description: "La mejor selección de vehículos nuevos y usados en Valdivia. Financiamiento a tu medida.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Autotron Concepción",
      },
    ],
  },
    generator: 'v0.dev'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://www.autotron.cl" />
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} font-sans text-white`}>
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "Autotron",
              "legalName": "AUTOTRON SPA",
              "url": "https://www.autotron.cl",
              "logo": "https://www.autotron.cl/logo.png",
              "image": "https://www.autotron.cl/storefront.jpg",
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
                "latitude": "-39.8154",
                "longitude": "-73.2220"
              },
              "telephone": "+56 9 9689 0273",
              "email": "contacto@autotron.cl",
              "foundingDate": "2015-03-03",
              "founders": {
                "@type": "Person",
                "name": "Fundador Autotron"
              },
              "sameAs": [
                "https://facebook.com/autotron",
                "https://instagram.com/autotron.cl",
                "https://twitter.com/autotron"
              ],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "19:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "10:00",
                  "closes": "14:00"
                }
              ],
              "priceRange": "$$"
            }
          `}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {/* Global animated background */}
          <AnimatedBackground
            type="cyber"
            intensity="medium"
            primaryColor="#FF0040"
            secondaryColor="#00FFBB"
            accentColor="#4D00FF"
            interactive={true}
          />

          <div className="flex min-h-screen flex-col relative z-10">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
