-- Esquema inicial (v1). MySQL 8.4 / InnoDB / utf8mb4.
-- Consumido por scripts/create-database.js, que se asegura de que la base de datos exista
-- (CREATE DATABASE con DB_NAME validado) y luego aplica la DDL de esta tabla.
-- Tabla: haciendas (id_hacienda PK, nombre UNIQUE, ubicacion, estatus ENUM).

CREATE TABLE IF NOT EXISTS `haciendas` (
  `id_hacienda` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL UNIQUE,
  `ubicacion` VARCHAR(255) NOT NULL,
  `estatus` ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_haciendas_estatus` (`estatus`),
  INDEX `idx_haciendas_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
