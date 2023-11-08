import { Router } from 'express';
import * as departmentHsController from '../controllers/departmentHsController';

const router = Router();

// Define a base route for staff
const baseRoute = '/departmentHs';


// // GET /staff/all - Get all staff
router.get(`${baseRoute}/:id`, departmentHsController.getDepartmentHistory);

// // PUT /staff/:id - Update a staff
router.put(`${baseRoute}/update`, departmentHsController.updateDepartmentHead);

// // DELETE /staff/:id - Delete a staff
// router.delete(`${baseRoute}/:id`, departmentController.deleteStaff);

export default router;