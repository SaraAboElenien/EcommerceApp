import categoryModel from '../../../db/models/category.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import cloudinary from '../../../utils/cloudinary.js';
import subCategoryModel from '../../../db/models/subCategory.model.js';




//========== getCategoriesWithSubCategories ===========//
export const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find();
    let list = []
    for (const category of categories) {
        const subCategories = await subCategoryModel.find({ category: category._id })
        const newCategory = category.toObject()
        newCategory.subCategories = subCategories
        list.push(newCategory);
    }
    res.status(201).json({ message: " Done ", categories: list });
});



//========== createCategory ===========//
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const categoryExist = await categoryModel.findOne({ name: name.toLowerCase() });

    if (categoryExist) {
        return next(new AppError("This category already exists", 409));
    }

    if (!req.file) {
        return next(new AppError("Image field is required!", 404));
    }

    const customId = nanoid(5);

    try {
        // Attempt to upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/Categories/${customId}`
        });

        // Log the result of the upload to check if it contains the expected fields
        console.log('Upload Result:', uploadResult);

        // Check if the uploadResult contains secure_url and public_id
        const { secure_url, public_id } = uploadResult;

        if (!secure_url || !public_id) {
            throw new Error('Missing secure_url or public_id in Cloudinary response');
        }

        req.filePath = `Ecommerce/Categories/${customId}` //rollback Delete

        // Proceed with creating the category using the obtained secure_url and public_id
        const category = await categoryModel.create({
            name,
            slug: slugify(name, {
                replacement: "_",
                lower: true
            }),
            image: { secure_url, public_id },
            customId,
            createdBy: req.user._id,
        });

        req.data = {
            model: categoryModel,
            id: category._id
        }



        return res.status(201).json({ message: "Category created successfully", category });

    } catch (error) {
        // Catch any errors during the upload process and return an appropriate error message
        console.error('Cloudinary Upload Error:', error.message);
        return next(new AppError(`Cloudinary Upload Error: ${error.message}`, 500));
    }
});

//========== updateCategory ===========//
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findOne({ _id: id, createdBy: req.user._id });

    if (!category) {
        return next(new AppError("This category doesn't exist", 409));
    }

    if (name) {
        if (name.toLowerCase() === category.name) {
            return next(new AppError("Please, use another category name.", 400));
        }

        if (await categoryModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("This category name already exists", 409));
        }

        category.name = name.toLowerCase();
        category.slug = slugify(name, {
            replacement: "_",
            lower: true
        });
    }

    if (req.file) {
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(category.image.public_id);

        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/Categories/${category.customId}`
        });

        category.image = { secure_url, public_id };
    }

    await category.save();

    // Send a successful response using res.status
    return res.status(200).json({ message: "Category updated successfully", category });
});



//========== deleteCategory ===========//
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Find the category by ID and ensure it was created by the current user
    const category = await categoryModel.findOne({ _id: id, createdBy: req.user._id });

    if (!category) {
        return next(new AppError("This category doesn't exist or you do not have permission to delete it", 404));
    }

    // Delete the image from Cloudinary
    if (category.image && category.image.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
    }

    // Delete the category from the database
    await categoryModel.findByIdAndDelete(id);

    // Send a success response
    return res.status(200).json({ message: "Category deleted successfully" });
});



//========== searchCategories ===========//
export const searchCategories = asyncHandler(async (req, res, next) => {
    const { query } = req.query;
    if (!query) {
        return next(new AppError("Search query is required", 400));
    }
    const categories = await categoryModel.find({
        name: { $regex: query, $options: 'i' } // Case-insensitive search
    });

    if (categories.length === 0) {
        return res.status(404).json({ message: "No categories found matching the search term" });
    }

    res.status(200).json({ categories });
});
