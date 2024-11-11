import Signup from "./components/Signup";
import Signin from "./components/Signin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import "./App.css";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path:'/profile/:id',
        element:<Profile/>
      }
    ],
  },
  {
    path: "/SignIn",
    element: <Signin />,
  },
  {
    path: "/SignUp",
    element: <Signup />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
