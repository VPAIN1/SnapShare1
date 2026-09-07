import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import cookieParser from "cookie-parser";

export const isAuth = async (req, res, next) => {
    const token = req.cookies.token || req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Require Login"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.id = user._id;
        req.user = user; 

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authentication token has expired. Please log in again."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};