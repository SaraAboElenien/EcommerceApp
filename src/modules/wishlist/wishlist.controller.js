import wishlistModel from '../../../db/models/wishlist.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';



//========== addProductToWishlist ===========//
export const addProductToWishlist = asyncHandler(async (req, res, next) => {
    const {productId} = req.params;

    // Find the wishlist for the user
    let wishlist = await wishlistModel.findOne({ user: req.user._id });

    if (!wishlist) {
        // If the wishlist does not exist, create one
        wishlist = await wishlistModel.create({
            user: req.user._id,
            products: [productId],
        });
    } else {
        // Check if the product is already in the wishlist
        if (wishlist.products.includes(productId)) {
            return next(new AppError("Product is already in your wishlist", 400));
        }
        // Add the product to the wishlist
        wishlist.products.push(productId);
        await wishlist.save();
    }

    return res.status(201).json({ message: "Product added to wishlist", wishlist });
});



//========== removeProductFromWishlist ===========//
export const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;

    // Find the wishlist for the user
    const wishlist = await wishlistModel.findOne({ user: req.user._id });

    if (!wishlist || !wishlist.products.includes(productId)) {
        return next(new AppError("Product not found in your wishlist", 404));
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();

    return res.status(200).json({ message: "Product removed from wishlist", wishlist });
});



//========== getWishlist ===========//
export const getWishlist = asyncHandler(async (req, res, next) => {
    const wishlist = await wishlistModel.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
        return next(new AppError("Wishlist not found", 404));
    }

    return res.status(200).json({ message: "Wishlist retrieved successfully", wishlist });
});



//========== clearWishlist ===========//
export const clearWishlist = asyncHandler(async (req, res, next) => {
    const wishlist = await wishlistModel.findOneAndUpdate(
        { user: req.user._id },
        { products: [] },
        { new: true }
    );

    if (!wishlist) {
        return next(new AppError("Wishlist not found", 404));
    }

    return res.status(200).json({ message: "Wishlist cleared successfully", wishlist });
});
