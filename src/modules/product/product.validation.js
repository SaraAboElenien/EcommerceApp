import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const productCreationValidationSchema = {
    body: joi.object({
        title: joi.string().min(3).required(),
        category: generalField.id.required(),
        brand: generalField.id.required(),
        discount: joi.number().min(1).max(100),
        stock: joi.number().min(1).integer().required(),
        price: joi.number().min(1).integer().required(),
        subCategory: generalField.id.required(),
        description: joi.string()
    }).required(),
    files: joi.object({
        image: joi.array().items(generalField.file.required()).required(),
        coverImages: joi.array().items(generalField.file.required()).required(),
    }).required(),
    headers: generalField.headers.required()
}


export const productUpdateValidationSchema = {
    body: joi.object({
        title: joi.string().min(3),
        category: generalField.id,
        brand: generalField.id,
        discount: joi.number().min(1).max(100),
        stock: joi.number().min(1).integer(),
        price: joi.number().min(1).integer(),
        subCategory: generalField.id,
        description: joi.string()
    }),
    files: joi.object({
        image: joi.array().items(generalField.file),
        coverImages: joi.array().items(generalField.file),
    }),
    headers: generalField.headers.required()
};


export const productDeleteValidationSchema = {
    params: joi.object({
        id: generalField.id.required()
    }),
    headers: generalField.headers.required()
};

// export const searchProductValidation = {
//     query: joi.object({
//         search: joi.string().min(1).optional(),
//         id: generalField.id.optional(),
//         brand: generalField.id.optional(),
//     }).or('search', 'id', 'brand').required(),
// };