-- 02-seed-haciendas.sql
-- Datos iniciales para haciendas: 10 registros (7 Activo, 3 Inactivo).
-- Idempotente mediante ON DUPLICATE KEY UPDATE sobre UNIQUE(nombre).
-- Consumido por scripts/seed-database.js. Solo valores estáticos, sin entrada de usuario.

INSERT INTO `haciendas` (`nombre`, `ubicacion`, `estatus`) VALUES
  ('Hacienda El Carmen', 'Tacuba, Ahuachapan', 'Activo'),
  ('Hacienda San Jose', 'Quezaltepeque, La Libertad', 'Activo'),
  ('Hacienda La Esperanza', 'San Sebastian, San Vicente', 'Activo'),
  ('Hacienda El Transito', 'San Miguel, San Miguel', 'Activo'),
  ('Hacienda La Cabana', 'Cojutepeque, Cuscatlan', 'Activo'),
  ('Hacienda San Andres', 'Ciudad Arce, La Libertad', 'Activo'),
  ('Hacienda El Naranjo', 'Jujutla, Ahuachapan', 'Activo'),
  ('Hacienda La Montana', 'Chalatenango, Chalatenango', 'Inactivo'),
  ('Hacienda San Rafael', 'Sonsonate, Sonsonate', 'Inactivo'),
  ('Hacienda El Jocote', 'Zacatecoluca, La Paz', 'Inactivo')
ON DUPLICATE KEY UPDATE
  `ubicacion` = VALUES(`ubicacion`),
  `estatus` = VALUES(`estatus`);
