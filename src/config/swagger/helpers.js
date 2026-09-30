// Ayudantes compartidos para la especificación OpenAPI (respuestas y parámetros).
// Evitan repetir los mismos bloques en cada archivo paths.<dominio>.js.

// Respuesta de error estándar { status: false, message, code }.
export const errorResponse = (description) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
    },
  },
});

// Parámetros de paginación por offset (listas pequeñas / admin).
export const limitParam = {
  name: 'limit',
  in: 'query',
  required: false,
  description: 'Cantidad de registros por página (1-100, por defecto 10)',
  schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
};

export const offsetParam = {
  name: 'offset',
  in: 'query',
  required: false,
  description: 'Desplazamiento desde el inicio (por defecto 0)',
  schema: { type: 'integer', minimum: 0, default: 0 },
};

// Parámetro de ruta para el id numérico del recurso.
export const idParam = (description = 'Id numérico del recurso') => ({
  name: 'id',
  in: 'path',
  required: true,
  description,
  schema: { type: 'integer', minimum: 1 },
});
