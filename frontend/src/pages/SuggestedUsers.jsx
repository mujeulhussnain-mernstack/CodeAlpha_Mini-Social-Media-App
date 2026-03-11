import { useCallback, useEffect } from "react";
import { API_END_POINT } from "../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { setSuggestedUsers } from "../store/user.slice";
import { useDispatch, useSelector } from "react-redux";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const suggestedUsers = useSelector((store) => store.user?.suggestedUsers);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${API_END_POINT}/user/getsuggestedusers`,
        {},
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        dispatch(setSuggestedUsers(response.data.users));
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(message, { autoClose: 500 });
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Suggested Users</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedUsers?.map((user) => (
          <div
            key={user?._id}
            className="bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-3">
                <img
                  src={
                    user?.profilePicture ||
                    "https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"
                  }
                  alt={user?.username}
                  className="w-24 h-24 rounded-full border-2 border-purple-400 object-cover"
                />
                {/* Optional online indicator */}
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1625]"></div>
              </div>

              {/* Username */}
              <p className="text-white font-semibold text-lg mb-1">
                {user?.username}
              </p>
              
              {/* Optional: Add user bio or other info */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {user?.bio || "No bio yet"}
              </p>

              {/* See Profile Button */}
              <Link
                to={`/profile/${user?._id}`}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-400 font-medium rounded-xl border border-purple-500/30 hover:from-purple-600 hover:to-purple-500 hover:text-white transition-all duration-300"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {(!suggestedUsers || suggestedUsers.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400">No suggested users found</p>
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;