import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userEmail: { 
            type: String, 
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
    },
    { timestamps: true }
);

export const Images = mongoose.model("Images", ImageSchema);