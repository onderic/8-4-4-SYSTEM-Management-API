import { Router } from 'express';
import * as departmentController from '../controllers/departmentController';

const router = Router();

// Define a base route for staff
const baseRoute = '/departmentHs';


// // GET /staff/all - Get all staff
router.get(`${baseRoute}/:id`, departmentController.getDepartmentHistory);

// // PUT /staff/:id - Update a staff
// router.put(`${baseRoute}/:id`, departmentController.updateStaff);

// // DELETE /staff/:id - Delete a staff
// router.delete(`${baseRoute}/:id`, departmentController.deleteStaff);

export default router;