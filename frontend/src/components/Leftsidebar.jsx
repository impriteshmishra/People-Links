import { setAuthUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Bell,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
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
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const { messages } = useSelector((store) => store.chat);

  const logOutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/v1/user/logout", {
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
      icon: <Search />,
      text: "Find",
    },
    {
      icon: <TrendingUp />,
      text: "Ongoing trends",
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
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen ">
      <div className="flex flex-col ">
        <h1 className="mx-3 my-3 italic font-bold text-xl cursor-pointer">
          People-Links
          <Popover />
        </h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 "
              >
                {item.icon}
                <span>{item.text}</span>

                {item.text === "Notification" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-500"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => {
                              return (
                                <div
                                  className="flex items-center gap-2"
                                  key={notification.userId}
                                >
                                  <Avatar>
                                    <AvatarImage
                                      className="flex items-center"
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-semibold">
                                      {notification.userDetails?.username}{" "}
                                    </span>{" "}
                                    liked your post.
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                {item.text === "Messages" &&
                  messages.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-500"
                        >
                          {messages.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {messages.length === 0 ? (
                            <p>No new messages</p>
                          ) : (
                            messages.map((message) => {
                              return (
                                <div
                                  className="flex items-center gap-2"
                                  key={message.userId}
                                >
                                  <Avatar>
                                    <AvatarImage
                                      className="flex items-center"
                                      src={
                                        message.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-semibold">
                                      {message.userDetails?.username}{" "}
                                    </span>{" "}
                                    message you.
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default Leftsidebar;
