import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const orderCreationValidationSchema = {
    body:joi.object({
        productId:generalField.id,
        quantity: joi.number().integer(),
        phone: joi.string().required(),
        address: joi.string().required(),
        couponCode: joi.string().min(3),
        paymentMethod: joi.string().valid("Pay with credit or debit card", "Cash on delivery").required() 
    }).required() ,
    headers: generalField.headers.required()
}


export const orderCancellationValidationSchema = {
    body: joi.object({
        reason: joi.string().min(3),
    }),
    params: joi.object({
        id: generalField.id.required()
    }).required(),
    headers: generalField.headers.required(),
};
