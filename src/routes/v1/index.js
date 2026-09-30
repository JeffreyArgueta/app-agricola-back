import { Router } from 'express';
import haciendaRoutes from './hacienda.routes.js';

// Enrutador versionado v1 (montado en /api/v1 desde app.js).
const v1Router = Router();

v1Router.use('/haciendas', haciendaRoutes);

export { v1Router };
export default v1Router;
