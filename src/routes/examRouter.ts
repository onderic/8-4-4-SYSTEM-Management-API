import { Router } from 'express';
import * as examController from '../controllers/examController';

const router = Router();

const baseRoute = '/exam';

// Create a new Class
router.post(`${baseRoute}`, examController.createExam);

router.get(`${baseRoute}`, examController.getAllExam);

export default router;