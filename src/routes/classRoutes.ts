// routes/staffRoutes.ts
import { Router } from 'express';
import * as classController from '../controllers/classController';

const router = Router();

// Create a new Class
router.post('/classes', classController.createClass);

// Read Classes
router.get('/classes', classController.getClasses);

// Update a Class by ID
router.put('/classes/:id', classController.updateClass);

// Delete a Class by ID
router.delete('/classes/:id', classController.deleteClass);

export default router;

