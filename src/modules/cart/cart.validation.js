import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const cartCreationValidationSchema = {
    body:joi.object({
        productId:generalField.id.required(),
        quantity: joi.number().integer().required()
    }).required() ,
    headers: generalField.headers.required()
}

export const cartRemoveValidationSchema = {
    body:joi.object({
        productId:generalField.id.required(),
    }).required() ,
    headers: generalField.headers.required()
}

export const cartClearValidationSchema = {
    headers: generalField.headers.required()
}
