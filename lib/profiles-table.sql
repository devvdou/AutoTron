-- SQL para crear la tabla 'profiles' en Supabase
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insertar un perfil de ejemplo para el admin
insert into public.profiles (id, name, email, phone)
values ('a90f8da3-c320-479d-a107-1586c3189f9f', 'Administrador', 'admin@autotron.com', '+56999999999')
on conflict (id) do nothing;

-- Insertar 3 servicios de ejemplo
insert into public.services (title, description, icon, link) values
('Venta de Vehículos', 'Amplia selección de vehículos nuevos y usados de las mejores marcas del mercado con garantía y financiamiento personalizado.', 'Car', '/servicios#venta'),
('Servicio de Lavado', 'Servicio profesional de lavado y detallado para mantener tu vehículo impecable, utilizando productos de alta calidad.', 'Droplets', '/servicios#lavado'),
('Alquiler de Vehículos', 'Opciones de alquiler a corto y largo plazo sin chofer, con tarifas competitivas y una flota moderna para todas tus necesidades.', 'Key', '/servicios#alquiler')
on conflict do nothing;

-- Insertar 3 vehículos de ejemplo
insert into public.vehicles (brand, model, year, price, type, transmission, fuel, image, mileage, engine, power, acceleration, topSpeed, features) values
('Subaru', 'New WRX', 2017, 20400000, 'Usado', 'Automática', 'Gasolina', '/placeholder.svg?height=600&width=800', 45000, '2.0L Turbo', '268 HP', '5.5s (0-100 km/h)', '240 km/h', '{"Tracción AWD","Asientos deportivos","Pantalla táctil","Cámara de retroceso"}'),
('Nissan', 'Sentra', 2018, 8500000, 'Usado', 'Automática', 'Gasolina', '/placeholder.svg?height=600&width=800', 62000, '1.8L 4-Cilindros', '130 HP', '9.8s (0-100 km/h)', '190 km/h', '{"Bluetooth","Aire acondicionado","Airbags","Control de crucero"}'),
('Mitsubishi', 'L200', 2020, 18500000, 'Usado', 'Manual', 'Diesel', '/placeholder.svg?height=600&width=800', 38000, '2.4L Diesel', '178 HP', '10.4s (0-100 km/h)', '180 km/h', '{"4x4","Doble cabina","Climatizador","Control de descenso"}')
on conflict do nothing;