import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: {
        type: String,
        enum: ["User", "admin"],
        default: "User"
    },
    token: { type: String, default: null },
    isverified: { type: Boolean, default: false },
    isloggedin: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    phoneNumber: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    facebook: { type: String, trim: true, default: "" },
    otherPlatform: { type: String, trim: true, default: "" }
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

export default User;