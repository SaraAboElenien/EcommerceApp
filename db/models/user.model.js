import mongoose from 'mongoose';

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
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    code: { type: String }

}, {
    timestamps: true,
    versionKey: false
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
