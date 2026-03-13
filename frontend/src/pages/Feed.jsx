import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { API_END_POINT } from "../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFeed } from "../store/user.slice";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector(store => store.user?.feed);
  const [loading, setLoading] = React.useState(true);
  
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_END_POINT}/post/getallposts`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setFeed(response.data.posts));
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch posts";
      toast.error(message, { autoClose: 500 });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 max-w-md">
          <span className="text-6xl mb-4 block">📷</span>
          <h3 className="text-xl font-bold text-white mb-2">No Posts Yet</h3>
          <p className="text-gray-400">
            Follow users to see their posts here or create your first post!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Your Feed</h1>
      
      <div className="space-y-6">
        {feed.map((post) => (
          <div key={post?._id || Math.random()}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;