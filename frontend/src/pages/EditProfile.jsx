import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_END_POINT } from "../constants";
import axios from "axios";
import { setAuthUser } from "../store/user.slice.js";
import Loader from "../components/Loader.jsx";

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const authUser = useSelector((store) => store.user?.authUser);
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    profilePicture: authUser?.profilePicture || "",
    bio: authUser?.bio || "",
    gender: authUser?.gender || "",
  });

  const handlerSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", inputData.bio);
    formData.append("gender", inputData.gender);

    // Append the file if it exists
    if (inputData.profilePicture instanceof File) {
      formData.append("profilePicture", inputData.profilePicture);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_END_POINT}/user/editprofile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Profile updated successfully!",
          { autoClose: 500 }
        );
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Update failed";
      toast.error(message, { autoClose: 500 });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputData({ ...inputData, profilePicture: file });
    }
  };

  // Helper to get image source for preview
  const getImageSource = () => {
    if (inputData.profilePicture instanceof File) {
      return URL.createObjectURL(inputData.profilePicture);
    }
    return (
      inputData.profilePicture ||
      "https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

      <form
        onSubmit={handlerSubmit}
        className="bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 space-y-6"
      >
        {/* Profile Picture Section */}
        <div className="space-y-3">
          <label className="text-gray-300 font-medium block">
            Profile Picture
          </label>

          {/* Current Profile Preview */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={getImageSource()}
                alt="profile"
                className="w-20 h-20 rounded-full border-2 border-purple-400 object-cover"
              />
            </div>

            {/* File Input */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-600/20 file:text-purple-400 file:cursor-pointer hover:file:bg-purple-600/30 file:transition-all duration-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-3">
          <label htmlFor="bio" className="text-gray-300 font-medium block">
            Bio
          </label>
          <textarea
            id="bio"
            value={inputData.bio}
            onChange={(e) =>
              setInputData({ ...inputData, bio: e.target.value })
            }
            placeholder="Tell us about yourself..."
            rows="4"
            maxLength="150"
            className="w-full px-4 py-3 rounded-xl bg-[#0a0a12] border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
          />
          <p className="text-xs text-gray-500 text-right">
            {inputData.bio.length}/150
          </p>
        </div>

        {/* Gender Section */}
        <div className="space-y-3">
          <label className="text-gray-300 font-medium block">Gender</label>
          <div className="flex gap-6">
            {/* Male Option */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={inputData.gender === "male"}
                  onChange={(e) =>
                    setInputData({ ...inputData, gender: e.target.value })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    inputData.gender === "male"
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-500 group-hover:border-purple-400"
                  }`}
                >
                  {inputData.gender === "male" && (
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                Male
              </span>
            </label>

            {/* Female Option */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={inputData.gender === "female"}
                  onChange={(e) =>
                    setInputData({ ...inputData, gender: e.target.value })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    inputData.gender === "female"
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-gray-500 group-hover:border-purple-400"
                  }`}
                >
                  {inputData.gender === "female" && (
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                Female
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center min-h-[48px]"
          >
            {loading ? <Loader size="sm" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;