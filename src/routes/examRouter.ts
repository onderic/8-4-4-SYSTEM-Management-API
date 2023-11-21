import { Router } from 'express';
import * as examController from '../controllers/examController';

const router = Router();

const baseRoute = '/exam';

// Create a new Class
router.post(`${baseRoute}`, examController.createExam);

router.get(`${baseRoute}`, examController.getAllExam);

router.put(`${baseRoute}/:id`, examController.updateExam);

router.get(`${baseRoute}/getAnExam/:id`, examController.getEachExam);

router.delete(`${baseRoute}/:id`, examController.deleteExam);

export default router;