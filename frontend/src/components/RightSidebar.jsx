import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaUserCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pe-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <h1  className="font-semibold text-sm"> <Link to={`/profile/${user?._id}`}>{user?.username}</Link> </h1>
          <span className="text-gray-600 text-sm">{user?.bio || "Bio here..."}</span>
        </div>
      </div>
      <SuggestedUser/>
    </div>
  );
};

export default RightSidebar;
