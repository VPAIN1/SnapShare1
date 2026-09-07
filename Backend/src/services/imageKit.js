import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile(buffer, originalFileName = "image.jpg", oldFileId = null) {
    try {

        if (oldFileId) {
            try {
                await imagekit.files.delete(oldFileId);
                console.log("Old profile picture deleted successfully from ImageKit");
            } catch (err) {
                console.error("Failed to delete old image from ImageKit:", err.message);
            }
        }

        const fileParam = await toFile(buffer, originalFileName);
        const result = await imagekit.files.upload({
            file: fileParam,
            fileName: originalFileName,
        });

        return result;
    } catch (error) {
        console.error("ImageKit SDK Error:", error);
        throw error;
    }
}

export async function deleteFile(fileId) {
    try {
        if (!fileId) return;
        
        await imagekit.files.delete(fileId);
        console.log(`File ${fileId} deleted successfully from ImageKit`);
    } catch (error) {
        console.error(`Failed to delete file ${fileId} from ImageKit:`, error.message);
        throw error;
    }
}