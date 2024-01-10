import { Router } from 'express';
import * as mpesa from "../../controllers/payments/mpesaController";
import {accessToken} from "../../middlewares/mpesa";

const router = Router();

const baseRoute = '/pay';

router.post(`${baseRoute}/stkPush`,accessToken, mpesa.initiateSTKPush);


router.post(`${baseRoute}/stkPushCallback/:Order_ID`, mpesa.stkPushCallback);


export default router;
