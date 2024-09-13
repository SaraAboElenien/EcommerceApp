import express from 'express';
import * as RC from './review.controller.js';
import * as RV from './review.validation.js';
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/',
    validation(RV.reviewCreationValidationSchema),
    auth(systemRoles.admin), 
    RC.addReview
);


router.delete('/:id',
    validation(RV.reviewdeleteValidationSchema),
    auth(systemRoles.admin), 
    RC.deleteReview
);

export default router;
