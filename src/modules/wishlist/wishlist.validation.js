import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';



export const wishlistCreationValidationSchema = {
    params: joi.object({
        productId : generalField.id.required()
    }).required(),
    headers: generalField.headers.required()
}

export const removeFromWishlistValidationSchema = {
    params: joi.object({
        productId: generalField.id.required(),
    }).required(),
    headers: generalField.headers.required()
};