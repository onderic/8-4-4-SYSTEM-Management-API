import { Router } from 'express';
import * as classController from '../controllers/classController';

const router = Router();

const baseRoute = '/classes';

// Create a new Class
router.post(`${baseRoute}`, classController.createClass);

// Read Classes
router.get(`${baseRoute}`, classController.getClasses);

// Update a Class by ID
router.put(`${baseRoute}/:id`, classController.updateClass);

// Delete a Class by ID
router.delete(`${baseRoute}/:id`, classController.deleteClass);

export default router;

