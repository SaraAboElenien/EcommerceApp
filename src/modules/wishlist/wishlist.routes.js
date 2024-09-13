import express from 'express';
import * as WC from './wishlist.controller.js';
import * as WV from './wishlist.validation.js';
import { systemRoles } from '../../../utils/systemRoles.js';
import { validation } from '../../../middlewares/validation.js';
import { auth } from '../../../middlewares/auth.js';

const router = express.Router({mergeParams: true});

router.post('/',
    validation(WV.wishlistCreationValidationSchema),
    auth(Object.values(systemRoles)), 
    WC.addProductToWishlist
);

router.delete(
    '/:productId',
    validation(WV.removeFromWishlistValidationSchema),
    auth(Object.values(systemRoles)),
    WC.removeProductFromWishlist
);

router.get(
    '/',
    auth(Object.values(systemRoles)),
    WC.getWishlist
);

router.put(
    '/clear',
    auth(Object.values(systemRoles)),
    WC.clearWishlist
);


export default router;
