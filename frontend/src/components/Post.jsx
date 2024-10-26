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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { FaUserCheck } from "react-icons/fa";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:3500/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      // console.log("API Response:", res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        //updating post to show
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3500/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log(res.data);

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("User:", user);
  // console.log("Post:", post);

  const deletePostHandler = async () => {
    console.log("Deleting post with ID:", post?._id);
    try {
      const res = await axios.delete(
        `http://localhost:3500/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="my-8 w-full max-w-md mx-auto shadow-custom-light">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1>{post.author?.username}</h1>
            {user?._id === post.author._id && <FaUserCheck className=" text-blue-600 text-sm" />}
          </div>
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
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer focus-visible:ring-transparent w-fit text-[#ED4956] font-bold"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post-image"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <BiLike
              onClick={likeOrDislikeHandler}
              size={"27px"}
              className="cursor-pointer hover:text-blue-500 text-blue-700"
            />
          ) : (
            <BiLike
              onClick={likeOrDislikeHandler}
              size={"27px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          {/* <BiSolidLike /> */}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Share2 className="cursor-pointer hover:text-gray-600" />
        </div>
        <BookmarkPlus className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-1">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments.
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full cursor-pointer"
        />
        {text && (
          <span
            className="text-[#3BADF8]  cursor-pointer"
            onClick={commentHandler}
          >
            <IoIosSend size={25} className="hover:text-[#1802AC]" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
