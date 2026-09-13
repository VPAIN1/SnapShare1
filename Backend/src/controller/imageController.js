import { Images } from "../models/imageModel.js";
import { uploadFile, deleteFile } from "../services/imageKit.js";
import User from "../models/userModel.js";


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

        const currentUser = await User.findById(userId);
        const userProfilePic = currentUser?.profilepic || "";

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
            userProfilePic,
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


export const getAllImages = async (req, res) => {
    try {
        const images = await Images.find()
            .populate("userId", "email profilepic firstName lastName")
            .populate({
                path: "comments.userId",
                select: "email profilepic firstName lastName"
            })
            .sort({ createdAt: -1 });

        if (!images || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Posts now available",
                images: []
            });
        }

        return res.status(200).json({
            success: true,
            images: images
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

        const images = await Images.find({ userId })
            .populate("userId", "email profilepic firstName lastName")
            .sort({ createdAt: -1 });

        if (!images || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Upload posts ",
                images: []
            });
        }

        return res.status(200).json({
            success: true,
            images: images
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

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const post = await Images.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        const isLike = post.likes.includes(userId);

        if (isLike) {
            post.likes.pull(userId);
        }
        else {
            post.likes.push(userId);
        }

        await post.save();

        const io = req.app.get("socketio");
        io.emit("post-liked", { postId: post._id, likes: post.likes });

        return res.status(200).json({ success: true, likes: post.likes });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.id;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Comment text cannot be empty" });
        }

        const post = await Images.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        post.comments.push({
            userId: userId,
            text: text
        });
        await post.save();

        const updatedPost = await Images.findById(id).populate({
            path: "comments.userId",
            select: "email profilepic firstName lastName"
        });

        const savedComment = updatedPost.comments[updatedPost.comments.length - 1];

        const io = req.app.get("socketio");
        io.emit("comment-added", { postId: post._id, comments: updatedPost.comments });

        return res.status(201).json({
            success: true,
            comment: savedComment,
            comments: updatedPost.comments
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const sharePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Images.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        post.sharesCount += 1;
        await post.save();

        const io = req.app.get("socketio");
        io.emit("post-shared", { postId: post._id, sharesCount: post.sharesCount });

        return res.status(200).json({ success: true, sharesCount: post.sharesCount });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const userId = req.id;

        const post = await Images.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this comment"
            });
        }

        post.comments.pull(commentId);
        await post.save();

        const updatedPost = await Images.findById(id).populate({
            path: "comments.userId",
            select: "email profilepic firstName lastName"
        });

        const io = req.app.get("socketio");
        if (io) {
            io.emit("comment-deleted", {
                postId: post._id,
                comments: updatedPost.comments
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            comments: updatedPost.comments
        });

    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};