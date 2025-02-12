import Signup from "./components/Signup";
import Signin from "./components/Signin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import "./App.css";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/realTimeNotificationSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes> ,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/editprofile",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
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
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio);

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:3500", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      //listen all the event
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification",(notification)=>{
        dispatch(setLikeNotification(notification));
      })
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if(socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
