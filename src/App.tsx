import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import Authlayout from "./Layout/Authlayout"
import Login from "./Pages/Login/Login"
import Register from "./Pages/Register/Register"
import Mainlayout from "./Layout/Mainlayout"
// import Home from "./Pages/Home/Home"
import Notifictions from "./Pages/Notifications/Notifictions"
import Profile from "./Pages/Profile/Profile"
import Notfound from "./Pages/Notfound/Notfound"
import { Toaster } from "react-hot-toast"
import AppProtectedRoutes from "./Components/ProtectedRoutes/AppProtectedRoutes"
import AuthProtectedRoutes from "./Components/ProtectedRoutes/AuthProtectedRoutes"
import PostDetails from "./Components/PostDetails/PostDetails"
import { Newsfeed } from "./Pages/Newsfeed/Newsfeed"

function App() {
  const routes = createBrowserRouter([
    {
      path: "/auth", element: <AuthProtectedRoutes><Authlayout /></AuthProtectedRoutes> , children: [
        { index: true, element: <Navigate to="login" /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },

      ]
    },
    {
      path: "/", element: <AppProtectedRoutes><Mainlayout /></AppProtectedRoutes> , children: [
        { index: true, element: <Navigate to="/feed" /> },
        // { path: "home", element: <Home /> },
        { path: "feed", element: <Newsfeed /> },
        { path: "profile", element: <Profile /> },
        { path: "notification", element: <Notifictions /> },
        { path: "postDetails/:id", element: <PostDetails/> },
      ]
    },
    { path: "*", element: <Notfound /> },

  ])
  return (
    <>
      <Toaster />

      <RouterProvider router={routes} />

    </>
  )
}

export default App