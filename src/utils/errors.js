// Clases de error tipadas para el manejador centralizado (error.middleware.js).
// Los servicios lanzan estos errores y Express los deriva al errorHandler.
export class AppError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Error de validación (422): datos requeridos o valores no permitidos.
export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos') {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

// Error de no encontrado (404): la hacienda no existe.
export class NotFoundError extends AppError {
  constructor(message = 'Hacienda no encontrada') {
    super(message, 404, 'NOT_FOUND');
  }
}

// Error de conflicto (409): nombre duplicado (UNIQUE).
export class ConflictError extends AppError {
  constructor(message = 'Conflicto') {
    super(message, 409, 'CONFLICT');
  }
}

// Error de no autorizado (401).
export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// Error de prohibido (403).
export class ForbiddenError extends AppError {
  constructor(message = 'Prohibido') {
    super(message, 403, 'FORBIDDEN');
  }
}
