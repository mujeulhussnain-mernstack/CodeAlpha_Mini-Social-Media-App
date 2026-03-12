import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_END_POINT } from "../constants";
import axios from "axios";
import Loader from "../components/Loader";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    image: null,
    caption: "",
  });
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputData({ ...inputData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputData.image) {
      toast.error("Please select an image", { autoClose: 500 });
      return;
    }

    const formData = new FormData();
    formData.append("image", inputData.image);
    formData.append("caption", inputData.caption);
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_END_POINT}/post/addpost`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data?.message || "Post created successfully!", {
          autoClose: 500,
        });
        // Reset form
        setInputData({ image: null, caption: "" });
        setPreview(null);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create post";
      toast.error(message, { autoClose: 500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 space-y-6"
      >
        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="text-gray-300 font-medium block">
            Upload Image
          </label>

          <div className="flex flex-col items-center gap-4">
            {/* Preview */}
            {preview ? (
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-64 object-cover rounded-xl border-2 border-purple-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setInputData({ ...inputData, image: null });
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-500/30 rounded-xl cursor-pointer hover:border-purple-500 transition-all duration-300 bg-[#0a0a12]"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-12 h-12 mb-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold text-purple-400">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Caption Section */}
        <div className="space-y-3">
          <label htmlFor="caption" className="text-gray-300 font-medium block">
            Caption
          </label>
          <textarea
            id="caption"
            value={inputData.caption}
            onChange={(e) =>
              setInputData({ ...inputData, caption: e.target.value })
            }
            placeholder="Write a caption for your post..."
            rows="4"
            maxLength="500"
            className="w-full px-4 py-3 rounded-xl bg-[#0a0a12] border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
          />
          <p className="text-xs text-gray-500 text-right">
            {inputData.caption.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !inputData.image}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center min-h-[48px]"
          >
            {loading ? <Loader size="sm" /> : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
