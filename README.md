# App Agrícola — Backend (`app-agricola-back`)

API REST (Node.js + Express) para gestionar las **haciendas** de CASSA Agrícola, con **MySQL 8.4** + Sequelize 6. Un solo recurso con CRUD completo, baja lógica y contador para el dashboard.

## Stack

- **Runtime:** Node.js 22 LTS (ESM, `"type": "module"`), **pnpm**
- **Framework:** Express 5
- **Base de datos:** MySQL 8.4 (driver `mysql2`) + Sequelize 6 (`underscored: true`, `utf8mb4`)
- **Docs:** Swagger UI (OpenAPI 3.0) en `/api/v1/docs`
- **Logs:** Winston + daily-rotate-file (`logs/`), Morgan → `logger.info`
- **Seguridad:** Helmet, whitelist de CORS, rate-limit, sanitizado XSS, límite de `10kb` en el cuerpo

## Requisitos

- Node.js >= 20 (se recomienda 22 LTS)
- pnpm >= 10 (`corepack enable` si es necesario)
- MySQL 8.4 alcanzable (`DB_HOST` / `DB_PORT`)

## Inicio rápido

```bash
# 1) Instalar
pnpm install

# 2) Configurar entorno
cp .env.example .env
# Llenar DB_USER, DB_PASSWORD, DB_HOST, DB_NAME=cassa_agricola ...

# 3) Crear base de datos + tabla
pnpm run db:create

# 4) 10 datos iniciales de haciendas (El Salvador, idempotente — seguro re-ejecutar)
pnpm run db:seed

# 5) Ejecutar
pnpm run dev     # nodemon, desarrollo
pnpm start       # producción
```

Base de la API: `http://localhost:3000` · Swagger: `http://localhost:3000/api/v1/docs` · Salud: `GET /health`

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm run dev` | Inicia con nodemon (`src/server.js`) |
| `pnpm start` | Inicia en producción (`node src/server.js`) |
| `pnpm run db:create` | Crea la BD `cassa_agricola` + aplica `database/01-create-database.sql` |
| `pnpm run db:seed` | Aplica `database/02-seed-haciendas.sql` (idempotente) |
| `pnpm run lint` / `lint:fix` | Revisión / corrección con ESLint |
| `pnpm run format` / `format:check` | Escritura / revisión con Prettier (`src/**/*.js`) |

## Entorno (.env)

Ver `.env.example` para la lista completa. `src/config/environment.js` es el **único** lugar que lee `process.env` y lanza error al arrancar si falta una variable requerida.

| Var | Por defecto | Descripción |
|---|---|---|
| `NODE_ENV` / `PORT` | `development` / `3000` | Ejecución |
| `ALLOWED_ORIGINS` | — (requerida) | Whitelist de CORS separada por comas, ej. `http://localhost:3000,http://localhost:5173` (incluye `http://127.0.0.1:3000` si abres los docs vía `127.0.0.1`) |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | puerto `3306` | Conexión MySQL (`DB_NAME=cassa_agricola`) |
| `DB_URI` / `DB_DIALECT` | — (requeridas) | Se conservan por compatibilidad (`mysql`) |

## Base de datos

Fuente de verdad: `database/*.sql` (consumidos por `scripts/*.js`).

**Tabla `haciendas`** (`InnoDB`, `utf8mb4_unicode_ci`):

| Columna | Tipo | Notas |
|---|---|---|
| `id_hacienda` | `INT UNSIGNED AUTO_INCREMENT PK` | |
| `nombre` | `VARCHAR(150) UNIQUE NOT NULL` | Duplicado → `409` |
| `ubicacion` | `VARCHAR(255) NOT NULL` | Texto libre, ej. `Tacuba, Ahuachapan` |
| `estatus` | `ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo'` | |
| `created_at` / `updated_at` | `TIMESTAMP` | Se gestionan automáticamente |

Seed: 10 haciendas de El Salvador (7 `Activo`, 3 `Inactivo`), `INSERT ... ON DUPLICATE KEY UPDATE` sobre `UNIQUE(nombre)`.

## Endpoints

Todas las respuestas siguen `{ status, message, data }` (+ `pagination` en listas). Mensajes en español, logs en inglés.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/haciendas?limit=10&offset=0&estatus=Activo` | Lista paginada (`limit` 1-100, `estatus` opcional) |
| `GET` | `/api/v1/haciendas/count` | Total para el dashboard (**incluye `Inactivo`**) |
| `GET` | `/api/v1/haciendas/:id` | Una hacienda (`404` si no existe) |
| `POST` | `/api/v1/haciendas` | Crea (`nombre`, `ubicacion` requeridos; `estatus` por defecto `Activo`) |
| `PUT` | `/api/v1/haciendas/:id` | Actualización parcial (al menos un campo) |
| `DELETE` | `/api/v1/haciendas/:id` | **Baja lógica** → pone `estatus='Inactivo'` (la fila se conserva) |

Ejemplos:

```bash
# Lista (segunda página, solo activas)
curl "http://localhost:3000/api/v1/haciendas?limit=5&offset=5&estatus=Activo"

# Contador del dashboard
curl http://localhost:3000/api/v1/haciendas/count
# {"status":true,"message":"Total de haciendas obtenido correctamente","data":{"total":10}}

# Crear
curl -X POST http://localhost:3000/api/v1/haciendas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Hacienda Nueva","ubicacion":"Santa Ana, Santa Ana"}'
# 201 {"status":true,"message":"Hacienda creada correctamente","data":{...}}

# Actualizar
curl -X PUT http://localhost:3000/api/v1/haciendas/1 \
  -H "Content-Type: application/json" \
  -d '{"ubicacion":"Tacuba, Ahuachapan"}'

# Baja lógica
curl -X DELETE http://localhost:3000/api/v1/haciendas/1
# {"status":true,"message":"Hacienda desactivada correctamente","data":{...,"estatus":"Inactivo"}}
```

Forma de error: `{ status: false, message, code }` — `422 VALIDATION_ERROR` (campos requeridos/inválidos), `404 NOT_FOUND`, `409 CONFLICT` (duplicado en `nombre`).

## Estructura del proyecto

```
database/            01-create-database.sql, 02-seed-haciendas.sql (fuente de verdad)
scripts/             db.js (ayudante compartido), create-database.js, seed-database.js
src/
  app.js server.js
  config/            environment.js (único lector de process.env), database.js (Sequelize), swagger.js + swagger/
  models/            hacienda.model.js (timestamps → created_at/updated_at)
  repositories/      hacienda.repository.js (acceso puro a datos, sin reglas de negocio)
  services/          hacienda.service.js (verificaciones manuales, errores tipados, baja lógica)
  controllers/       hacienda.controller.js (lanza errores → errorHandler central, sin try/catch)
  routes/v1/         hacienda.routes.js + index.js (`/count` antes de `/:id`)
  middlewares/       cors, helmet, error, rate-limiter, xss-sanitize
  utils/             errors.js (AppError…), pagination.js (buildPagination), logger.js
```

Regla de capas: `routes → controllers → services → repositories → models`. Los controladores nunca tocan modelos/repositorios; los servicios nunca tocan `req`/`res`.

## Convenciones y decisiones

- **Baja lógica:** `DELETE` pone `estatus='Inactivo'`; el contador incluye las inactivas.
- **Idioma:** identificadores de código + logs en inglés; comentarios y mensajes de la API en español.

Commits convencionales (`feat|fix|docs|style|refactor|chore…`), ej. `feat(haciendas): add CRUD layers with soft-delete and dashboard count`.
