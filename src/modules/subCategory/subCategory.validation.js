import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const subCategoryCreationValidationSchema = {
    body:joi.object({
        name:joi.string().min(3).required(),
        category: generalField.id.required()
    }).required() ,
    file: generalField.file,
    headers: generalField.headers.required()
}


export const subCategoryUpdateValidationSchema = {
    body:joi.object({
        name:joi.string().min(3),
        // category: generalField.id.required()
    }).required() ,
    file: generalField.file,
    headers: generalField.headers.required()
}


export const deleteSubCategoryValidationSchema = {
    params: joi.object({
        id: generalField.id.required()
    }),
    headers: generalField.headers.required()
};

export const getSubcategoriesWithPaginationValidation = {
    query: joi.object({
        page: joi.number().integer().min(1).default(1),
        limit: joi.number().integer().min(1).default(10)
    })
};

