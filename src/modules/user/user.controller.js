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
        const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/user/confirmEmail/${token}`

        const refreshToken = jwt.sign({ email }, process.env.confirmationKeyRefresher)
        const confirmationLinkRefresher = `${req.protocol}://${req.headers.host}/api/v1/auth/user/confirmEmailRefresher/${refreshToken}`



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
        const decoded = jwt.verify(token, process.env.confirmationKey);
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
    const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/user/confirmEmail/${token}`

    await sendEmail(decoded.email, "Confirm email address", `<a href='${confirmationLink}'> Confirm your email</a>`)
    res.status(200).json({ message: "Your Email got confirmed <3", user });
};


//======== forget password =========//
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next( new AppError ("User not valid!", 400))
    }
    const code = nanoid(5);
    await sendEmail(email, "Job search app ", `<h1>Here is your code:${code}</h1>`);
    await userModel.updateOne({ email }, { code });
    res.status(200).json({ message: 'Please check your email for the link..' });
}) 

//=========== Reset password =========//
export const resetPassword = asyncHandler( async (req, res, next) => {
    const { email, code, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next( new AppError ("User not valid!", 400))
    }
    if (user.code !== code) {
        return next( new AppError ("Invalid code!", 400))
    }
    const hashedPassword = await hash(password, parseInt(process.env.saltRounds));
    await userModel.updateOne({ email }, { password: hashedPassword, code: "" , passwordChangedAt:Date.now()})
    res.status(200).json({ message: 'Your password successfully updated.' });
})




//============ sign in =============//
export const signIn = asyncHandler( async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase(), confirmed: true }); //, confirmed: true
    if (!user || !await compare(password, user.password)) {
        next( new AppError ("Invalid email or password", 401))
    }
    const token = sign({ id: user._id, email, role: user.role }, process.env.confirmationKey);
    user.loggedIn = 'true';
    await user.save();

    res.json({ message: 'Signin successful', token });
})




// export const getProfile =  asyncHandler(async (req, res, next) => {
//     res.status(200).json({ message: 'Done', user: req.user });
// })





// export const updateAccount = asyncHandler( async (req, res, next) => {
//     const { email } = req.body;
//     const { token } = req.headers;
//     const decoded = jwt.verify(token, 'Sara2000')
//     if (!decoded) {
//       return next( new AppError ("Token not valid!", 400))
//     }
//     const user = await userModel.findByIdAndUpdate(decoded.id, { email }, { new: true });
//     if (!user) {
//         return next( new AppError ("User not found!", 400))
//     }
//     res.status(200).json({ message: 'Your account updated successfully <3', user });
// })




// export const deleteAccount = asyncHandler(async  (req, res, next) => {
//     const { token } = req.headers;
//     const decoded = jwt.verify(token, 'Sara2000')
//     if (!decoded) {
//         return next( new AppError ("Token not valid!", 400))
//     }
//     const user = await userModel.findByIdAndDelete(decoded.id);
//     if (!user) {
//         return next( new AppError ("User not valid!", 400))
//     }
//     res.status(200).json({ message: 'Your account deleted successfully <3', user });
// }) 




// export const getDataForAnotherUser = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const user = await userModel.findById(id).select('-password');
//     if (!user) {
//         return next( new AppError ("User not valid!", 400))
//     }
//     res.status(200).json({ message: 'Done', user });
// }) 







// export const getByRecoveryEmail = asyncHandler(async (req, res, next) => {
//     const { recoveryEmail } = req.query;
//     if (!recoveryEmail) {
//         return next( new AppError ("Recovery email is required!", 400))
//     }
//     const users = await userModel.find({ recoveryEmail }).select('-password');
//     if (users.length === 0) {
//         return next( new AppError ("No users found with the provided recovery email!", 404))
//     }
//     res.status(200).json({ message: 'Done', users });

// }) 


//========= update password =========// 
// export const updatePassword = asyncHandler( async (req, res) => {
//     const { oldPassword, newPassword } = req.body;
//     if (!oldPassword || !newPassword) {
//         return next( new AppError ("Old password and new password are required!!", 400))
//     }
//         const user = await userModel.findById(req.user._id);
//         if (!user) {
//             return next( new AppError ("User not found", 400))
//         }
//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             return next( new AppError ("Incorrect old password", 401))
//         }
//         user.password = newPassword;
//         await user.save();
//         res.send({ message: 'Password updated successfully' });
// })