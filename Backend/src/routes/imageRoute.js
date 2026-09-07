import express from 'express';
import { addImage , getAllImages , myposts , deleteImage } from '../controller/imageController.js';
import { isAuth } from '../middleware/isAuth.js'
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post("/addimage",isAuth,upload.array("files", 5),addImage);
router.get("/getallposts",isAuth,getAllImages);
router.get("/myposts",isAuth,myposts);
router.delete("/deletepost/:imageId",isAuth,deleteImage);


export default router;