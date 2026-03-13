import express from "express";
import {
  EditProfile,
  FollowOrUnfollow,
  GetProfile,
  GetSuggestedUsers,
  Login,
  Logout,
  Register,
  SearchedUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").post(Logout);
router.route("/getsuggestedusers").post(isAuthenticated, GetSuggestedUsers);
router.route("/followorunfollow/:id").get(isAuthenticated, FollowOrUnfollow);
router
.route("/editprofile")
.post(isAuthenticated, upload.single("profilePicture"), EditProfile);
router.route("/getprofile/:id").get(isAuthenticated, GetProfile);
router.route("/searcheduser").post(isAuthenticated, SearchedUser);

export default router;
