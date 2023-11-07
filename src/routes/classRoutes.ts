// routes/staffRoutes.ts

import { Router } from 'express';
import * as classController from '../controllers/classController';

const router = Router();

// Define a base route for staff
const baseRoute = '/class';

// POST /staff - Create a new staff
router.post(baseRoute, classController.createClass);

// GET /staff/all - Get all staff
// router.get(`${baseRoute}/all`, classController.getAllStaffs);


// router.put(`${baseRoute}/:id`, classController.updateStaff);

// router.delete(`${baseRoute}/:id`, classController.deleteStaff);

export default router;
