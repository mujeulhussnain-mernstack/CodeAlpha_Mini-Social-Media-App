// App.jsx
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "./components/Loader";
import { FeedSkeleton, ProfileSkeleton } from "./components/SkeletonLoader";
import "./App.css";

// Lazy load pages
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const MainLayout = lazy(() => import("./components/MainLayout"));
const Feed = lazy(() => import("./pages/Feed"));
const Search = lazy(() => import("./pages/Search"));
const SuggestedUsers = lazy(() => import("./pages/SuggestedUsers"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const GetProfile = lazy(() => import("./pages/GetProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Custom Suspense wrappers with different loaders for different pages
const withSuspense = (Component, loader = "spinner", skeleton = null) => (props) => (
  <Suspense fallback={skeleton || <Loader size="lg" variant={loader} fullScreen />}>
    <Component {...props} />
  </Suspense>
);

const router = createBrowserRouter([
  { 
    path: "/register", 
    element: withSuspense(Register, "spinner")() 
  },
  { 
    path: "/login", 
    element: withSuspense(Login, "spinner")() 
  },
  {
    path: "/",
    element: withSuspense(MainLayout, "pulse")(),
    children: [
      { path: "/", element: withSuspense(Feed, "dots", <FeedSkeleton />)() },
      { path: "/search", element: withSuspense(Search, "pulse")() },
      { path: "/create", element: withSuspense(CreatePost, "spinner")() },
      { path: "/suggestedusers", element: withSuspense(SuggestedUsers, "dots")() },
      { path: "/editprofile", element: withSuspense(EditProfile, "spinner")() },
      { path: "/profile/:id", element: withSuspense(GetProfile, "progress", <ProfileSkeleton />)() },
    ],
  },
  { 
    path: "*", 
    element: withSuspense(NotFound, "pulse")() 
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;