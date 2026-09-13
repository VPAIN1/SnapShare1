import express from 'express';
import { registerUser , verify , loginUser , logout ,getUserProfile,updateuserprofile ,forgetPassword ,changePassword ,verifyOTP , profileviewer , updateProfilePic, postsviewer} from '../controller/userController.js';
import { isAuth } from '../middleware/isAuth.js'
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post("/register",registerUser);
router.post("/verify",verify);
router.post("/login",loginUser);
router.post("/logout",isAuth,logout);
router.get("/getuserprofile",isAuth,getUserProfile);
router.patch("/update-profile", isAuth, updateuserprofile);
router.patch("/update-profile-pic", isAuth, upload.single('profilepic'), updateProfilePic);
router.post("/forget-password",forgetPassword);
router.post("/change-password/:email",changePassword);
router.post("/verify-otp/:email",verifyOTP);
router.get("/profileviewer/:email",isAuth,profileviewer);
router.get("/postsviewer/:email",isAuth,postsviewer);

export default router;