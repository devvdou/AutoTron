"use client";

import FinancingForm from '@/components/financing-form';
import { COMPANY_DATA } from "@/lib/constants";
import Head from 'next/head';

export default function FinanciacionPage() {
  const pageTitle = `Simula tu Financiamiento - ${COMPANY_DATA.name}`;
  const pageDescription = "Calcula y simula tu financiamiento para adquirir el vehículo de tus sueños con AutoTron. Completa nuestro formulario y obtén una pre-aprobación.";
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `${COMPANY_DATA.url}/financiacion`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${COMPANY_DATA.url}/og-image-financiacion.jpg`} /> {/* Asegúrate de tener una imagen para OG */} 
        <link rel="canonical" href={pageUrl} />
      </Head>
      <div className="pt-24 pb-16 bg-gradient-to-br from-primary to-primary-dark text-white min-h-screen">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold neon-text mb-4">
              Financia Tu Próximo Vehículo
            </h1>
            <p className="text-lg text-gray-300">
              En {COMPANY_DATA.name}, te ayudamos a conseguir el financiamiento que necesitas de forma rápida y sencilla. Simula tu crédito y da el primer paso hacia tu nuevo auto.
            </p>
          </div>
          <FinancingForm />
        </div>
      </div>
    </>
  );
}