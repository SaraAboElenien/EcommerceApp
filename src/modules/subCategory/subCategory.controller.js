import subCategoryModel from '../../../db/models/subCategory.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import cloudinary from '../../../utils/cloudinary.js';
import categoryModel from '../../../db/models/category.model.js';



//========== createSubCategory ===========//
export const createSubCategory = asyncHandler(async (req, res, next) => {
    const { name, category } = req.body;
    const categoryExist = await categoryModel.findById(category);

    if (!categoryExist) {
        return next(new AppError("This category doesn't exist", 409))
    }

    if (!req.file) {
        return next(new AppError("Image field is required!", 404));
    }

    const customId = nanoid(5);

    try {
        // Attempt to upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/Categories/${categoryExist.customId}/subCategories/${customId}`
        });

        // Log the result of the upload to check if it contains the expected fields
        console.log('Upload Result:', uploadResult);

        // Check if the uploadResult contains secure_url and public_id
        const { secure_url, public_id } = uploadResult;

        if (!secure_url || !public_id) {
            throw new Error('Missing secure_url or public_id in Cloudinary response');
        }

        // Proceed with creating the category using the obtained secure_url and public_id
        const subCategory = await subCategoryModel.create({
            name,
            slug: slugify(name, {
                replacement: "_",
                lower: true
            }),
            image: { secure_url, public_id },
            customId,
            category,
            createdBy: req.user._id,
        });

        return res.status(201).json({ message: "subCategory created successfully", subCategory });

    } catch (error) {
        console.error('Cloudinary Upload Error:', error.message);
        return next(new AppError(`Cloudinary Upload Error: ${error.message}`, 500));
    }
});




//========== updateSubCategory ===========//
export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id);
    if (!subCategory) {
        return next(new AppError("This subcategory doesn't exist", 409));
    }
    // Update the name if provided
    if (name) {
        // Check if the new name is different from the current name
        if (name.toLowerCase() === subCategory.name) {
            return next(new AppError("Please, use another subcategory name.", 400));
        }
        // Check if the name already exists
        if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("This subcategory name already exists", 409));
        }
        subCategory.name = name.toLowerCase();
        subCategory.slug = slugify(name, {
            replacement: "_",
            lower: true
        });
    }
    // Update the image if provided
    if (req.file) {
        // Delete the old image from Cloudinary
        if (subCategory.image && subCategory.image.public_id) {
            await cloudinary.uploader.destroy(subCategory.image.public_id);
        }
        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/Categories/${subCategory.category}/subCategories/${subCategory.customId}`
        });
        subCategory.image = { secure_url, public_id };
    }
    // Save the updated subcategory
    await subCategory.save();
    // Send a successful response
    return res.status(200).json({ message: "SubCategory updated successfully", subCategory });
});



//========== deleteSubCategory ===========//
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Find the subcategory by ID and ensure it exists
    const subCategory = await subCategoryModel.findOne({ _id: id, createdBy: req.user._id });
    if (!subCategory) {
        return next(new AppError("This subcategory doesn't exist", 404));
    }
    // Delete the image associated with the subcategory from Cloudinary
    if (subCategory.image && subCategory.image.public_id) {
        await cloudinary.uploader.destroy(subCategory.image.public_id);
    }
    // Delete the subcategory from the database
    await subCategoryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Subcategory deleted successfully" });
});


//========== getSubCategories ===========//
export const getSubCategories = asyncHandler(async (req, res, next) => {
    const subcategories = await subCategoryModel.find({})
    // .populate([
    //    {
    //     path: "category",
    //     select:"name - _id"
    //    } ,
    //    {
    //     path: "createdBy",
    //     select:"name - _id"
    //    }
    // ]);
    res.status(201).json({message: " Done " , subcategories });
});


//========== getSubcategoriesWithPagination ===========//
export const getSubcategoriesWithPagination = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const subcategories = await subCategoryModel.find()
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.status(200).json({ message:" This request retrieves the second page with 5 subcategories per page.", subcategories });
});




//========== HowManySubCategories ===========//
export const getSubcategoriesCount = asyncHandler(async (req, res, next) => {
    const count = await subCategoryModel.countDocuments();
    res.status(200).json({ count });
});






