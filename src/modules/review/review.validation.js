import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const reviewCreationValidationSchema = {
    body:joi.object({
        comment:joi.string().required(),
        rate: joi.number().min(1).max(5).integer().required(),
    }).required() ,
    params: joi.object({
        productId: generalField.id.required()
    }).required(),
    headers: generalField.headers.required()
}


export const reviewdeleteValidationSchema = {
    params: joi.object({
        id : generalField.id.required()
    }).required(),
    headers: generalField.headers.required()
}

