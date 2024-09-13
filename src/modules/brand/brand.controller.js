import brandModel from '../../../db/models/brand.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import cloudinary from '../../../utils/cloudinary.js';



//========== createBrand ===========//
export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const brandExist = await brandModel.findOne({ name: name.toLowerCase() });
    if (brandExist) {
        return next(new AppError("This brand already exists", 409));
    } 
    if (!req.file) {
        return next(new AppError("Image field is required!", 404));
    }
    const customId = nanoid(5);
    try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/Brands/${customId}`
        });
        const { secure_url, public_id } = uploadResult;
        if (!secure_url || !public_id) {
            throw new Error('Missing secure_url or public_id in Cloudinary response');
        }
        const brand = await brandModel.create({
            name,
            slug: slugify(name, {
                replacement: "_",
                lower: true
            }),
            image: { secure_url, public_id },
            customId,
            createdBy: req.user._id,
        });
        return res.status(201).json({ message: "brand created successfully", brand });
    } catch (error) {
        return next(new AppError(`Cloudinary Upload Error: ${error.message}`, 500));
    }
});




//========== updateBrand ===========//
export const updateBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const brand = await brandModel.findOne({_id: id, createdBy: req.user._id});

    if (!brand) {
        return next(new AppError("This brand doesn't exist", 409));
    }

    if (name) {
        if (name.toLowerCase() === brand.name) {
            return next(new AppError("Please, use another brand name.", 400));
        }

        if (await brandModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("This brand name already exists", 409));
        }

        brand.name = name.toLowerCase();
        brand.slug = slugify(name, {
            replacement: "_",
            lower: true
        });
    }

    if (req.file) {
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(brand.image.public_id);

        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/Brands/${brand.customId}`
        });

        brand.image = { secure_url, public_id };
    }

    await brand.save();

    // Send a successful response using res.status
    return res.status(200).json({ message: "brand updated successfully", brand });
});



//========== deleteBrand ===========//
export const deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findOne({ _id: id, createdBy: req.user._id });
    if (!brand) {
        return next(new AppError("This brand doesn't exist or you do not have permission to delete it", 404));
    }
    if (brand.image && brand.image.public_id) {
        await cloudinary.uploader.destroy(brand.image.public_id);
    }
    await brandModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "brand deleted successfully" });
});


//========== getAllBrands ===========//
export const getAllBrands = asyncHandler(async (req, res, next) => {
    const brands = await brandModel.find();
    const count = await brandModel.countDocuments();

    return res.status(200).json({ 
        message: "Brands fetched successfully", 
        count,
        brands 
    });
});


//========== getSpecificBrand ===========//
export const getSpecificBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findById(id);
    if (!brand) {
        return next(new AppError("This brand doesn't exist", 404));
    }
    return res.status(200).json({ message: "Brand fetched successfully", brand });
});


//========== filterBrands ===========//
export const filterBrands = asyncHandler(async (req, res, next) => {
    const { name, createdBy } = req.query;

    // Build a query object based on the provided filters
    let query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (createdBy) {
        query.createdBy = createdBy;
    }

    const brands = await brandModel.find(query);
    const count = await brandModel.countDocuments(query);

    return res.status(200).json({ 
        message: "Brands filtered successfully", 
        count,
        brands 
    });
});
