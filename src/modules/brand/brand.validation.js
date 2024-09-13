import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const brandCreationValidationSchema = {
    body:joi.object({
        name:joi.string().min(3).required(),
    }).required() ,
    file: generalField.file,
    headers: generalField.headers.required()
}


export const brandUpdateValidationSchema = {
    body:joi.object({
        name:joi.string().min(3)
    }).required() ,
    file: generalField.file,
    headers: generalField.headers.required()
}

export const brandDeleteValidationSchema = {
    params: joi.object({
        id: generalField.id.required() 
    }).required(),
    headers: generalField.headers.required()

};

// export const getAllBrandsValidationSchema = {
//     query: joi.object({
//         page: joi.number().integer().min(1).default(1),
//         limit: joi.number().integer().min(1).default(10)
//     })
// };

export const getBrandValidation = {
    params: joi.object({
        id: joi.string().required()
    })
};


export const filterBrandsValidationSchema = {
    query: joi.object({
        name: joi.string().min(2).max(50).optional(),
        createdBy: joi.string().optional(),  // Validates a MongoDB ObjectId
        // slug: joi.string().optional(),
        // page: joi.number().integer().min(1).default(1).optional(),
        // limit: joi.number().integer().min(1).default(10).optional(),
    })
};
