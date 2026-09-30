import { Router } from 'express';
import * as haciendaController from '../../controllers/hacienda.controller.js';

// Rutas del recurso haciendas (prefijo /api/v1/haciendas en v1/index.js).
// La ruta /count va antes de /:id para que no se confunda con un id.
const router = Router();

router.get('/count', haciendaController.countHaciendas);

// Lista paginada: GET /?limit=10&offset=0&estatus=Activo (estatus opcional).
router.get('/', haciendaController.getHaciendas);

router.get('/:id', haciendaController.getHaciendaById);
router.post('/', haciendaController.createHacienda);
router.put('/:id', haciendaController.updateHacienda);
router.delete('/:id', haciendaController.deleteHacienda);

export default router;
