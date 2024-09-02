import React, { useState } from "react";
import { AvatarFallback, Avatar, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  BookmarkPlus,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Button } from "./ui/button";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import CommentDialog from "./CommentDialog";
import { IoIosSend } from "react-icons/io";

const Post = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer focus-visible:ring-transparent w-fit text-[#ED4956] font-bold"
            >
              unfollow
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer focus-visible:ring-transparent w-fit  font-bold"
            >
              Link to Special
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer focus-visible:ring-transparent w-fit text-[#ED4956] font-bold"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="post-image"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <BiLike
            size={"27px"}
            className="cursor-pointer hover:text-gray-600"
          />
          {/* <BiSolidLike /> */}
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Share2 className="cursor-pointer hover:text-gray-600" />
        </div>
        <BookmarkPlus className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-1">1k likes</span>
      <p>
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all 10 comments.
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && (
          <span className="text-[#3BADF8]  cursor-pointer">
            <IoIosSend size={25} className="hover:text-[#1802AC]" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
