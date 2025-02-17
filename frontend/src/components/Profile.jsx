import useGetUserProfile from "@/hooks/useGetUserProfile.jsx";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("post");
  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollow = true;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "post" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto p-4 md:p-16">
      
      <div className="flex flex-col md:flex-row items-center w-full md:justify-between gap-6 md:gap-10">
        {/* Avatar */}
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold">{userProfile?.username}</span>
            {isLoggedInUserProfile ? (
              <Link to="/account/editprofile">
                <Button variant="secondary" className="h-8">Edit Profile</Button>
              </Link>
            ) : isFollow ? (
              <div className="flex gap-3">
                <Button variant="secondary" className="h-8">Unfollow</Button>
                <Button variant="secondary" className="h-8">Message</Button>
              </div>
            ) : (
              <Button variant="secondary" className="bg-blue-500 text-white h-8">Follow</Button>
            )}
          </div>
          
         
          <div className="flex gap-4 mt-3 text-sm">
            <p><span className="font-semibold">Posts:</span> {userProfile?.posts.length}</p>
            <p><span className="font-semibold">Followers:</span> {userProfile?.followers.length}</p>
            <p><span className="font-semibold">Following:</span> {userProfile?.following.length}</p>
          </div>

         
          <div className="mt-3 text-sm">{userProfile?.bio || "Profile bio"}</div>
        </div>
      </div>

     
      <div className="w-full mt-6 border-t border-gray-300 pt-4 flex justify-center gap-6 text-sm">
        <span className={`cursor-pointer ${activeTab === "post" ? "font-bold" : ""}`} onClick={() => handleTabChange("post")}>
          Posts
        </span>
        <span className={`cursor-pointer ${activeTab === "bookmarked" ? "font-bold" : ""}`} onClick={() => handleTabChange("bookmarked")}>
          Bookmarked
        </span>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full mt-4">
        {displayedPost?.map((post) => (
          <div key={post?._id} className="relative group cursor-pointer">
            <img src={post.image} alt="post" className="rounded-md w-full object-cover aspect-square" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;