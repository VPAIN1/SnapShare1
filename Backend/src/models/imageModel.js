import mongoose from "mongoose";
import User from '../models/userModel.js';

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        }
    },
    { timestamps: true }
);

const ImageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        ImageName: { 
            type: String, 
            required: true 
        },
        ImageDesc: { 
            type: String, 
            required: true 
        },
        Img: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true }
            }
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: [commentSchema],
        sharesCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export const Images = mongoose.model("Images", ImageSchema);