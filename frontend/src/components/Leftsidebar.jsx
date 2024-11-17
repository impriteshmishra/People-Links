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

function Leftsidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

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
    } else if(textType === "Home"){
      navigate("/");
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
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen shadow-custom-heavy bg-card-color">
      <div className="flex flex-col ">
        <h1 className="mx-3 my-3 italic font-bold text-xl cursor-pointer">
          People-Links
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
