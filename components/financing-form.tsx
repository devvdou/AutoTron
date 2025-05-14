"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { FinanceCalculator } from '@/components/ui/finance-calculator';

export default function FinancingForm() {
  const [formData, setFormData] = useState({
    rut: '',
    email: '',
    phone: '',
    netIncome: '',
    employmentStatus: '',
    vehiclePrice: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formErrors, setFormErrors] = useState<any>({});

  // Validación básica
  const validate = () => {
    const errors: any = {};
    if (!formData.rut.match(/^\d{7,8}-[\dkK]$/)) {
      errors.rut = 'RUT inválido. Formato: 12345678-9';
    }
    if (!formData.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      errors.email = 'Correo electrónico inválido';
    }
    if (!formData.phone.match(/^\d{8,9}$/)) {
      errors.phone = 'Teléfono inválido. Ej: 912345678';
    }
    if (!formData.netIncome || Number(formData.netIncome) < 200000) {
      errors.netIncome = 'Sueldo debe ser mayor a $200.000';
    }
    if (!formData.employmentStatus) {
      errors.employmentStatus = 'Selecciona tu situación laboral';
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage('');
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSubmitting(true);
    // Aquí iría la lógica para enviar los datos al backend
    try {
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitMessage('Solicitud enviada con éxito. Nos pondremos en contacto contigo pronto.');
      // Reset form (opcional)
      setFormData({ rut: '', email: '', phone: '', netIncome: '', employmentStatus: '', vehiclePrice: '' });
      setFormErrors({});
    } catch (err) {
      setSubmitMessage('Ocurrió un error al enviar la solicitud. Intenta nuevamente.');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto card-neon">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-bold neon-text">Simula tu Financiamiento</CardTitle>
        <CardDescription className="text-text-secondary">
          Completa el formulario para que podamos evaluar tu solicitud de financiamiento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="rut" className="text-text-secondary">RUT</Label>
            <Input
              id="rut"
              name="rut"
              type="text"
              placeholder="Ej: 12345678-9"
              value={formData.rut}
              onChange={handleChange}
              required
              className="input-neon mt-1"
            />
            {formErrors.rut && <p className="text-red-400 text-xs mt-1">{formErrors.rut}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="text-text-secondary">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-neon mt-1"
            />
            {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone" className="text-text-secondary">Teléfono (sin +56)</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">+56</span>
              </div>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="912345678"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-neon pl-12"
              />
            </div>
            {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="netIncome" className="text-text-secondary">Sueldo Líquido (CLP)</Label>
            <Input
              id="netIncome"
              name="netIncome"
              type="number"
              placeholder="Ej: 750000"
              value={formData.netIncome}
              onChange={handleChange}
              required
              className="input-neon mt-1"
            />
            {formErrors.netIncome && <p className="text-red-400 text-xs mt-1">{formErrors.netIncome}</p>}
          </div>
          <div>
            <Label htmlFor="employmentStatus" className="text-text-secondary">Situación Laboral</Label>
            <Select
              name="employmentStatus"
              value={formData.employmentStatus}
              onValueChange={(value) => handleSelectChange('employmentStatus', value)}
              required
            >
              <SelectTrigger id="employmentStatus" className="input-neon mt-1">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent className="bg-primary-light border-accent-neon/30 text-white">
                <SelectItem value="dependiente" className="hover:bg-accent-neon/20 focus:bg-accent-neon/30">Dependiente</SelectItem>
                <SelectItem value="independiente" className="hover:bg-accent-neon/20 focus:bg-accent-neon/30">Independiente</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.employmentStatus && <p className="text-red-400 text-xs mt-1">{formErrors.employmentStatus}</p>}
          </div>
          <div>
            <Label htmlFor="vehiclePrice" className="text-text-secondary">Precio Referencial del Vehículo (CLP)</Label>
            <Input
              id="vehiclePrice"
              name="vehiclePrice"
              type="number"
              placeholder="Ej: 10000000"
              value={formData.vehiclePrice}
              onChange={handleChange}
              className="input-neon mt-1"
            />
          </div>
          <Button type="submit" className="btn-primary w-full group" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Solicitud'
            )}
            <span className="absolute inset-0 bg-gradient-to-r from-accent-neon/30 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none animate-pulse" />
          </Button>
        </form>
        {/* Simulador financiero dinámico */}
        {formData.vehiclePrice && Number(formData.vehiclePrice) > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-accent-neon">Simulación de Cuotas</h3>
            <FinanceCalculator vehiclePrice={Number(formData.vehiclePrice)} />
          </div>
        )}
        {submitMessage && (
          <p className={`mt-4 text-center ${submitMessage.includes('éxito') ? 'text-green-400' : 'text-red-400'}`}>
            {submitMessage}
          </p>
        )}
      </CardContent>
      <CardFooter className="text-center text-xs text-text-secondary">
        <p>Al enviar este formulario, aceptas nuestros términos y condiciones y política de privacidad. Un ejecutivo te contactará para continuar con el proceso.</p>
      </CardFooter>
    </Card>
  );
}