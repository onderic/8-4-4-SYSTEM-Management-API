import { Router } from 'express';
import * as userAuthController from '../../controllers/Auth/loginController';
import * as refreshTokenController from '../../controllers/Auth/refreshTokenController';
import {verifyToken} from '../../middlewares/authentication';

const router = Router();

const baseRoute = '/auth';

// Create a new Class
router.post(`${baseRoute}/login`, userAuthController.login);

router.post(`${baseRoute}/refresh`, refreshTokenController.refresh);

export default router;