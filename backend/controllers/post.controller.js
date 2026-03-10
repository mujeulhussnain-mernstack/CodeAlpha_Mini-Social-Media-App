import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";

export const AddPost = async (req, res) => {
  try {
    const authorId = req.id;
    const image = req.params.id;
    const { caption } = req.body;
    const user = await User.findById(authorId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (!image || !image.buffer) {
      return res
        .status(400)
        .json({ message: "Image required", success: false });
    }
    const optimizedImage = await sharp(image.buffer)
      .resize(1200, 800, { fit: "inside" })
      .toFormat("jpeg", { quality: 90 })
      .toBuffer();
    const dataUri = `data:image/jpeg;base64,${optimizedImage.toString("base64")}`;
    const cloudResponse = await cloudinary.uploader.upload(dataUri);
    if (cloudResponse) {
      const post = await Post.create({
        postAuthor: authorId,
        image: cloudResponse.secure_url,
        caption: caption || "",
      });
      await user.posts.push(post._id);
      await user.save();
      return res
        .status(400)
        .json({ message: "Post added", success: true, post });
    }
  } catch (error) {
    console.log("Error in add post controller :", error);
  }
};

export const DeletePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    // Check if post exists and get author
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user is the post author
    if (user._id.toString() !== post.postAuthor.toString()) {
      return res.status(403).json({
        // Changed to 403
        message: "Only post author can delete this post",
        success: false,
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Remove post reference from user's posts array
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId },
    });

    // Optional: Delete associated comments
    if (post.comments && post.comments.length > 0) {
      await Comment.deleteMany({ _id: { $in: post.comments } });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in delete post controller:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const GetAllPosts = async (_, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postAuthor", "username profilePicture") // Add author details
      .limit(20); // Reasonable limit

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log("Error in get all posts controller:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const AddOrRemovePostLike = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    // Find user and post
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const isAlreadyLiked = post.likes.includes(userId);

    if (isAlreadyLiked) {
      // remove like from the post
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }, // Return updated document
      );

      return res.status(200).json({
        message: "Post unliked successfully",
        success: true,
      });
    } else {
      // Like post
      await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true },
      );

      return res.status(200).json({
        message: "Post liked successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error in add or remove post like controller:", error);
  }
};

export const AddComment = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    // Validate text
    if (!text || text.trim() === "") {
      return res.status(400).json({
        // 400 Bad Request
        message: "Comment text is required",
        success: false,
      });
    }

    // Optional: Limit comment length
    if (text.length > 500) {
      return res.status(400).json({
        message: "Comment must be less than 500 characters",
        success: false,
      });
    }

    // Check if user exists
    const user = await User.findById(userId).select("username profilePicture");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Create comment
    const comment = await Comment.create({
      postId,
      text: text.trim(),
      userId,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });
    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "username profilePicture",
    );

    return res.status(201).json({
      // 201 Created
      message: "Comment added successfully",
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    console.log("Error in add comment controller:", error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Get comments for this post directly (more efficient)
    const comments = await Comment.find({ postId: postId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePicture");

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      comments,
    });
  } catch (error) {
    console.log("Error in get comments of post:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
