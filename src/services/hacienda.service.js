import {
  countHaciendas as countHaciendasRepo,
  createHacienda as createHaciendaRepo,
  deleteHacienda as deleteHaciendaRepo,
  getHaciendaById as getHaciendaByIdRepo,
  getHaciendas as getHaciendasRepo,
  updateHacienda as updateHaciendaRepo,
} from '../repositories/hacienda.repository.js';
import { buildPagination } from '../utils/pagination.js';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

// Valores permitidos para el campo estatus.
const ESTATUS_VALIDOS = ['Activo', 'Inactivo'];
// Límite máximo por página para proteger la BD de respuestas muy grandes.
const MAX_LIMIT = 100;

// Lista paginada de haciendas con filtro opcional por estatus.
// Normaliza limit/offset y delega el acceso a datos al repositorio.
export const getHaciendas = async ({ limit = 10, offset = 0, estatus } = {}) => {
  // Normaliza paginación: enteros dentro de rango seguro.
  const safeLimit = Math.min(Math.max(1, parseInt(limit, 10) || 10), MAX_LIMIT);
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

  // Filtro opcional por estatus (si viene, debe ser un valor permitido).
  const where = {};
  if (estatus !== undefined && estatus !== null && estatus !== '') {
    if (!ESTATUS_VALIDOS.includes(estatus)) {
      throw new ValidationError('El campo estatus debe ser Activo o Inactivo');
    }
    where.estatus = estatus;
  }

  logger.info(`Fetching haciendas with limit ${safeLimit} and offset ${safeOffset}`);
  const { rows, count } = await getHaciendasRepo({ where, limit: safeLimit, offset: safeOffset });
  return { data: rows, pagination: buildPagination(count, safeLimit, safeOffset) };
};

// Obtiene una hacienda por id (valida el id y traduce nulo a 404).
export const getHaciendaById = async (idHacienda) => {
  // El id debe ser un entero positivo.
  const id = parseInt(idHacienda, 10);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('El campo idHacienda debe ser un entero positivo');
  }

  const hacienda = await getHaciendaByIdRepo(id);
  if (!hacienda) {
    throw new NotFoundError('Hacienda no encontrada');
  }
  return hacienda;
};

// Crea una hacienda con verificaciones manuales mínimas.
// Aplica valor por defecto Activo y traduce nombre duplicado a 409.
export const createHacienda = async (data = {}) => {
  // Normaliza espacios en los campos de texto.
  const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : '';
  const ubicacion = typeof data.ubicacion === 'string' ? data.ubicacion.trim() : '';
  const estatus = data.estatus ?? 'Activo';

  // Campos requeridos: nombre y ubicación no pueden ir vacíos.
  if (!nombre) {
    throw new ValidationError('El campo nombre es requerido');
  }
  if (!ubicacion) {
    throw new ValidationError('El campo ubicacion es requerido');
  }
  // El estatus, si viene, debe ser un valor permitido.
  if (!ESTATUS_VALIDOS.includes(estatus)) {
    throw new ValidationError('El campo estatus debe ser Activo o Inactivo');
  }

  logger.info(`Creating hacienda with nombre "${nombre}"`);
  try {
    return await createHaciendaRepo({ nombre, ubicacion, estatus });
  } catch (error) {
    // Nombre duplicado (UNIQUE) se traduce a conflicto 409.
    if (error?.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('Ya existe una hacienda con ese nombre');
    }
    throw error;
  }
};

// Actualiza una hacienda existente (verifica existencia y campos mínimos).
// Solo actualiza los campos enviados. Recarga el registro al final.
export const updateHacienda = async (idHacienda, data = {}) => {
  // El id debe ser un entero positivo.
  const id = parseInt(idHacienda, 10);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('El campo idHacienda debe ser un entero positivo');
  }

  // Verifica que la hacienda exista antes de actualizar.
  const existing = await getHaciendaByIdRepo(id);
  if (!existing) {
    throw new NotFoundError('Hacienda no encontrada');
  }

  // Construye el objeto a actualizar solo con campos enviados.
  const toUpdate = {};
  if (data.nombre !== undefined) {
    const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : '';
    if (!nombre) {
      throw new ValidationError('El campo nombre no puede estar vacío');
    }
    toUpdate.nombre = nombre;
  }
  if (data.ubicacion !== undefined) {
    const ubicacion = typeof data.ubicacion === 'string' ? data.ubicacion.trim() : '';
    if (!ubicacion) {
      throw new ValidationError('El campo ubicacion no puede estar vacío');
    }
    toUpdate.ubicacion = ubicacion;
  }
  if (data.estatus !== undefined) {
    if (!ESTATUS_VALIDOS.includes(data.estatus)) {
      throw new ValidationError('El campo estatus debe ser Activo o Inactivo');
    }
    toUpdate.estatus = data.estatus;
  }

  // Exige al menos un campo válido para actualizar.
  if (Object.keys(toUpdate).length === 0) {
    throw new ValidationError('Sin campos para actualizar');
  }

  logger.info(`Updating hacienda ${id}`);
  try {
    await updateHaciendaRepo(id, toUpdate);
  } catch (error) {
    // Nombre duplicado (UNIQUE) se traduce a conflicto 409.
    if (error?.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('Ya existe una hacienda con ese nombre');
    }
    throw error;
  }
  return getHaciendaByIdRepo(id);
};

// Baja lógica de hacienda: marca estatus como Inactivo (no borra la fila).
// Verifica existencia, aplica la baja y devuelve el registro actualizado.
export const deleteHacienda = async (idHacienda) => {
  // El id debe ser un entero positivo.
  const id = parseInt(idHacienda, 10);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('El campo idHacienda debe ser un entero positivo');
  }

  // Verifica que la hacienda exista antes de desactivar.
  const existing = await getHaciendaByIdRepo(id);
  if (!existing) {
    throw new NotFoundError('Hacienda no encontrada');
  }

  logger.info(`Soft-deleting hacienda ${id}`);
  await deleteHaciendaRepo(id);
  return getHaciendaByIdRepo(id);
};

// Conteo total de haciendas para el tablero (incluye Activo e Inactivo).
// Sin filtros: cuenta todas las filas de la tabla.
export const countHaciendas = async () => {
  logger.info('Counting haciendas for dashboard');
  const total = await countHaciendasRepo();
  return { total };
};
