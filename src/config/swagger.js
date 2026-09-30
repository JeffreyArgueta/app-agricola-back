import { haciendaPaths } from './swagger/paths.hacienda.js';
import { haciendaSchemas } from './swagger/schemas.hacienda.js';

// Ensambla la especificación OpenAPI 3.0 servida en /api/v1/docs.
// Suma los módulos por dominio (paths + schemas).
export const swaggerSpecV1 = {
  openapi: '3.0.0',
  info: {
    title: 'App Agricola API',
    version: '1.0.0',
    description: 'API v1: recurso haciendas (CRUD + conteo para el dashboard)',
  },
  tags: [{ name: 'Haciendas', description: 'Gestión de haciendas y conteo para el dashboard' }],
  paths: {
    ...haciendaPaths,
  },
  components: {
    schemas: {
      ...haciendaSchemas,
    },
  },
};
