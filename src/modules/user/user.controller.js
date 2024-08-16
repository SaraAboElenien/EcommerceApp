import bcryptjs from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';
import userModel from '../../../db/models/user.model.js';
import { sendEmail } from '../../../service/sendEmail.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt'
import { asyncHandler } from '../../../utils/globleErrorHandling.js';
import { AppError } from '../../../utils/classError.js';

const { compare, hash } = bcryptjs;
const { sign } = jsonwebtoken;


//========== Registration ===========//
export const signUp = asyncHandler(async (req, res, next) => {

    const { firstName, lastName, email, password, mobileNumber, DOB, address } = req.body;
    const userExist = await userModel.findOne({ email: email.toLowerCase() });
    if (userExist) {
        return res.status(409).json({ message: "This email is already registered!, please use another email!" });
    } else {

        const token = jwt.sign({ email },process.env.confirmationKey, { expiresIn: 60 * 2 })
        const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/user/cofirmEmail/${token}`

        const refreshToken = jwt.sign({ email }, process.env.confirmationKeyRefresher)
        const confirmationLinkRefresher = `${req.protocol}://${req.headers.host}/api/v1/auth/user/cofirmEmailRefresher/${refreshToken}`



        const checkEmail = await sendEmail(email, "Confirm email address", `<a href='${confirmationLink}'> Confirm your email</a> <br>
          <a href='${confirmationLinkRefresher}'> Click to resend the link</a>  `)
        if (!checkEmail) {
            next(new AppError("Failed to send email", 409))
        }
        const hashedPassword = await hash(password,parseInt(process.env.saltRounds));
        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            mobileNumber,
            DOB,
            address
        };

        await userModel.create(newUser);
        newUser ? res.status(201).json({ message: "Congrats! You're registered", newUser }) : next(new AppError("Failed to register!", 500));
    }
})

//======== Email confirmation ==========//
export const confirmEmail = async (req, res, next) => {
        const { token } = req.params;
        const decoded = jwt.verify(token, 'cofirmationSignature');
        if (!decoded?.email) {
            return next(new AppError("Invalid payload", 400))
        }
        const user = await userModel.findOneAndUpdate({ email: decoded.email , confirmed: false}, { confirmed: true } ,{ new: true } );
        if(!user){
         return next(new AppError("Your email is already confirmed", 400))
        }
        res.status(200).json({ message: "Your Email got confirmed <3", user });
};


//======== Email confirmation refresher==========//
export const refreshConfirmation = async (req, res, next) => {
    const { refreshToken } = req.params;
    const decoded = jwt.verify(refreshToken, process.env.confirmationKeyRefresher);
    if (!decoded?.email) {
        return next(new AppError("Invalid payload", 400))
    }
    const user = await userModel.findOne({ email: decoded.email , confirmed: true} );
    if(user){
     return next(new AppError("Your email is already confirmed", 400))
    }

    const token = jwt.sign({ email:decoded.email }, process.env.confirmationKey, { expiresIn: 60 * 2 })
    const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/user/cofirmEmail/${token}`

    await sendEmail(decoded.email, "Confirm email address", `<a href='${confirmationLink}'> Confirm your email</a>`)
    res.status(200).json({ message: "Your Email got confirmed <3", user });
};

