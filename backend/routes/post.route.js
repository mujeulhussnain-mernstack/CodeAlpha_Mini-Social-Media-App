import express from "express";
import {
  AddComment,
  AddOrRemovePostLike,
  AddPost,
  DeletePost,
  GetAllPosts,
  getCommentsOfPost,
} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/getallposts").get(isAuthenticated, GetAllPosts);
router.route("/getcommentsofpost/:id").get(isAuthenticated, getCommentsOfPost);
router.route("/addcomment/:id").post(isAuthenticated, AddComment);
router.route("/delete/:id").get(isAuthenticated, DeletePost);
router.route("/likeordislike/:id").get(isAuthenticated, AddOrRemovePostLike);
router.route("/addpost").post(isAuthenticated, upload.single("image"), AddPost);

export default router;
