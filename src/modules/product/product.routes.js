import express from 'express';
import * as PC from './product.controller.js';
import * as PV from './product.validation.js';
import { multerHost, validExtension } from '../../../service/multerLocal.js';
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';
import reviewRoutes from '../review/review.routes.js'; 
import wishlistRoutes from '../wishlist/wishlist.routes.js'

const router = express.Router();

router.use("/:productId/review", reviewRoutes);
router.use("/:productId/wishlist", wishlistRoutes);


router.post('/',
    multerHost(validExtension.image).fields([
        { name: "image", maxCount: 1 },
        { name: "coverImages", maxCount: 3 },
    ]),
    validation(PV.productCreationValidationSchema),
    auth(systemRoles.admin),
    PC.createProduct
);

router.put('/:id',
    multerHost(validExtension.image).fields([
        { name: "image", maxCount: 1 },
        { name: "coverImages", maxCount: 3 },
    ]),
    validation(PV.productUpdateValidationSchema),
    auth(systemRoles.admin),
    PC.updateProduct
);

router.delete('/:id',
    auth(systemRoles.admin),
    validation(PV.productDeleteValidationSchema),
    PC.deleteProduct
);

router.get('/get',
    // validation(PV.searchProductValidation),
    auth(Object.values(systemRoles)),
    PC.getProducts
);

export default router;
