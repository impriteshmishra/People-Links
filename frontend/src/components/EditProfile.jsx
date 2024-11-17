import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Profile from "./Profile";
import SuggestedUser from "./SuggestedUser";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div>
      <section>
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="w-fit my-10 pe-32">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-sm"> </h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <SuggestedUser />
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
