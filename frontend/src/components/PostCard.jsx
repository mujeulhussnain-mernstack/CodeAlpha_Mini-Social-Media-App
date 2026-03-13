import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import axios from "axios";
import { API_END_POINT } from "../constants";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCommentsOfPost } from "../store/user.slice";

const PostCard = ({ post }) => {
  const dispatch = useDispatch()
  const comments = useSelector(store => store.user?.commentsOfPost)
  const authUser = useSelector((store) => store.user?.authUser)
  
  // Check if current user has liked the post
  const [liked, setLiked] = useState(post?.likes?.includes(authUser?._id) || false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments when modal opens
  useEffect(() => {
    if (showComments && post?._id) {
      fetchComments();
    }
  }, [showComments]);

  // Get comments of post
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_END_POINT}/post/getcommentsofpost/${post?._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setCommentsOfPost(response.data.comments))
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load comments";
      toast.error(message, { autoClose: 500 });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
    
    try {
      const response = await axios.get(
        `${API_END_POINT}/post/likeordislike/${post?._id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update with actual data from server if needed
        if (response.data.likes !== undefined) {
          setLikesCount(response.data.likes.length);
          setLiked(response.data.likes.includes(authUser?._id));
        }
      }
    } catch (error) {
      // Revert on error
      setLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      
      const message = error.response?.data?.message || "Failed to like post";
      toast.error(message, { autoClose: 500 });
    }
  };

  // Add comment here
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `${API_END_POINT}/post/addcomment/${post?._id}`,
        { text: comment },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setCommentsOfPost([response.data.comment, ...comments]));
        setComment("")
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add comment";
      toast.error(message, { autoClose: 500 });
    }
  };

  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (post?.postAuthor?.username || "user");

  return (
    <>
      <div className="bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 w-full max-w-full z-50">
        {/* Post Header */}
        <div className="flex items-center gap-2 p-3">
          <Link to={`/profile/${post?.postAuthor?._id}`} className="flex-shrink-0">
            <img
              src={post?.postAuthor?.profilePicture || defaultAvatar}
              alt={post?.postAuthor?.username}
              className="w-8 h-8 rounded-full border-2 border-purple-400 object-cover"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              to={`/profile/${post?.postAuthor?._id}`}
              className="text-white font-semibold hover:text-purple-400 transition-colors duration-300 text-sm block truncate"
            >
              {post?.postAuthor?.username || "username"}
            </Link>
            <p className="text-gray-500 text-xs">
              {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : "2 hours ago"}
            </p>
          </div>
        </div>

        {/* Post Image */}
        <div className="w-full bg-black">
          <img
            src={post?.image || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600"}
            alt="post"
            className="w-full h-auto max-h-[300px] object-cover"
            onError={(e) => {
              e.target.src = "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600";
            }}
          />
        </div>

        {/* Post Actions */}
        <div className="p-3">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
            >
              {liked ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="text-xs">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors duration-300"
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="text-xs">{comments?.length || 0}</span>
            </button>

            <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors duration-300 ml-auto">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <p className="text-white text-sm">
              <Link
                to={`/profile/${post?.postAuthor?._id}`}
                className="font-semibold hover:text-purple-400 transition-colors duration-300 mr-2"
              >
                {post?.postAuthor?.username}
              </Link>
              <span className="break-words">{post?.caption || "No caption"}</span>
            </p>
          </div>

          {/* View Comments Link */}
          {(post?.commentCount > 0 || comments?.length > 0) && (
            <button
              onClick={() => setShowComments(true)}
              className="text-gray-500 text-xs mt-1 hover:text-purple-400 transition-colors duration-300"
            >
              View all {post?.commentCount || comments?.length} comments
            </button>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm">
          {/* Modal Container - Right aligned on desktop */}
          <div className="flex items-end sm:items-stretch justify-end min-h-screen">
            <div className="bg-[#1a1625] w-full sm:w-96 lg:w-[420px] h-[80vh] sm:h-screen flex flex-col overflow-hidden border-l border-purple-500/20 sm:rounded-l-2xl">
              
              {/* Header - More compact */}
              <div className="flex items-center justify-between p-3 border-b border-purple-500/20 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Mobile back button/image */}
                  <div className="sm:hidden w-8 h-8 flex-shrink-0">
                    <img
                      src={post?.image || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600"}
                      alt="post"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <img
                    src={post?.postAuthor?.profilePicture || defaultAvatar}
                    alt={post?.postAuthor?.username}
                    className="w-7 h-7 rounded-full border border-purple-400 flex-shrink-0"
                  />
                  <span className="text-white font-semibold text-sm truncate">
                    {post?.postAuthor?.username}
                  </span>
                </div>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex-shrink-0"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Image preview for desktop - small at top */}
              <div className="hidden sm:block p-3 border-b border-purple-500/20">
                <div className="flex gap-2">
                  <img
                    src={post?.image || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600"}
                    alt="post"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-white text-xs line-clamp-2">{post?.caption || "No caption"}</p>
                    <p className="text-gray-500 text-xs mt-1">{likesCount} likes</p>
                  </div>
                </div>
              </div>

              {/* Comments List - More compact spacing */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                ) : comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment?._id || Math.random()} className="flex gap-2">
                      <img
                        src={comment?.userId?.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + comment?.userId?.username}
                        alt={comment?.userId?.username}
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-white font-semibold text-xs mr-1">
                          {comment?.userId?.username}
                        </span>
                        <span className="text-gray-300 text-xs break-words">
                          {comment?.text}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">No comments yet</p>
                  </div>
                )}
              </div>

              {/* Add Comment Form - More compact */}
              <div className="p-3 border-t border-purple-500/20 flex-shrink-0">
                <form onSubmit={handleAddComment} className="w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 min-w-0 px-3 py-2 text-sm bg-[#0a0a12] border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;