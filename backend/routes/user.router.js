import express from "express";
import upload from "../middlewares/multer.js";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  validateOtp,
  setNewPassword,
  getRoomDetails,
  updateProfile,

} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/otp-verification", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.post("/password/validate-otp", validateOtp);
router.put("/password/set-new", setNewPassword);
router.get("/room/details/:managerKey",isAuthenticated, getRoomDetails);
router.put("/update-profile", isAuthenticated, upload.single("profilePic"), updateProfile);

export default router;