import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        <AvatarImage
          src="https://github.com/shadcn.png"
          className="rounded-full"
        />
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

function Leftsidebar() {
  const navigate = useNavigate();
  const logOutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/Signin");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") logOutHandler();
  };

  return (
    <div>
      <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
        <div className="flex flex-col">
          <h1>LOGO</h1>
        </div>

        {sidebarItems.map((item, index) => {
          return (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Leftsidebar;
