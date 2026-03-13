import React, { useCallback, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { API_END_POINT } from "../constants/index"
import { useDispatch, useSelector } from "react-redux"
import { setGetProfile } from '../store/user.slice'

const GetProfile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { authUser, getProfile } = useSelector(store => store.user)
  
  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_END_POINT}/user/getprofile/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        console.log(response.data.user)
        dispatch(setGetProfile(response.data.user))
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";
      toast.error(message, { autoClose: 500 });
    } 
  }, [id, dispatch]);

  // Follow/Unfollow logic will be here
  const handlerFollowOrUnFollow = async (id) => {
    try {
      const response = await axios.get(
        `${API_END_POINT}/user/followorunfollow/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message, {autoClose: 500})
        fetchProfile()
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to Follow or Unfollow";
      toast.error(message, { autoClose: 500 });
    } 
  }

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.get(
        `${API_END_POINT}/post/delete/${postId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message, {autoClose: 500})
        fetchProfile();
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete post.";
      toast.error(message, { autoClose: 500 });
    } 
  }

  useEffect(() => {
    if (id) { 
      fetchProfile();
    }
  }, [fetchProfile, id]);

  // Show loading state while fetching
  if (!getProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      {/* Profile Info */}
      <div className="bg-[#1a1625]/80 p-6 rounded-xl border border-purple-500/20 mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={getProfile?.profilePicture || "https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"} 
            alt={getProfile?.username} 
            className="w-20 h-20 rounded-full border-2 border-purple-400 object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{getProfile?.username}</h2>
            <p className="text-gray-400">{getProfile?.bio || "No bio yet"}</p>
            <p className="text-gray-400">Gender: {getProfile?.gender || "Not specified"}</p>
          </div>
        </div>

        {/* Followers/Following Count */}
        <div className="flex gap-6 mt-4">
          <div>
            <span className="font-bold text-purple-400">{getProfile?.followers?.length || 0}</span>
            <span className="text-gray-400 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-bold text-purple-400">{getProfile?.following?.length || 0}</span>
            <span className="text-gray-400 ml-1">Following</span>
          </div>
        </div>

        {/* Edit Profile / Follow Button */}
        <div className="mt-4">
          {getProfile?._id === authUser?._id ? (
            <Link 
              to="/editprofile" 
              className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300"
            >
              Edit Profile
            </Link>
          ) : (
            <button 
              onClick={(e) => handlerFollowOrUnFollow(getProfile?._id)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300"
            >
              {getProfile?.followers?.includes(authUser?._id) ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {getProfile?.posts?.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No posts yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getProfile?.posts?.map(post => (
              <div key={post?._id} className="bg-[#1a1625]/80 p-4 rounded-xl border border-purple-500/20">
                <img 
                  src={post?.image} 
                  alt={post?.caption} 
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <p className="text-white mb-2">{post?.caption}</p>
                {getProfile?._id === authUser?._id && (
                  <button 
                    onClick={() => handleDeletePost(post?._id)}
                    className="px-4 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GetProfile