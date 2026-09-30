import { Hacienda } from '../models/index.js';

// Lista paginada de haciendas (acceso puro a datos, sin reglas de negocio).
// Recibe where / limit / offset y devuelve filas + total para paginar.
export const getHaciendas = ({ where = {}, limit = 10, offset = 0 } = {}) =>
  Hacienda.findAndCountAll({
    where,
    limit,
    offset,
    order: [['idHacienda', 'DESC']],
  });

// Busca una hacienda por su llave primaria (sin reglas de negocio).
// Devuelve el modelo o null si no existe (el servicio decide el 404).
export const getHaciendaById = (idHacienda) => Hacienda.findByPk(idHacienda);

// Crea una hacienda (acceso puro a datos, sin validaciones de negocio).
export const createHacienda = (data) => Hacienda.create(data);

// Actualiza una hacienda por id (acceso puro a datos).
// Devuelve [afectados]. El servicio recarga el registro actualizado.
export const updateHacienda = (idHacienda, data) =>
  Hacienda.update(data, { where: { idHacienda } });

// Baja lógica de hacienda: marca estatus como Inactivo (no borra la fila).
// Devuelve [afectados]. El servicio verifica existencia antes de llamar.
export const deleteHacienda = (idHacienda) =>
  Hacienda.update({ estatus: 'Inactivo' }, { where: { idHacienda } });

// Conteo total de haciendas para el tablero (incluye Activo e Inactivo).
// Acepta where opcional por si el tablero filtra por estatus después.
export const countHaciendas = ({ where = {} } = {}) => Hacienda.count({ where });
