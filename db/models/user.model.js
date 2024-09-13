import mongoose from 'mongoose';
import { systemRoles } from '../../utils/systemRoles.js';
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "firstName is required"],
    },
    lastName: {
        type: String,
        required: [true, "lastName is required"],
    },
    username: {
        type: String,
        unique: [true, "username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: { type: String },
    DOB: { type: Date, required: true },
    mobileNumber: {
        type: String,
        required: true, unique: true
    },
    address: [String],
    role: { type: String,
         enum: Object.values(systemRoles),
         default: systemRoles.user},
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    code: { type: String },
    passwordChangedAt: Date

}, {
    timestamps: true,
    versionKey: false
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
