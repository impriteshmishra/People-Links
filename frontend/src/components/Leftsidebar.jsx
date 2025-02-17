import { setAuthUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Bell,
  ChevronLeft,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

function Leftsidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const URL = import.meta.env.VITE_APP_URL_BACKEND;
  const URL = 'https://people-links.onrender.com'

  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const { messages } = useSelector((store) => store.chat);

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/Signin");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logOutHandler();
    } else if (textType === "Make post") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Bell />,
      text: "Notification",
    },
    {
      icon: <PlusSquare />,
      text: "Make post",
    },
    {
      icon: (
        <Avatar className="w-7 h-7 rounded-full">
          <AvatarImage src={user?.profilePicture} className="rounded-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];

  return (
    <>
      {!isSidebarOpen && (
        <button
          className="absolute top-4 left-4 p-2 z-50 text-blue-700  rounded-full lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={24} className="hidden" />
          ) : (
            <Menu size={24} />
          )}
        </button>
      )}

      {/* this is sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 border-r bg-white border-gray-300 md:w-15 w-64 h-screen shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0 md:w-1/4 lg:w-56`}
      >
        <button
          className="absolute top-4 right-0 z-50  p-1 text-blue-700 rounded-full lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={24} />
          ) : (
            <Menu size={24} className="hidden" />
          )}
        </button>

        <div className="flex flex-col p-4">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2"
            >
              {item.icon}
              <span>{item.text}</span>

              {item.text === "Notification" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 bg-red-500 absolute left-5 "
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    {likeNotification.length === 0 ? (
                      <p>No new notifications</p>
                    ) : (
                      likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="flex items-center gap-2"
                        >
                          <Avatar>
                            <AvatarImage
                              src={notification.userDetails?.profilePicture}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-semibold">
                              {notification.userDetails?.username}
                            </span>{" "}
                            liked your post.
                          </p>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
              )}

              {item.text === "Messages" && messages.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 bg-red-500 absolute left-5"
                    >
                      {messages.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    {messages.length === 0 ? (
                      <p>No new messages</p>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.userId}
                          className="flex items-center gap-2"
                        >
                          <Avatar>
                            <AvatarImage
                              src={message.userDetails?.profilePicture}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-semibold">
                              {message.userDetails?.username}
                            </span>{" "}
                            sent you a message.
                          </p>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
}

export default Leftsidebar;
