import React, { useRef, useState } from "react";
import { DialogHeader, Dialog, DialogContent } from "./ui/dialog";
import { AvatarFallback, Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { RiImageAddFill } from "react-icons/ri";
import { readFileAsDataURL } from "@/lib/utils";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  // const URL = import.meta.env.VITE_APP_URL_BACKEND;
  const URL = 'https://people-links.onrender.com'

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        `${URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
      console.log(dataUrl);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Make New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Share your thoghts..."
        />
        {imagePreview && (
          <div className="w-64 h-64 items-center justify-center ">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full "
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <RiImageAddFill
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto cursor-pointer  text-blue-500 hover:scale-150 transition-transform duration-300"
        />
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </Button>
          ) : (
            <Button
              className="w-full"
              type="submit"
              onClick={createPostHandler}
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
