import { useCallback, useEffect, useState } from "react";
import { API_END_POINT } from "../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { setSuggestedUsers } from "../store/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { UsersIcon, EyeIcon } from "@heroicons/react/24/outline";
import Loader from "../components/Loader";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const suggestedUsers = useSelector((store) => store.user?.suggestedUsers);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_END_POINT}/user/getsuggestedusers`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setSuggestedUsers(response.data.users));
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to fetch suggestions";
      toast.error(message, { autoClose: 500 });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" variant="spinner" text="Finding suggestions..." />
      </div>
    );
  }

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-[#1a1625]/30 rounded-2xl p-8 max-w-md border border-purple-500/10">
          <UsersIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Suggestions</h3>
          <p className="text-gray-400">
            We couldn't find any users to suggest right now. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#140e1a] to-[#1a1225] py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Suggested for You
          </h1>
          <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Connect with people you might know
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestedUsers?.map((user) => (
            <div
              key={user?._id}
              className="group bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col"
            >
              <div className="flex flex-col items-center text-center flex-1">
                {/* Profile Image */}
                <Link to={`/profile/${user?._id}`} className="relative mb-4">
                  <div className="relative">
                    <img
                      src={
                        user?.profilePicture ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.username
                      }
                      alt={user?.username}
                      className="w-28 h-28 rounded-full border-3 border-purple-400 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Online indicator */}
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1625]"></div>
                  </div>
                </Link>

                {/* Username */}
                <Link to={`/profile/${user?._id}`} className="mb-2">
                  <h3 className="text-white font-semibold text-lg hover:text-purple-400 transition-colors duration-300">
                    {user?.username}
                  </h3>
                </Link>
                
                {/* Bio */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                  {user?.bio || "No bio yet"}
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-4 text-xs text-gray-500 mb-5 w-full border-t border-purple-500/10 pt-4">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-purple-400 text-base">{user?.followers?.length || 0}</span>
                    <span className="text-gray-400">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-purple-400 text-base">{user?.following?.length || 0}</span>
                    <span className="text-gray-400">Following</span>
                  </div>
                </div>

                {/* View Profile Button - Full width */}
                <Link
                  to={`/profile/${user?._id}`}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 mt-auto"
                >
                  <EyeIcon className="w-5 h-5" />
                  <span>View Profile</span>
                </Link>

                {/* Mutual followers (optional) */}
                {user?.mutualFollowers > 0 && (
                  <p className="text-xs text-gray-500 mt-3">
                    {user.mutualFollowers} mutual followers
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-8 py-3 bg-[#1a1625] border border-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-600/10 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedUsers;