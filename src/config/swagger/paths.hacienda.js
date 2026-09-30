import { errorResponse, idParam, limitParam, offsetParam } from './helpers.js';

// Rutas OpenAPI del recurso haciendas (6 endpoints).
// Reflejan src/routes/v1/hacienda.routes.js (count va antes de :id).
export const haciendaPaths = {
  '/api/v1/haciendas': {
    // Lista paginada con filtro opcional por estatus.
    get: {
      tags: ['Haciendas'],
      summary: 'Listar haciendas',
      description: 'Devuelve la lista paginada. El filtro estatus es opcional.',
      parameters: [
        limitParam,
        offsetParam,
        {
          name: 'estatus',
          in: 'query',
          required: false,
          description: 'Filtra por estado (Activo o Inactivo)',
          schema: { type: 'string', enum: ['Activo', 'Inactivo'] },
        },
      ],
      responses: {
        200: {
          description: 'Haciendas obtenidas correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HaciendaListResponse' },
            },
          },
        },
        422: errorResponse('Estatus no permitido'),
      },
    },
    // Crea una hacienda (nombre y ubicacion requeridos).
    post: {
      tags: ['Haciendas'],
      summary: 'Crear hacienda',
      description: 'Crea una hacienda. El estatus por defecto es Activo.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/HaciendaInput' },
          },
        },
      },
      responses: {
        201: {
          description: 'Hacienda creada correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HaciendaSingleResponse' },
            },
          },
        },
        409: errorResponse('Nombre duplicado'),
        422: errorResponse('Datos requeridos o estatus no permitido'),
      },
    },
  },

  // Conteo total para el dashboard (incluye Activo e Inactivo).
  '/api/v1/haciendas/count': {
    get: {
      tags: ['Haciendas'],
      summary: 'Contar haciendas',
      description: 'Devuelve el total de haciendas, incluyendo inactivas.',
      responses: {
        200: {
          description: 'Total de haciendas obtenido correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HaciendaCountResponse' },
            },
          },
        },
      },
    },
  },

  '/api/v1/haciendas/{id}': {
    // Obtiene una hacienda por id.
    get: {
      tags: ['Haciendas'],
      summary: 'Obtener hacienda por id',
      parameters: [idParam('Id de la hacienda')],
      responses: {
        200: {
          description: 'Hacienda obtenida correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HaciendaSingleResponse' },
            },
          },
        },
        404: errorResponse('Hacienda no encontrada'),
        422: errorResponse('Id inválido'),
      },
    },
    // Actualiza campos parciales (al menos un campo).
    put: {
      tags: ['Haciendas'],
      summary: 'Actualizar hacienda',
      parameters: [idParam('Id de la hacienda a actualizar')],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/HaciendaUpdate' },
          },
        },
      },
      responses: {
        200: {
          description: 'Hacienda actualizada correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HaciendaSingleResponse' },
            },
          },
        },
        404: errorResponse('Hacienda no encontrada'),
        409: errorResponse('Nombre duplicado'),
        422: errorResponse('Id inválido o sin campos para actualizar'),
      },
    },
    // Baja lógica: marca estatus como Inactivo (no borra la fila).
    delete: {
      tags: ['Haciendas'],
      summary: 'Desactivar hacienda',
      description: 'Baja lógica: cambia el estatus a Inactivo.',
      parameters: [idParam('Id de la hacienda a desactivar')],
      responses: {
        200: {
          description: 'Hacienda desactivada correctamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HaciendaSingleResponse' },
            },
          },
        },
        404: errorResponse('Hacienda no encontrada'),
        422: errorResponse('Id inválido'),
      },
    },
  },
};
