import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Profile from "./Profile";
import SuggestedUser from "./SuggestedUser";
import { Button } from "./ui/button";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold text-sm"> {user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input ref={imageRef} type="file" className="hidden"/>
          <Button onClick={()=>imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change Photo</Button>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
