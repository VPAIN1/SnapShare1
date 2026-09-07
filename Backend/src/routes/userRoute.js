import express from 'express';
import { registerUser , verify , loginUser , logout ,getUserProfile,updateuserprofile ,forgetPassword ,changePassword ,verifyOTP} from '../controller/userController.js';
import { isAuth } from '../middleware/isAuth.js'

const router = express.Router();

router.post("/register",registerUser);
router.post("/verify",verify);
router.post("/login",loginUser);
router.post("/logout",isAuth,logout);
router.get("/getuserprofile",isAuth,getUserProfile);
router.patch("/update-profile",isAuth,updateuserprofile);
router.post("/forget-password",forgetPassword);
router.post("/change-password/:email",changePassword);
router.post("/verify-otp/:email",verifyOTP);

export default router;