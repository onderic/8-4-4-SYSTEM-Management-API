import { Router } from 'express';
import * as departmentController from '../controllers/departmentController';

const router = Router();


const baseRoute = '/department';

// POST /department - Create a new department
router.post(baseRoute, departmentController.createDepartment);

// // GET /department/all - Get all department
router.get(`${baseRoute}/all`, departmentController.getDepartments);

// // PUT /department/:id - Update a department
router.put(`${baseRoute}/:id`, departmentController.updateDepartments);

// // DELETE /department/:id - Delete a department
router.delete(`${baseRoute}/:id`, departmentController.deleteDepartmentHead);

export default router;