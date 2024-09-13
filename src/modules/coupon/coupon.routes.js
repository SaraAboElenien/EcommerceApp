import express from 'express';
import * as CC from './coupon.controller.js';
import * as CV from './coupon.validation.js'
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';
const router = express.Router();


router.post('/',
    validation(CV.couponCreationValidationSchema),
    auth(systemRoles.admin), //["Admin"]
    CC.createCoupon);

router.put('/:id',
    validation(CV.couponUpdateValidationSchema),
    auth(systemRoles.admin),
    CC.updateCoupon);


router.delete('/:id',
    validation(CV.couponDeleteValidationSchema),
    auth(systemRoles.admin),
    CC.deleteCoupon);


// router.delete('/:id',
//     multerHost(validExtension.image).single("image"),
//     validation(BV.brandDeleteValidationSchema),
//     auth(systemRoles.admin),
//     BC.deleteBrand);


// router.get('/all',
//     BC.getAllBrands);

// router.get('/:id',
//     validation(BV.getBrandValidation),
//     BC.getSpecificBrand);

// router.get('/',
//     validation(BV.filterBrandsValidationSchema),
//     BC.filterBrands);

export default router