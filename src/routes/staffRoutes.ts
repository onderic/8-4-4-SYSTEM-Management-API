// routes/staffRoutes.ts
import { Router } from 'express';
import * as staffController from '../controllers/staffController';
import {auth} from '../middlewares/authentication';

const router = Router();

// Define a base route for staff
const baseRoute = '/staff';

// POST /staff - Create a new staff
router.post(baseRoute, staffController.createStaff);

// GET /staff/all - Get all staff
router.get(`${baseRoute}/all`,auth, staffController.getAllStaffs);

// PUT /staff/:id - Update a staff
router.put(`${baseRoute}/:id`,auth, staffController.updateStaff);

// DELETE /staff/:id - Delete a staff
router.delete(`${baseRoute}/:id`, staffController.deleteStaff);

export default router;
