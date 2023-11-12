import { Router } from 'express';
import * as streamController from '../controllers/streamController';

const router = Router();

const baseRoute = '/stream';

// POST /stream - Create a new stream
router.post(baseRoute, streamController.createStream);

// GET /stream/all - Get all stream
router.get(`${baseRoute}/all`, streamController.getStreams);

// PUT /stream/:id - Update a stream
router.put(`${baseRoute}/:id`, streamController.updateStream);

// DELETE /stream/:id - Delete a stream
router.delete(`${baseRoute}/:id`, streamController.deleteStream);

export default router;
