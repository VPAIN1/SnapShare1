import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {

        const allowedExtensions = /jpeg|jpg|png|webp|mp4|mov|webm|avi/;
        const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
        
        const mimetype = file.mimetype.startsWith("image/") || 
                         file.mimetype.startsWith("video/") || 
                         file.mimetype === "application/octet-stream";

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed!"), false);
        }
    }
});