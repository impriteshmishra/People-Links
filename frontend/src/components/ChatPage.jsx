import { setSelectedUser } from "@/redux/authSlice";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeft, MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { useEffect, useState } from "react";

function ChatPage() {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();
  const URL = import.meta.env.VITE_APP_URL_BACKEND;

  //  console.log(messages.newMessage, "messages");

  // Send message handler
  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${URL}/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Cleanup effect: reset selected user when component unmounts
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center ml-[8%]  md:ml-[16%] h-screen lg:ml-[26%]">
      {!selectedUser && (
        <section className={`w-full md:w-2/4 lg:w-1/4 my-16 `}>
          <h1 className="font-semibold mb-4 px-3 text-xl">{user?.username}</h1>
          <hr className="mb-4 border-gray-300" />
          <div className="overflow-y-auto h-auto md:h-[80vh] border border-blue-700 rounded-lg mr-5 md:mr-0">
            {suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  key={suggestedUser._id} // Added missing key
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <Avatar className="w-14 h-14 rounded-full">
                    <AvatarImage
                      className="rounded-full"
                      src={suggestedUser?.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {suggestedUser?.username}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isOnline ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Chat Section */}
      {selectedUser ? (
        <section
          className={`mt-16 md:mt-0 ml-[-32px] md:ml-0 md:flex-1 p-2 border md:border-1 border-gray-900 flex flex-col h-full`}
        >
          <div className="flex gap-3 items-center px-0 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <ArrowLeft
              className="cursor-pointer text-blue-700 "
              onClick={() => dispatch(setSelectedUser(null))}
            />
            <Avatar className="w-7 h-7 rounded-full">
              <AvatarImage
                className="rounded-full"
                src={selectedUser?.profilePicture}
                alt="profile"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>

          {/* Chat Messages reflect here*/}
          <Messages selectedUser={selectedUser} />

          {/* Message Input Box */}
          <div className="flex sticky items-center p-4 bg-transparent  bottom-0 left-0 w-full">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Type a message..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)} className="text-white bg-blue-500 hover:bg-white hover:text-blue-500 hover:border border-blue-500">
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className=" md:block flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4 text-blue-500" />
          <h1 className="font-semibold">Your Messages</h1>
          <span className="font-semibold">Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
