import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { API_END_POINT } from "../constants/index"
import { useDispatch, useSelector } from "react-redux"
import { setGetProfile } from '../store/user.slice'
import { 
  UserIcon, 
  PencilIcon, 
  TrashIcon,
  ArrowLeftIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Loader from '../components/Loader'

const GetProfile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { authUser, getProfile } = useSelector(store => store.user)
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${API_END_POINT}/user/getprofile/${id}`,
        { withCredentials: true }
      )
      if (response.data.success) {
        dispatch(setGetProfile(response.data.user))
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch profile"
      toast.error(message, { autoClose: 500 })
    } finally {
      setLoading(false)
    }
  }, [id, dispatch])

  const handlerFollowOrUnFollow = async (userId) => {
    try {
      setFollowLoading(true)
      const response = await axios.get(
        `${API_END_POINT}/user/followorunfollow/${userId}`,
        { withCredentials: true }
      )
      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 500 })
        fetchProfile()
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to follow/unfollow"
      toast.error(message, { autoClose: 500 })
    } finally {
      setFollowLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      setDeleteLoading(postId)
      const response = await axios.get(
        `${API_END_POINT}/post/delete/${postId}`,
        { withCredentials: true }
      )
      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 500 })
        fetchProfile()
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete post"
      toast.error(message, { autoClose: 500 })
    } finally {
      setDeleteLoading(null)
    }
  }

  useEffect(() => {
    if (id) { 
      fetchProfile()
    }
  }, [fetchProfile, id])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" variant="spinner" text="Loading profile..." />
      </div>
    )
  }

  // If no profile found
  if (!getProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-4">The user you're looking for doesn't exist</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:opacity-90 transition-all duration-300"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Feed
          </Link>
        </div>
      </div>
    )
  }

  const isOwnProfile = getProfile?._id === authUser?._id
  const isFollowing = getProfile?.followers?.includes(authUser?._id)

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-300 mb-4"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Feed
      </Link>
      
      {/* Profile Header Card */}
      <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden mb-6">
        {/* Cover Photo Placeholder */}
        <div className="h-32 bg-gradient-to-r from-purple-900/30 to-purple-700/30"></div>
        
        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-12 left-6">
            <div className="relative">
              <img 
                src={getProfile?.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + getProfile?.username} 
                alt={getProfile?.username} 
                className="w-24 h-24 rounded-full border-4 border-[#1a1625] object-cover"
              />
              {isOwnProfile && (
                <Link 
                  to="/editprofile"
                  className="absolute -bottom-2 -right-2 p-1.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors duration-300"
                >
                  <PencilIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="pt-16 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{getProfile?.username}</h1>
              {getProfile?.bio && (
                <p className="text-gray-400 mt-1">{getProfile?.bio}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                {getProfile?.gender && (
                  <span>Gender: {getProfile.gender}</span>
                )}
                {getProfile?.createdAt && (
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    Joined {new Date(getProfile.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <span className="block text-xl font-bold text-purple-400">{getProfile?.posts?.length || 0}</span>
                <span className="text-sm text-gray-400">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-purple-400">{getProfile?.followers?.length || 0}</span>
                <span className="text-sm text-gray-400">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-purple-400">{getProfile?.following?.length || 0}</span>
                <span className="text-sm text-gray-400">Following</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="md:ml-auto">
              {isOwnProfile ? (
                <Link 
                  to="/editprofile" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </Link>
              ) : (
                <button 
                  onClick={() => handlerFollowOrUnFollow(getProfile?._id)}
                  disabled={followLoading}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFollowing
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:opacity-90 shadow-purple-500/30'
                  }`}
                >
                  {followLoading ? (
                    <Loader size="sm" variant="spinner" />
                  ) : (
                    <>
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>Posts</span>
          <span className="text-sm font-normal text-gray-400">({getProfile?.posts?.length || 0})</span>
        </h2>
        
        {getProfile?.posts?.length === 0 ? (
          <div className="text-center py-12 bg-[#1a1625]/30 rounded-2xl border border-purple-500/20">
            <HeartIconSolid className="w-16 h-16 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No posts yet</p>
            {isOwnProfile && (
              <Link 
                to="/create" 
                className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors duration-300"
              >
                Create your first post →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getProfile?.posts?.map(post => (
              <div 
                key={post?._id} 
                className="group bg-[#1a1625]/80 rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="relative aspect-square">
                  <img 
                    src={post?.image} 
                    alt={post?.caption} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-sm px-4 text-center line-clamp-3">
                      {post?.caption}
                    </p>
                  </div>

                  {/* Delete button for own posts */}
                  {isOwnProfile && (
                    <button 
                      onClick={() => handleDeletePost(post?._id)}
                      disabled={deleteLoading === post?._id}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
                    >
                      {deleteLoading === post?._id ? (
                        <Loader size="sm" variant="spinner" />
                      ) : (
                        <TrashIcon className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GetProfile