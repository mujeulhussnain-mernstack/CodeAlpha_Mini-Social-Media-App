import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    postAuthor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String, required: true },
    caption: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
