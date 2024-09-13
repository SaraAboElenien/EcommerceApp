import express from 'express';
import * as BC from './brand.controller.js';
import * as BV from './brand.validation.js'
import { multerHost, validExtension } from '../../../service/multerLocal.js';
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';
const router = express.Router();


router.post('/',
    multerHost(validExtension.image).single("image"),
    validation(BV.brandCreationValidationSchema),
    auth(systemRoles.admin), //["Admin"]
    BC.createBrand);

router.put('/:id',
    multerHost(validExtension.image).single("image"),
    validation(BV.brandUpdateValidationSchema),
    auth(systemRoles.admin),
    BC.updateBrand);

router.delete('/:id',
    multerHost(validExtension.image).single("image"),
    validation(BV.brandDeleteValidationSchema),
    auth(systemRoles.admin),
    BC.deleteBrand);


router.get('/all',
    BC.getAllBrands);

router.get('/:id',
    validation(BV.getBrandValidation),
    BC.getSpecificBrand);

router.get('/',
    validation(BV.filterBrandsValidationSchema),
    BC.filterBrands);

export default router