import * as haciendaService from '../services/hacienda.service.js';

// Lista paginada de haciendas (los errores se derivan al errorHandler central).
// Express redirige los throw async al middleware de errores: sin try/catch.
export const getHaciendas = async (req, res) => {
  // Lee paginación y filtro opcional desde query (el servicio valida).
  const { limit, offset, estatus } = req.query;
  const result = await haciendaService.getHaciendas({ limit, offset, estatus });
  res.status(200).json({
    status: true,
    message: 'Haciendas obtenidas correctamente',
    data: result.data,
    pagination: result.pagination,
  });
};

// Obtiene una hacienda por id (404 si no existe, vía el servicio).
export const getHaciendaById = async (req, res) => {
  // El id viene del parámetro de ruta :id.
  const hacienda = await haciendaService.getHaciendaById(req.params.id);
  res
    .status(200)
    .json({ status: true, message: 'Hacienda obtenida correctamente', data: hacienda });
};

// Crea una hacienda (el servicio valida requeridos y estatus).
export const createHacienda = async (req, res) => {
  // Los datos vienen del cuerpo JSON.
  const hacienda = await haciendaService.createHacienda(req.body);
  res.status(201).json({ status: true, message: 'Hacienda creada correctamente', data: hacienda });
};

// Actualiza una hacienda existente (solo campos enviados).
export const updateHacienda = async (req, res) => {
  // El id viene de :id y los cambios del cuerpo JSON.
  const hacienda = await haciendaService.updateHacienda(req.params.id, req.body);
  res
    .status(200)
    .json({ status: true, message: 'Hacienda actualizada correctamente', data: hacienda });
};

// Baja lógica de hacienda (marca estatus como Inactivo, no borra la fila).
export const deleteHacienda = async (req, res) => {
  // El id viene del parámetro de ruta :id.
  const hacienda = await haciendaService.deleteHacienda(req.params.id);
  res
    .status(200)
    .json({ status: true, message: 'Hacienda desactivada correctamente', data: hacienda });
};

// Conteo total de haciendas para el dashboard (incluye Activo e Inactivo).
export const countHaciendas = async (_req, res) => {
  // Sin parámetros: cuenta todas las filas de la tabla.
  const { total } = await haciendaService.countHaciendas();
  res
    .status(200)
    .json({ status: true, message: 'Total de haciendas obtenido correctamente', data: { total } });
};
