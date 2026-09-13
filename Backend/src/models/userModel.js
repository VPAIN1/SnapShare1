import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilepic: { type: String, default: "" },
    profilepicpublicid: { type: String, default: "" },
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

const User = mongoose.model('User', userSchema);

export default User;