import { Router } from 'express';
import * as subjectController from '../controllers/subjectController';

const router = Router();

const baseRoute = '/subject';

// Create a new Class
router.post(`${baseRoute}`, subjectController.createSubject);

router.post(`${baseRoute}/add-subject`, subjectController.addSubjectsToClass);

router.get(`${baseRoute}`, subjectController.getAllSubjects);

router.put(`${baseRoute}/:id`, subjectController.updateSubject);

router.delete(`${baseRoute}/:id`, subjectController.deleteSubject);


export default router;