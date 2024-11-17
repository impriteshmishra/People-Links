import useGetUserProfile from "@/hooks/useGetUserProfile.jsx";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { BiLike } from "react-icons/bi";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("post");

  const { userProfile, user } = useSelector((store) => store.auth);
  // console.log(userProfile);

  const isLoggedInUserProfile = user?._id == userProfile?._id;
  const isFollow = true;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "post" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="m-5">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                  <Link to="/account/editprofile">
                  <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Edit profile
                    </Button>
                  </Link>
                    
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollow ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    className="bg-blue-500 text-white hover:bg-blue-700 h-8"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">posts</span>{" "}
                  {userProfile?.posts.length}{" "}
                </p>
                <p>
                  <span className="font-semibold">followers</span>{" "}
                  {userProfile?.followers.length}{" "}
                </p>
                <p>
                  <span className="font-semibold">following</span>{" "}
                  {userProfile?.following.length}{" "}
                </p>
              </div>
              <div>
                <span>{userProfile?.bio || "profile bio"} </span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-400">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "post" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("post")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "bookmarked" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("bookmarked")}
            >
              Bookmarked
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
