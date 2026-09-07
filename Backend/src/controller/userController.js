import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { verifyEmail } from '../utils/verifyEmail.js';
import { forgetpasswordotp } from "../utils/forgetpasswordotp.js";

dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All data is require"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User of This email already exits"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            isverified: false
        });

        await verifyEmail(email, otp);

        return res.status(201).json({
            success: true,
            message: "Registration successful. OTP sent to your email.",
            email: newUser.email
        })

    } catch (error) {
        console.error("Error registering user:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const verify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP.",
                reverify: true
            });
        }

        user.isverified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("Error verifying OTP:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        if (!user.isverified) {
            return res.status(403).json({ message: 'Email not verified. Please verify your email.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, { httpOnly: true, maxAge: 10 * 24 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 1000 });

        user.isloggedin = true;
        await user.save();

        const existingsession = await Session.findOne({ userId: user._id });
        if (existingsession) {
            await Session.deleteOne({ userId: user._id });
        }

        await Session.create({ userId: user._id });
        return res.status(200).json({ message: `Login successful ${user.firstName}`, token, refreshToken, user: user });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    try {
        const userId = req.user._id;

        await Session.deleteOne({ userId });

        res.clearCookie('token');
        res.clearCookie('refreshToken');

        await User.findByIdAndUpdate(userId, { isloggedin: false });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id; 

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateuserprofile = async (req, res) => {
    try {
        const Userid = req.id;
        const { firstName, lastName, phoneNumber, instagram, facebook, otherPlatform } = req.body;

        const Updateuser = await User.findByIdAndUpdate(
            Userid,
            {
                firstName,
                lastName,
                phoneNumber,
                instagram,
                facebook,
                otherPlatform
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!Updateuser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: Updateuser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();

        await forgetpasswordotp(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to email"
        });

    } catch (error) {

        console.error("FORGET PASSWORD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error("Error verifying OTP:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};