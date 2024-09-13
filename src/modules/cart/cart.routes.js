import express from 'express';
import * as CC from './cart.controller.js';
import * as CV from './cart.validation.js'
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';
const router = express.Router();


router.post('/',
    validation(CV.cartCreationValidationSchema),
    auth(Object.values(systemRoles)),
    CC.createCart);


router.patch('/',
    validation(CV.cartRemoveValidationSchema),
    auth(Object.values(systemRoles)),
    CC.removeFromCart);


router.put('/',
    validation(CV.cartClearValidationSchema),
    auth(Object.values(systemRoles)),
    CC.clearCart);

export default router