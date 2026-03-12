import express from "express";
import { AddPost } from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// router.route("/register").post(Register);
// router.route("/login").post(Login);
// router.route("/logout").post(Logout);
// router.route("/getsuggestedusers").post(isAuthenticated, GetSuggestedUsers);
// router.route("/followorunfollow/:id").post(isAuthenticated, FollowOrUnfollow);
router
  .route("/addpost")
  .post(isAuthenticated, upload.single("image"), AddPost);

export default router;
