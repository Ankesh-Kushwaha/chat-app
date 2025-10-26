import React, { useEffect, useState } from "react";
import { Send, Users, LogOut, MessageCircle, Search } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import avatar from "../../public/logo-icon.webp";
import { toast } from "react-toastify";
import { SignalingManager } from "../utils/SignalingManager";

type User = {
  _id: string;
  name: string;
  bio: string;
  email: string;
  profilePic: string;
  status?: "online" | "offline";
};

type ChatMessage = {
  senderId: string;
  message: string;
  time: string;
  avatar: string;
  userName: string;
};

const RoomPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const signaling = SignalingManager.getInstance();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/community/get/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setUsers(res.data.community.members);
          setRoomName(res.data.community.name);
        } else {
          toast.error("Error fetching room data");
        }
      } catch (error) {
        console.error("Fetch Room Error:", error);
      }
    };
    fetchRoomData();
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !userId) return;
    signaling.emit("subscribe", { roomId, userId });

    const cbMsg = `msg-${userId}-${roomId}`;
    const cbTyping = `typing-${userId}-${roomId}`;

    signaling.registerCallback("message", (data) => {
  if (data.roomId === roomId && data.senderId !== userId) {
    setMessages((prev) => [
      ...prev,
      {
        senderId: data.senderId,
        message: data.message,
        time: data.time,
        avatar: data.avatar,
        userName: data.userName,
      },
    ]);
  }
}, cbMsg);


    signaling.registerCallback("typing", (data) => {
      if (data.roomId === roomId && data.senderId !== userId) {
        setTypingUser(data.userName);
        setTimeout(() => setTypingUser(null), 2000);
      }
    }, cbTyping);

    return () => {
      signaling.emit("unsubscribe", { roomId, userId });
      signaling.deRegisterCallback("message", cbMsg);
      signaling.deRegisterCallback("typing", cbTyping);
    };
  }, [roomId, userId]);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const msg = {
      senderId:userId,
      roomId,
      message: input,
      time,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`,
      userName: "You",
    };

    setMessages((prev) => [...prev, msg]);
    signaling.emit("message", msg);
    setInput("");
  };

  // 🟢 Handle typing event
  const handleTyping = () => {
    signaling.emit("typing", {
      roomId,
      userId,
      userName: "Someone",
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* LEFT SIDEBAR */}
      <aside className="w-90 h-screen bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
            <Users className="w-5 h-5" /> Members
          </h2>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search user..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scroll-smooth scrollbar-thumb-green-400/70 scrollbar-track-transparent">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700 transition"
            >
              <div className="relative">
                <img
                  src={user.profilePic || avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.name}
                </h4>
                <p className="text-xs text-gray-400">{user.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT SIDE - CHAT */}
      <main className="flex-1 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-green-600 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {roomName}
            </h2>
          </div>
          <span className="text-sm text-gray-400">{users?.length} members</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 dark:scrollbar-thumb-green-600">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end gap-2 max-w-[70%] ${
                  msg.senderId === userId ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <img
                  src={msg.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700"
                />
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.senderId === userId
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-800"
                  }`}
                >
                  <p>{msg.message}</p>
                  <span className="block text-[10px] text-gray-300 mt-1 text-right">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {typingUser && (
            <div className="text-sm text-gray-500 italic pl-2">
              {typingUser} is typing...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();       
              }
            }}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-gray-200"
          />
          <button
            onClick={handleSend}
            className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full hover:opacity-90 flex items-center gap-1 transition"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default RoomPage;
