// routes/staffRoutes.ts

import { Router } from 'express';
import * as streamController from '../controllers/streamController';

const router = Router();

// Define a base route for staff
const baseRoute = '/stream';

// POST /staff - Create a new staff
router.post(baseRoute, streamController.createStream);

// // GET /staff/all - Get all staff
// router.get(`${baseRoute}/all`, streamController.getAllStaffs);

// // PUT /staff/:id - Update a staff
// router.put(`${baseRoute}/:id`, streamController.updateStaff);

// // DELETE /staff/:id - Delete a staff
// router.delete(`${baseRoute}/:id`, streamController.deleteStaff);

export default router;
