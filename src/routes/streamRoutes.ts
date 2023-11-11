import { Router } from 'express';
import * as streamController from '../controllers/streamController';

const router = Router();

const baseRoute = '/stream';

// POST /staff - Create a new staff
router.post(baseRoute, streamController.createStream);

// GET /staff/all - Get all staff
router.get(`${baseRoute}/all`, streamController.getStreams);

// PUT /staff/:id - Update a staff
router.put(`${baseRoute}/:id`, streamController.updateStream);

// DELETE /staff/:id - Delete a staff
router.delete(`${baseRoute}/:id`, streamController.deleteStream);

export default router;
