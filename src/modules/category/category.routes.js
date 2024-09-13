import express from 'express';
import * as CC from './category.controller.js';
import * as CV from './category.validation.js'
import { multerHost, validExtension } from '../../../service/multerLocal.js';
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';
const router = express.Router();


router.get('/',
    auth(Object.values(systemRoles)), 
    CC.getCategories);

router.post('/',
    multerHost(validExtension.image).single("image"),
    validation(CV.categoryCreationValidationSchema),
    auth(systemRoles.admin), //["Admin"]
    CC.createCategory);

router.put('/:id',
    multerHost(validExtension.image).single("image"),
    validation(CV.categoryUpdateValidationSchema),
    auth(systemRoles.admin),
    CC.updateCategory);


router.delete('/:id',
    validation(CV.categoryDeleteValidationSchema),
    auth(systemRoles.admin),
    CC.deleteCategory
);

router.get('/search', CC.searchCategories);


export default router