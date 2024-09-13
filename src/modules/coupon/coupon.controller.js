import couponModel from '../../../db/models/coupon.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';



//========== createCoupon ===========//
export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body;
    const couponExist = await couponModel.findOne({ code: code.toLowerCase() });
    if (couponExist) {
        return next(new AppError("This coupon already exists", 409));
    }
    const coupon = await couponModel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id,
    });
    return res.status(201).json({ message: "coupon created successfully", coupon });


});



//========== updateCoupon ===========//
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { code, amount, fromDate, toDate } = req.body;
    const coupon = await couponModel.findByIdAndUpdate
        ({ _id: id, createdBy: req.user._id },
            {
                code,
                amount,
                fromDate,
                toDate
            },
           { new: true});
    if (!coupon) {
        return next(new AppError("This coupon doesn't exist", 409));
    }
    return res.status(201).json({ message: "coupon updated successfully", coupon });
});


//========== deleteCoupon ===========//
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await couponModel.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!coupon) {
        return next(new AppError("This coupon doesn't exist", 404));
    }
    return res.status(200).json({ message: "Coupon deleted successfully" });
});














// //========== deleteBrand ===========//
// export const deleteBrand = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const brand = await brandModel.findOne({ _id: id, createdBy: req.user._id });
//     if (!brand) {
//         return next(new AppError("This brand doesn't exist or you do not have permission to delete it", 404));
//     }
//     if (brand.image && brand.image.public_id) {
//         await cloudinary.uploader.destroy(brand.image.public_id);
//     }
//     await brandModel.findByIdAndDelete(id);
//     return res.status(200).json({ message: "brand deleted successfully" });
// });


// //========== getAllBrands ===========//
// export const getAllBrands = asyncHandler(async (req, res, next) => {
//     const brands = await brandModel.find();
//     const count = await brandModel.countDocuments();

//     return res.status(200).json({
//         message: "Brands fetched successfully",
//         count,
//         brands
//     });
// });


// //========== getSpecificBrand ===========//
// export const getSpecificBrand = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const brand = await brandModel.findById(id);
//     if (!brand) {
//         return next(new AppError("This brand doesn't exist", 404));
//     }
//     return res.status(200).json({ message: "Brand fetched successfully", brand });
// });


// //========== filterBrands ===========//
// export const filterBrands = asyncHandler(async (req, res, next) => {
//     const { name, createdBy } = req.query;

//     // Build a query object based on the provided filters
//     let query = {};

//     if (name) {
//         query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
//     }

//     if (createdBy) {
//         query.createdBy = createdBy;
//     }

//     const brands = await brandModel.find(query);
//     const count = await brandModel.countDocuments(query);

//     return res.status(200).json({
//         message: "Brands filtered successfully",
//         count,
//         brands
//     });
// });
