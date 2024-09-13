import express from 'express';
import * as OC from './order.controller.js';
import * as OV from './order.validation.js'
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';
const router = express.Router();


router.post('/',
    validation(OV.orderCreationValidationSchema),
    auth(Object.values(systemRoles)),
    OC.createOrder);

    router.put('/:id',
        validation(OV.orderCancellationValidationSchema),
        auth(Object.values(systemRoles)),
        OC.cancelOrder);
    

export default router