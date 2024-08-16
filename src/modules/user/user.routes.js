import express from 'express';
import * as UC from './user.controller.js';
import { auth } from '../../../middlewares/auth.js';
import { validation } from '../../../middlewares/validation.js';
import * as UV from './user.validation.js';
const router = express.Router();


router.post('/signup', validation(UV.signupValidationSchema),  UC.signUp); 
router.get('/cofirmEmail/:token', UC.confirmEmail);
router.get('/cofirmEmailRefresher/:refreshToken', UC.refreshConfirmation);

export default router