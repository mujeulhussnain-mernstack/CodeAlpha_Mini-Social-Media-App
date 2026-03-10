import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    text: { type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
