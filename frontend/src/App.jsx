import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import SuggestedUsers from "./pages/SuggestedUsers";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./pages/EditProfile";
import GetProfile from "./pages/GetProfile";

import NotFound from "./pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Feed /> },
      { path: "/search", element: <Search /> },
      { path: "/create", element: <CreatePost /> },
      { path: "/suggestedusers", element: <SuggestedUsers /> },
      { path: "/editprofile", element: <EditProfile /> },
      { path: "/profile/:id", element: <GetProfile /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
