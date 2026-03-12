import axios from "axios";
import { sideMenus } from "../constants/common";
import { NavLink, useNavigate } from "react-router-dom";
import { API_END_POINT } from "../constants";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../store/user.slice";

const Sidebar = () => {
  const authUser = useSelector(store => store.user?.authUser)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_END_POINT}/user/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success(response.data.message || "Try Again", { autoClose: 500 });
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(message, { autoClose: 500 });
    }
  };

  return (
    <div className="h-screen w-64 lg:w-72 bg-[#1a1625]/80 backdrop-blur-xl border-r border-purple-500/20 px-3 py-8 flex flex-col">
      {/* Logo section */}
      <div className="flex justify-center mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="-rotate-45 text-2xl sm:text-3xl font-black text-white">
            N
          </span>
        </div>
      </div>

      {/* Navigation menu - flex-1 pushes logout to bottom */}
      <div className="flex-1">
        <div className="text-white flex flex-col gap-1.5">
          {/* Profile Link - Separate from sideMenus */}
          <NavLink
            to={`/profile/${authUser?._id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:bg-purple-600/10 hover:text-purple-400"
              }`
            }
          >
            <span className="text-lg">👤</span>
            <span className="font-medium">Profile</span>
            {({ isActive }) =>
              isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              )
            }
          </NavLink>

          {/* Other menu items from sideMenus */}
          {sideMenus.map((sideMenu) => (
            <NavLink
              to={sideMenu.path}
              key={sideMenu.id}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "text-gray-400 hover:bg-purple-600/10 hover:text-purple-400"
                }`
              }
            >
              {/* Icons based on menu id */}
              <span className="text-lg">
                {sideMenu.id === "feed" && "🏠"}
                {sideMenu.id === "search" && "🔍"}
                {sideMenu.id === "create" && "➕"}
                {sideMenu.id === "suggestedusers" && "👥"}
                {sideMenu.id === "editprofile" && "✏️"}
              </span>
              <span className="font-medium">{sideMenu.name}</span>

              {/* Active indicator */}
              {({ isActive }) =>
                isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                )
              }
            </NavLink>
          ))}
        </div>
      </div>

      {/* Logout button - always at bottom */}
      <div className="mt-auto pt-6 border-t border-purple-500/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
          <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-sm">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
