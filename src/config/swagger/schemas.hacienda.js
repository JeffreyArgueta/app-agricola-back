// Esquemas OpenAPI del recurso haciendas (campos en camelCase).
// Reflejan el modelo Sequelize y la forma de respuesta { status, message, data }.

export const haciendaSchemas = {
  // Hacienda completa tal como la devuelve la API.
  Hacienda: {
    type: 'object',
    properties: {
      idHacienda: { type: 'integer', minimum: 1, example: 1 },
      nombre: { type: 'string', maxLength: 150, example: 'Hacienda El Carmen' },
      ubicacion: { type: 'string', maxLength: 255, example: 'Tacuba, Ahuachapan' },
      estatus: { type: 'string', enum: ['Activo', 'Inactivo'], example: 'Activo' },
      createdAt: { type: 'string', format: 'date-time', example: '2026-09-30T12:00:00.000Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-09-30T12:00:00.000Z' },
    },
  },

  // Cuerpo para crear (nombre y ubicacion requeridos, estatus opcional).
  HaciendaInput: {
    type: 'object',
    required: ['nombre', 'ubicacion'],
    properties: {
      nombre: { type: 'string', maxLength: 150, example: 'Hacienda El Carmen' },
      ubicacion: { type: 'string', maxLength: 255, example: 'Tacuba, Ahuachapan' },
      estatus: { type: 'string', enum: ['Activo', 'Inactivo'], default: 'Activo' },
    },
  },

  // Cuerpo para actualizar (todos los campos opcionales, al menos uno).
  HaciendaUpdate: {
    type: 'object',
    minProperties: 1,
    properties: {
      nombre: { type: 'string', maxLength: 150 },
      ubicacion: { type: 'string', maxLength: 255 },
      estatus: { type: 'string', enum: ['Activo', 'Inactivo'] },
    },
  },

  // Paginación por offset (ver utils/pagination.js).
  Pagination: {
    type: 'object',
    properties: {
      total: { type: 'integer', example: 10 },
      limit: { type: 'integer', example: 10 },
      offset: { type: 'integer', example: 0 },
      currentPage: { type: 'integer', example: 1 },
      totalPages: { type: 'integer', example: 1 },
      hasNextPage: { type: 'boolean', example: false },
      hasPrevPage: { type: 'boolean', example: false },
    },
  },

  // Respuesta de lista: { status, message, data[], pagination }.
  HaciendaListResponse: {
    type: 'object',
    properties: {
      status: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Haciendas obtenidas correctamente' },
      data: { type: 'array', items: { $ref: '#/components/schemas/Hacienda' } },
      pagination: { $ref: '#/components/schemas/Pagination' },
    },
  },

  // Respuesta de un solo recurso: { status, message, data }.
  HaciendaSingleResponse: {
    type: 'object',
    properties: {
      status: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Hacienda obtenida correctamente' },
      data: { $ref: '#/components/schemas/Hacienda' },
    },
  },

  // Respuesta del conteo para el dashboard: { status, message, data: { total } }.
  HaciendaCountResponse: {
    type: 'object',
    properties: {
      status: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Total de haciendas obtenido correctamente' },
      data: {
        type: 'object',
        properties: { total: { type: 'integer', example: 10 } },
      },
    },
  },

  // Respuesta de error estándar: { status: false, message, code }.
  ErrorResponse: {
    type: 'object',
    properties: {
      status: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Hacienda no encontrada' },
      code: { type: 'string', example: 'NOT_FOUND' },
    },
  },
};
