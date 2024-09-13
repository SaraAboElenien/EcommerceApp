import reviewModel from '../../../db/models/review.model.js';
import productModel from '../../../db/models/product.model.js';
import orderModel from '../../../db/models/order.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';

//========== addReview ===========//
export const addReview = asyncHandler(async (req, res, next) => {
    const { comment, rate } = req.body;
    const { productId } = req.params;

    // Check if the product exists
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    // Check if the user has already reviewed the product
    const existingReview = await reviewModel.findOne({
        productId,
        createdBy: req.user._id,
    });

    if (existingReview) {
        return next(new AppError("You have already reviewed this product", 400));
    }

    // Check if the user has placed an order for this product
    const order = await orderModel.findOne({
        user: req.user._id,
        'products.productId': productId,
        status: { $in: ["Delivered"] }  // Only allow reviews for delivered orders
    });

    if (!order) {
        return next(new AppError("You can only review products that you have purchased", 403));
    }

    // Create a new review
    const review = await reviewModel.create({
        comment,
        rate,
        createdBy: req.user._id,
        productId,
    });

    // Update product's average rating
    const totalRating = product.rateAvg * product.rateNumber + rate;
    const newRateNumber = product.rateNumber + 1;
    const newAverageRating = totalRating / newRateNumber;

    product.rateAvg = newAverageRating;
    product.rateNumber = newRateNumber;

    await product.save();

    return res.status(201).json({ message: "Review added successfully", review });
});



//========== deleteReview ===========//
export const deleteReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const review = await reviewModel.findOneAndDelete({
        _id: id, createdBy: req.user._id});
    if (!review) {
        return next(new AppError("Review not found", 404));
    }

    const product = await productModel.findById(review.productId);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    // Update the product's rating and review count
    const totalRating = product.rateAvg * product.rateNumber - review.rate;
    const newRateNumber = product.rateNumber - 1;
    const newAverageRating = newRateNumber === 0 ? 0 : totalRating / newRateNumber;

    product.rateAvg = newAverageRating;
    product.rateNumber = newRateNumber;

    await product.save();

    await reviewModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Review deleted successfully" });
});