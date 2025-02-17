import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

function Comment({ comment }) {
  const navigate = useNavigate();

  const profileHandler = ()=>{
    navigate(`/profile/${comment?.author._id}`)
  }

  return (
    <div>
      <div className="my-1">
        <div className="flex gap-1 items-center">
          <Avatar className="w-6 h-6 md:w-10 md:h-10 cursor-pointer" onClick={profileHandler}>
            <AvatarImage src={comment?.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="flex items-center font-semibold md:font-bold text-xs md:text-sm gap-1">
           <span className="text-blue-700 cursor-pointer" onClick={profileHandler}>{comment?.author.username}</span> 
            <span className="font-normal">{comment?.text}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Comment;
