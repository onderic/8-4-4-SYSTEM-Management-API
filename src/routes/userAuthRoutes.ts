import { Router } from 'express';
import * as userAuthController from '../controllers/userAuthController';

const router = Router();

const baseRoute = '/auth';

// Create a new Class
router.post(`${baseRoute}/login`, userAuthController.login);

export default router;