import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog=({ open, setOpen }) =>{
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }

  const sendMessageHandler = async()=>{
    alert(text);
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-2xl  p-0 flex flex-col "
      >
        <div className="flex flex-1 ">
          <div className="w-1/2">
            <img
              src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="post-image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">username</Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer"/>
                </DialogTrigger>
                <DialogContent>
                  <Button className="bg-blue-50 hover:bg-blue-100 cursor-pointer w-full text-[#ED4956] font-bold">Unfollow</Button>
                  <Button className="bg-blue-50 hover:bg-blue-100 cursor-pointer w-full text-black font-bold">Link to special</Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              comments
            </div>
            <div className="p-4">
                <div className="flex items-center gap-2">
                   <input type="text" value={text} onChange={changeEventHandler} placeholder="Add a comment...." className="w-full outline-none border border-gray-300 p-2 rounded" />
                   <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline" className="font-bold">Send</Button>
                </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;