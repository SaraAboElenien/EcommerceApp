import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const couponCreationValidationSchema = {
    body:joi.object({
        code:joi.string().min(3).max(30).required(),
        amount: joi.number().min(1).max(100).integer().required(),
        fromDate:joi.date().greater(Date.now()).required(),
        toDate: joi.date().greater(joi.ref("fromDate")).required(),
    }).required() ,
    headers: generalField.headers.required()
}


export const couponUpdateValidationSchema = {
    body:joi.object({
        code:joi.string().min(3).max(30),
        amount: joi.number().min(1).max(100).integer(),
        fromDate:joi.date().greater(Date.now()),
        toDate: joi.date().greater(joi.ref("fromDate")),
    }).required() ,
    headers: generalField.headers.required()
}

export const couponDeleteValidationSchema = {
    params: joi.object({
        id: generalField.id.required() 
    }).required(),
    headers: generalField.headers.required()

};

// // export const getAllBrandsValidationSchema = {
// //     query: joi.object({
// //         page: joi.number().integer().min(1).default(1),
// //         limit: joi.number().integer().min(1).default(10)
// //     })
// // };

// export const getBrandValidation = {
//     params: joi.object({
//         id: joi.string().required()
//     })
// };


// export const filterBrandsValidationSchema = {
//     query: joi.object({
//         name: joi.string().min(2).max(50).optional(),
//         createdBy: joi.string().optional(),  // Validates a MongoDB ObjectId
//         // slug: joi.string().optional(),
//         // page: joi.number().integer().min(1).default(1).optional(),
//         // limit: joi.number().integer().min(1).default(10).optional(),
//     })
// };
