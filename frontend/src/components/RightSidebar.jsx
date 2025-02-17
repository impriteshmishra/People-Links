import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";
import { ChevronLeft, Menu, X } from "lucide-react";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          className="md:hidden absolute top-4 right-0 z-50  px-2 rounded-ful  "
          onClick={() => setIsOpen(true)}
        >
          <div className="bg-transparent ">
          <Avatar className="border border-blue-500">
                <AvatarImage src={user?.profilePicture} alt="post_image" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
          </div>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64  shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300  md:relative md:translate-x-0 md:w-fit md:p-5 p-3 bg-white`}
      >
        <button
          className="md:hidden absolute top-4 right-0  text-blck p-2 rounded-full text-blue-700"
          onClick={() => setIsOpen(false)}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="p-4">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="border border-blue-500">
                <AvatarImage src={user?.profilePicture} alt="post_image" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            <div>
              <h1 className="font-semibold text-sm">
                <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
              </h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
        </div>
        <SuggestedUser />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default RightSidebar;
