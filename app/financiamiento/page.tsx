"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './financiamiento.module.css'; // Usaremos CSS Modules

// Interfaz para los datos del formulario
interface FinanciamientoFormData {
  vehiculoInteres: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rut: string;
  correoElectronico: string;
  telefono: string;
  sueldoLiquido: string;
  situacionLaboral: 'Dependiente' | 'Independiente' | '';
  ofreceVehiculoPartePago: 'Sí' | 'No' | '';
  marcaVehiculoOfrecido?: string;
  modeloVehiculoOfrecido?: string;
  anoVehiculoOfrecido?: string;
  kilometrajeVehiculoOfrecido?: string;
  condicionVehiculoOfrecido?: string;
  precioEstimadoOfrecido?: string;
  comentariosAdicionales?: string;
}

const FinanciamientoPage = () => {
  const [formData, setFormData] = useState<FinanciamientoFormData>({
    vehiculoInteres: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    rut: '',
    correoElectronico: '',
    telefono: '',
    sueldoLiquido: '',
    situacionLaboral: '',
    ofreceVehiculoPartePago: '',
    marcaVehiculoOfrecido: '',
    modeloVehiculoOfrecido: '',
    anoVehiculoOfrecido: '',
    kilometrajeVehiculoOfrecido: '',
    condicionVehiculoOfrecido: '',
    precioEstimadoOfrecido: '',
    comentariosAdicionales: '',
  });

  const [errores, setErrores] = useState<Partial<Record<keyof FinanciamientoFormData, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al modificarlo
    if (errores[name as keyof FinanciamientoFormData]) {
      setErrores(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Si se selecciona "No" para vehículo parte de pago, limpiar campos relacionados
      ...(name === 'ofreceVehiculoPartePago' && value === 'No' && {
        marcaVehiculoOfrecido: '',
        modeloVehiculoOfrecido: '',
        anoVehiculoOfrecido: '',
        kilometrajeVehiculoOfrecido: '',
        condicionVehiculoOfrecido: '',
        precioEstimadoOfrecido: '',
      })
    }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<Record<keyof FinanciamientoFormData, string>> = {};
    if (!formData.vehiculoInteres.trim()) nuevosErrores.vehiculoInteres = 'El vehículo de interés es requerido.';
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido.';
    if (!formData.apellidoPaterno.trim()) nuevosErrores.apellidoPaterno = 'El apellido paterno es requerido.';
    if (!formData.apellidoMaterno.trim()) nuevosErrores.apellidoMaterno = 'El apellido materno es requerido.';
    if (!formData.rut.trim()) {
      nuevosErrores.rut = 'El RUT es requerido.';
    } else if (!/^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/.test(formData.rut)) {
      nuevosErrores.rut = 'Formato de RUT inválido (Ej: XX.XXX.XXX-X).';
    }
    if (!formData.correoElectronico.trim()) {
      nuevosErrores.correoElectronico = 'El correo electrónico es requerido.';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = 'Formato de correo electrónico inválido.';
    }
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido.';
    } else if (!/^9\d{8}$/.test(formData.telefono)) {
      nuevosErrores.telefono = 'Formato de teléfono inválido (Ej: 9XXXXXXXX).';
    }
    if (!formData.sueldoLiquido.trim()) nuevosErrores.sueldoLiquido = 'El sueldo líquido es requerido.';
    if (!formData.situacionLaboral) nuevosErrores.situacionLaboral = 'La situación laboral es requerida.';
    if (!formData.ofreceVehiculoPartePago) nuevosErrores.ofreceVehiculoPartePago = 'Debe seleccionar si ofrece un vehículo como parte de pago.';

    if (formData.ofreceVehiculoPartePago === 'Sí') {
      if (!formData.marcaVehiculoOfrecido?.trim()) nuevosErrores.marcaVehiculoOfrecido = 'La marca del vehículo ofrecido es requerida.';
      if (!formData.modeloVehiculoOfrecido?.trim()) nuevosErrores.modeloVehiculoOfrecido = 'El modelo del vehículo ofrecido es requerido.';
      if (!formData.anoVehiculoOfrecido?.trim()) nuevosErrores.anoVehiculoOfrecido = 'El año del vehículo ofrecido es requerido.';
      if (!formData.kilometrajeVehiculoOfrecido?.trim()) nuevosErrores.kilometrajeVehiculoOfrecido = 'El kilometraje del vehículo ofrecido es requerido.';
      if (!formData.condicionVehiculoOfrecido?.trim()) nuevosErrores.condicionVehiculoOfrecido = 'La condición del vehículo ofrecido es requerida.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validarFormulario()) {
      // Aquí se integraría la lógica para enviar los datos al backend (Vibecoding)
      // Por ejemplo, usando fetch o axios para hacer una petición POST
      console.log('Datos del formulario a enviar:', formData);
      alert('Formulario enviado (simulación). Revisa la consola para ver los datos.');
      // Lógica para enviar notificación al cliente de la automotora
      // Lógica para validación adicional en el servidor (opcional)
    }
  };

  return (
    <div className={`${styles.pageContainer} pt-24 pb-16`}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Solicitud de Financiamiento</h1>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Sección Vehículo de Interés */}
          <div className={styles.formGroup}>
            <label htmlFor="vehiculoInteresInput" className={styles.label}>Vehículo de Interés (o link)</label>
            {/* Opción 1: Campo de texto */}
            <input
              type="text"
              id="vehiculoInteresInput"
              name="vehiculoInteres"
              value={formData.vehiculoInteres}
              onChange={handleChange}
              className={`${styles.input} ${errores.vehiculoInteres ? styles.inputError : ''}`}
              placeholder="Ej: Toyota Yaris 2023 o https://link.vehiculo.com"
            />
            {/* Opción 2: Menú desplegable (comentado, para llenar dinámicamente) */}
            {/* 
            <select 
              id="vehiculoInteresSelect" 
              name="vehiculoInteres" 
              value={formData.vehiculoInteres} 
              onChange={handleChange} 
              className={`${styles.select} ${errores.vehiculoInteres ? styles.inputError : ''}`}
            >
              <option value="">Seleccione un vehículo</option>
              {/* Los options se llenarán dinámicamente desde la base de datos */}
            {/* 
              <option value="vehiculo1">Vehículo 1 (Ejemplo)</option>
              <option value="vehiculo2">Vehículo 2 (Ejemplo)</option>
            </select> 
            */}
            {errores.vehiculoInteres && <p className={styles.errorText}>{errores.vehiculoInteres}</p>}
          </div>

          {/* Sección Datos Personales */}
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre" className={styles.label}>Nombre</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`} required />
              {errores.nombre && <p className={styles.errorText}>{errores.nombre}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="apellidoPaterno" className={styles.label}>Apellido Paterno</label>
              <input type="text" id="apellidoPaterno" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} className={`${styles.input} ${errores.apellidoPaterno ? styles.inputError : ''}`} required />
              {errores.apellidoPaterno && <p className={styles.errorText}>{errores.apellidoPaterno}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="apellidoMaterno" className={styles.label}>Apellido Materno</label>
              <input type="text" id="apellidoMaterno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} className={`${styles.input} ${errores.apellidoMaterno ? styles.inputError : ''}`} required />
              {errores.apellidoMaterno && <p className={styles.errorText}>{errores.apellidoMaterno}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="rut" className={styles.label}>RUT</label>
              <input type="text" id="rut" name="rut" value={formData.rut} onChange={handleChange} className={`${styles.input} ${errores.rut ? styles.inputError : ''}`} placeholder="XX.XXX.XXX-X" required />
              {errores.rut && <p className={styles.errorText}>{errores.rut}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="correoElectronico" className={styles.label}>Correo Electrónico</label>
              <input type="email" id="correoElectronico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} className={`${styles.input} ${errores.correoElectronico ? styles.inputError : ''}`} required />
              {errores.correoElectronico && <p className={styles.errorText}>{errores.correoElectronico}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefono" className={styles.label}>Teléfono (sin +56)</label>
              <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className={`${styles.input} ${errores.telefono ? styles.inputError : ''}`} placeholder="9XXXXXXXX" required />
              {errores.telefono && <p className={styles.errorText}>{errores.telefono}</p>}
            </div>
          </div>

          {/* Sección Información Financiera */}
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label htmlFor="sueldoLiquido" className={styles.label}>Sueldo Líquido (CLP)</label>
              <input type="number" id="sueldoLiquido" name="sueldoLiquido" value={formData.sueldoLiquido} onChange={handleChange} className={`${styles.input} ${errores.sueldoLiquido ? styles.inputError : ''}`} placeholder="500000" required />
              {errores.sueldoLiquido && <p className={styles.errorText}>{errores.sueldoLiquido}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="situacionLaboral" className={styles.label}>Situación Laboral</label>
              <select id="situacionLaboral" name="situacionLaboral" value={formData.situacionLaboral} onChange={handleChange} className={`${styles.select} ${errores.situacionLaboral ? styles.inputError : ''}`} required>
                <option value="">Seleccione...</option>
                <option value="Dependiente">Dependiente</option>
                <option value="Independiente">Independiente</option>
              </select>
              {errores.situacionLaboral && <p className={styles.errorText}>{errores.situacionLaboral}</p>}
            </div>
          </div>

          {/* Sección Vehículo como Parte de Pago */}
          <div className={styles.formGroup}>
            <label className={styles.label}>¿Ofrece un vehículo como parte de pago?</label>
            <div className={styles.radioGroup}>
              <label htmlFor="partePagoSi" className={styles.radioLabel}>
                <input type="radio" id="partePagoSi" name="ofreceVehiculoPartePago" value="Sí" checked={formData.ofreceVehiculoPartePago === 'Sí'} onChange={handleRadioChange} className={styles.radioInput} /> Sí
              </label>
              <label htmlFor="partePagoNo" className={styles.radioLabel}>
                <input type="radio" id="partePagoNo" name="ofreceVehiculoPartePago" value="No" checked={formData.ofreceVehiculoPartePago === 'No'} onChange={handleRadioChange} className={styles.radioInput} /> No
              </label>
            </div>
            {errores.ofreceVehiculoPartePago && <p className={styles.errorText}>{errores.ofreceVehiculoPartePago}</p>}
          </div>

          {formData.ofreceVehiculoPartePago === 'Sí' && (
            <div className={styles.partePagoSection}>
              <h2 className={styles.subtitle}>Datos del Vehículo Ofrecido</h2>
              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label htmlFor="marcaVehiculoOfrecido" className={styles.label}>Marca</label>
                  <input type="text" id="marcaVehiculoOfrecido" name="marcaVehiculoOfrecido" value={formData.marcaVehiculoOfrecido} onChange={handleChange} className={`${styles.input} ${errores.marcaVehiculoOfrecido ? styles.inputError : ''}`} />
                  {errores.marcaVehiculoOfrecido && <p className={styles.errorText}>{errores.marcaVehiculoOfrecido}</p>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="modeloVehiculoOfrecido" className={styles.label}>Modelo</label>
                  <input type="text" id="modeloVehiculoOfrecido" name="modeloVehiculoOfrecido" value={formData.modeloVehiculoOfrecido} onChange={handleChange} className={`${styles.input} ${errores.modeloVehiculoOfrecido ? styles.inputError : ''}`} />
                  {errores.modeloVehiculoOfrecido && <p className={styles.errorText}>{errores.modeloVehiculoOfrecido}</p>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="anoVehiculoOfrecido" className={styles.label}>Año</label>
                  <input type="number" id="anoVehiculoOfrecido" name="anoVehiculoOfrecido" value={formData.anoVehiculoOfrecido} onChange={handleChange} className={`${styles.input} ${errores.anoVehiculoOfrecido ? styles.inputError : ''}`} />
                  {errores.anoVehiculoOfrecido && <p className={styles.errorText}>{errores.anoVehiculoOfrecido}</p>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="kilometrajeVehiculoOfrecido" className={styles.label}>Kilometraje</label>
                  <input type="number" id="kilometrajeVehiculoOfrecido" name="kilometrajeVehiculoOfrecido" value={formData.kilometrajeVehiculoOfrecido} onChange={handleChange} className={`${styles.input} ${errores.kilometrajeVehiculoOfrecido ? styles.inputError : ''}`} />
                  {errores.kilometrajeVehiculoOfrecido && <p className={styles.errorText}>{errores.kilometrajeVehiculoOfrecido}</p>}
                </div>
                <div className={styles.formGroupFullSpan}>
                  <label htmlFor="condicionVehiculoOfrecido" className={styles.label}>Condición</label>
                  <input type="text" id="condicionVehiculoOfrecido" name="condicionVehiculoOfrecido" value={formData.condicionVehiculoOfrecido} onChange={handleChange} className={`${styles.input} ${errores.condicionVehiculoOfrecido ? styles.inputError : ''}`} placeholder="Ej: Buen estado, detalles menores" />
                  {errores.condicionVehiculoOfrecido && <p className={styles.errorText}>{errores.condicionVehiculoOfrecido}</p>}
                </div>
                <div className={styles.formGroupFullSpan}>
                  <label htmlFor="precioEstimadoOfrecido" className={styles.label}>Precio Estimado Ofrecido (CLP) (Opcional)</label>
                  <input type="number" id="precioEstimadoOfrecido" name="precioEstimadoOfrecido" value={formData.precioEstimadoOfrecido} onChange={handleChange} className={styles.input} />
                </div>
              </div>
            </div>
          )}

          {/* Sección Comentarios Adicionales */}
          <div className={styles.formGroup}>
            <label htmlFor="comentariosAdicionales" className={styles.label}>Comentarios Adicionales (Opcional)</label>
            <textarea id="comentariosAdicionales" name="comentariosAdicionales" value={formData.comentariosAdicionales} onChange={handleChange} className={styles.textarea} rows={4}></textarea>
          </div>

          {/* Sección reCAPTCHA */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Protección reCAPTCHA</label>
            {/* Integrar aquí el widget de reCAPTCHA. Se necesitará una clave del sitio de Google reCAPTCHA. */}
            <div className={styles.recaptchaPlaceholder}>Espacio para reCAPTCHA</div>
            {/* Ejemplo de cómo podría ser con la API de Google:
            <div className="g-recaptcha" data-sitekey="TU_CLAVE_DE_SITIO_RECAPTCHA"></div> 
            No olvides incluir el script de la API de reCAPTCHA en tu página o layout principal:
            <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            */}
          </div>

          {/* Botón de Enviar */}
          <button type="submit" className={styles.submitButton}>Enviar Solicitud</button>
        </form>
        {/* Comentario: El formulario se enviará mediante un método POST. 
            La lógica de envío de datos a la base de datos, envío de notificaciones 
            y validaciones adicionales del servidor se deben implementar con Vibecoding (backend). */}
      </div>
    </div>
  );
};

export default FinanciamientoPage;
