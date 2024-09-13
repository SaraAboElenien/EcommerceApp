import express from 'express';
import * as UC from './user.controller.js';
import { auth } from '../../../middlewares/auth.js';
import { validation } from '../../../middlewares/validation.js';
import * as UV from './user.validation.js';
const router = express.Router();


router.post('/signup', validation(UV.signupValidationSchema),  UC.signUp); 
router.get('/confirmEmail/:token', UC.confirmEmail);
router.get('/confirmEmailRefresher/:refreshToken', UC.refreshConfirmation);
router.patch('/forgetPassword', UC.forgetPassword );
router.patch('/resetPassword', UC.resetPassword );
router.post('/signin', validation(UV.signinValidationSchema), UC.signIn);   



// router.get('/profile', auth(),UC.getProfile);
// router.patch('/updateProfile', auth(),UC.updateAccount );
// router.delete('/deleteProfile', auth(),UC.deleteAccount );
// router.get('/getDataForAnotherUser/:id',auth(), UC.getDataForAnotherUser);
// router.get('/recoveryEmail', auth(), UC.getByRecoveryEmail );
// router.patch('/updatePassword',auth(),validation(UV.updatePasswordSchema), UC.updatePassword)


export default router