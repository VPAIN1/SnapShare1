import express from 'express';
import { addImage , getAllImages , myposts , deleteImage ,toggleLike, addComment, sharePost ,deleteComment } from '../controller/imageController.js';
import { isAuth } from '../middleware/isAuth.js'
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post("/addimage",isAuth,upload.array("files", 5),addImage);
router.get("/getallposts",isAuth,getAllImages);
router.get("/myposts",isAuth,myposts);
router.delete("/deletepost/:imageId",isAuth,deleteImage);
router.post("/:id/like", isAuth, toggleLike);
router.post("/:id/comment", isAuth, addComment);
router.post("/:id/share", isAuth, sharePost);
router.delete("/:id/comment/:commentId", isAuth, deleteComment);

export default router;