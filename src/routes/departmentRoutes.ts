import { Router } from 'express';
import * as departmentController from '../controllers/departmentController';

const router = Router();

// Define a base route for staff
const baseRoute = '/department';

// POST /staff - Create a new staff
router.post(baseRoute, departmentController.createDepartment);

// // GET /staff/all - Get all staff
router.get(`${baseRoute}/all`, departmentController.getDepartments);

// // PUT /staff/:id - Update a staff
router.put(`${baseRoute}/:id`, departmentController.updateDepartments);

// // DELETE /staff/:id - Delete a staff
router.delete(`${baseRoute}/:id`, departmentController.deleteDepartmentHead);

export default router;