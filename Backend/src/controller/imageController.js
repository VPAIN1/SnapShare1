import { Images } from "../models/imageModel.js";
import { uploadFile, deleteFile } from "../services/imageKit.js";


export const addImage = async (req, res) => {
    try {
        const { ImageName, ImageDesc } = req.body;
        const userId = req.id; 
        const userEmail = req.user?.email;

        if (!ImageName || !ImageDesc) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let Img = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await uploadFile(file.buffer, file.originalname);

                Img.push({
                    url: result.url,
                    public_id: result.fileId
                });
            }
        }

        const newImage = await Images.create({
            userId,
            userEmail,
            ImageName,
            ImageDesc,
            Img
        });

        return res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            image: newImage
        });

    } catch (error) {
        console.error("Error adding Image:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getAllImages = async (_, res) => {
    try {
        const images = await Images.find();

        if (!images || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Posts now available",
                images: []
            });
        }

        return res.status(200).json({
            success: true,
            images : images
        });

    } catch (error) {
        console.error("Error fetching images:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const myposts = async (req, res) => {
    try {
        const userId = req.id; 
        const images = await Images.find({ userId });

        if (!images || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Upload posts ",
                images: []
            });
        }

        return res.status(200).json({
            success: true,
            images : images
        });

    } catch (error) {
        console.error("Error fetching user's images:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const userId = req.id;

        const image = await Images.findById(imageId);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (image.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image"
            });
        }

        if (image.Img && image.Img.length > 0) {
            for (let img of image.Img) {
                if (img.public_id) {
                    try {
                        await deleteFile(img.public_id);
                    } catch (imageError) {
                        console.error(`Failed to delete image ${img.public_id} from ImageKit:`, imageError.message);
                    }
                }
            }
        }

        await Images.findByIdAndDelete(imageId);
        
        return res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        });
        
    } catch (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};