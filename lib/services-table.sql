-- Tabla de servicios para administración desde el panel
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    price NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplo de inserción de servicios iniciales
INSERT INTO services (name, description, image_url, price) VALUES
('Mantenimiento Básico', 'Incluye cambio de aceite, revisión de frenos y chequeo general.', 'https://ejemplo.com/servicio1.jpg', 49900),
('Diagnóstico Computarizado', 'Revisión electrónica completa del vehículo.', 'https://ejemplo.com/servicio2.jpg', 29900),
('Lavado Premium', 'Lavado exterior e interior con productos de alta calidad.', 'https://ejemplo.com/servicio3.jpg', 15900)
ON CONFLICT DO NOTHING;