import { generalField } from "../../../utils/generalFields.js"
import joi from 'joi';


export const categoryCreationValidationSchema = {
    body:joi.object({
        name:joi.string().min(3).required()
    }).required() ,
    file: generalField.file,
    headers: generalField.headers.required()
}


export const categoryUpdateValidationSchema = {
    body:joi.object({
        name:joi.string().min(3)
    }).required() ,
    file: generalField.file,
    headers: generalField.headers.required()
}


export const categoryDeleteValidationSchema = {
    params: joi.object({
        id: generalField.id.required() 
    }).required(),
    headers: generalField.headers.required()

};