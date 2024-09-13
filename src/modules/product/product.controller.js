import productModel from '../../../db/models/product.model.js';
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import cloudinary from '../../../utils/cloudinary.js';
import categoryModel from '../../../db/models/category.model.js';
import subCategoryModel from '../../../db/models/subCategory.model.js'
import brandModel from '../../../db/models/brand.model.js';
import { ApiFeatures } from '../../../utils/ApiFeatures.js';

//========== createProduct ===========//
export const createProduct = asyncHandler(async (req, res, next) => {
    const { title, category, brand, discount, stock, price, subCategory, description } = req.body;

    // Check if the category, subCategory, and brand exist
    const categoryExist = await categoryModel.findOne({ _id: category });
    if (!categoryExist) {
        return next(new AppError("This category doesn't exist", 404));
    }

    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
    if (!subCategoryExist) {
        return next(new AppError("This subCategory doesn't exist", 404));
    }

    const brandExist = await brandModel.findOne({ _id: brand });
    if (!brandExist) {
        return next(new AppError("This brand doesn't exist", 404));
    }

    // Check if the product already exists
    const productExist = await productModel.findOne({ title: title.toLowerCase() });
    if (productExist) {
        return next(new AppError("This product already exists", 404));
    }

    // Calculate the price after applying the discount
    const subPrice = price - ((discount || 0) / 100) * price;

    // Check if files are provided
    if (!req.files) {
        return next(new AppError("Image field is required!", 404));
    }

    const customId = nanoid(5);
    let list = [];
    for (const file of req.files.coverImages) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: `Ecommerce/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}`
        });

        const { secure_url, public_id } = uploadResult;

        if (!secure_url || !public_id) {
            return next(new AppError('Missing secure_url or public_id in Cloudinary response', 500));
        }

        list.push({ secure_url, public_id });
    }

    const product = await productModel.create({
        title,
        slug: slugify(title, {
            replacement: "_",
            lower: true
        }),
        category,
        brand,
        discount,
        stock,
        price,
        subCategory,
        description,
        subPrice,
        coverImages: list,
        customId,
        createdBy: req.user._id
    });

    return res.status(201).json({ message: "Product created successfully", product });
});



//========== updateProduct ===========//
export const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, category, brand, discount, stock, price, subCategory, description } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
        return next(new AppError("This product doesn't exist", 404));
    }

    // Update title and slug if provided
    if (title) {
        product.title = title.toLowerCase();
        product.slug = slugify(title, {
            replacement: "_",
            lower: true
        });
    }

    // Update category if provided
    if (category) {
        const categoryExist = await categoryModel.findById(category);
        if (!categoryExist) {
            return next(new AppError("This category doesn't exist", 404));
        }
        product.category = category;
    }

    // Update subCategory if provided and it belongs to the same category
    if (subCategory) {
        const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category: product.category });
        if (!subCategoryExist) {
            return next(new AppError("This subCategory doesn't exist", 404));
        }
        product.subCategory = subCategory;
    }

    // Update brand if provided
    if (brand) {
        const brandExist = await brandModel.findById(brand);
        if (!brandExist) {
            return next(new AppError("This brand doesn't exist", 404));
        }
        product.brand = brand;
    }

    // Update discount if provided
    if (discount !== undefined) {
        product.discount = discount;
    }

    // Update stock if provided
    if (stock !== undefined) {
        product.stock = stock;
    }

    // Update price and subPrice if provided
    if (price !== undefined) {
        product.price = price;
        product.subPrice = price - (price * (discount || 0) / 100);
    }

    // Update description if provided
    if (description) {
        product.description = description;
    }

    // Update images if new ones are provided
    if (req.files && req.files.coverImages) {
        // Delete old images from Cloudinary
        for (const image of product.coverImages) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        // Upload new images
        let newImages = [];
        for (const file of req.files.coverImages) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: `Ecommerce/Categories/${product.category}/subCategories/${product.subCategory}/products/${product.customId}`
            });
            newImages.push({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id });
        }

        product.coverImages = newImages;
    }

    if (req.files && req.files.image) {
        // Delete old main image from Cloudinary
        if (product.image && product.image.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }

        // Upload new main image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
            folder: `Ecommerce/Categories/${product.category}/subCategories/${product.subCategory}/products/${product.customId}`
        });

        product.image = { secure_url, public_id };
    }

    await product.save();

    return res.status(200).json({ message: "Product updated successfully", product });
});







//========== deleteProduct ===========//
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
        return next(new AppError("This product doesn't exist", 404));
    }

    // Delete images from Cloudinary
    if (product.image && product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
    }

    if (product.coverImages && product.coverImages.length) {
        for (const image of product.coverImages) {
            await cloudinary.uploader.destroy(image.public_id);
        }
    }

    // Delete the product from the database
    await productModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully" });
});




//========== getProducts ===========//
export const getProducts = asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(productModel.find(), req.query)

        .pagination()
        .select()
        .filter()
        .search()
        .sort()

    const products = await apiFeatures.mongooseQuery

    res.status(200).json({ message: "Products found", page: apiFeatures.page, products });
});

// GET http://localhost:3000/api/v1/product/get?page=2 (  by default: page=1 ) => pagination
// GET http://localhost:3000/api/v1/product/get?page=1&price=1600  ( filtration using price = 1600 )
//http://localhost:3000/api/v1/product/get?search=n  ( search by only a character(n) it gets me the product the has (n) )
// http://localhost:3000/api/v1/product/get?sort=stock ( sort= stock & discount etc ...)
//http://localhost:3000/api/v1/product/get?select=title ( select by title it only gets me the ( id & its title ) i can select with another key.)