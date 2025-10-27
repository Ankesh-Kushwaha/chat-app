import React, { useEffect, useState, useRef } from "react";
import {
  Send,
  Users,
  LogOut,
  MessageCircle,
  Search,
  Smile,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react"; // 🧩 Emoji picker
import axios from "axios";
import { useParams } from "react-router-dom";
import avatar from "../../public/logo-icon.webp";
import { toast } from "react-toastify";
import { SignalingManager } from "../utils/SignalingManager";

const base_url = import.meta.env.VITE_BASE_URL;

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
  const [user, setUser] = useState<User>();
  const [roomName, setRoomName] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 🧩
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const signaling = SignalingManager.getInstance();

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch room data and user data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await axios.get(
          `${base_url}/community/get/${roomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setUsers(res.data.community.members);
          setRoomName(res.data.community.name);
        } else toast.error("Error fetching room data");
      } catch (error) {
        console.error("Fetch Room Error:", error);
      }
    };

    const fetchUserData = async () => {
      const res = await axios.get(
        `${base_url}/user/get-profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
    };

    fetchRoomData();
    fetchUserData();
  }, [roomId]);

  // WebSocket subscribe + listen
  useEffect(() => {
    if (!roomId || !userId) return;
    signaling.emit("subscribe", { roomId, userId });

    const cbMsg = `msg-${userId}-${roomId}`;
    const cbTyping = `typing-${userId}-${roomId}`;

    signaling.registerCallback(
      "message",
      (data) => {
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
      },
      cbMsg
    );

    signaling.registerCallback(
      "typing",
      (data) => {
        if (data.roomId === roomId && data.senderId !== userId) {
          setTypingUser(data.userName);
          setTimeout(() => setTypingUser(null), 2000);
        }
      },
      cbTyping
    );

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
      senderId: userId!,
      roomId,
      message: input,
      time,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`,
      userName: user?.name || "Anonymous",
    };

    setMessages((prev) => [...prev, msg]);
    signaling.emit("message", msg);
    setInput("");
  };

  const handleTyping = () => {
    signaling.emit("typing", {
      roomId,
      senderId: userId,
      userName: user?.name,
    });
  };

  const onEmojiClick = (emojiObject: any) => {
    setInput((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* LEFT SIDEBAR - MEMBERS LIST */}
      <aside className="w-80 h-full bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
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

        {/* Member Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search user..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-green-400/70 scrollbar-track-transparent">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700 transition"
            >
              <img
                src={user.profilePic || avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
              />
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
      <main className="flex-1 flex flex-col h-full max-h-screen">
        {/* HEADER */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-green-600 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {roomName}
            </h2>
          </div>
          <span className="text-sm text-gray-400">{users?.length} members</span>
        </div>

        {/* CHAT MESSAGES */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 dark:scrollbar-thumb-green-600"
        >
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
                  {msg.senderId !== userId && (
                    <p className="text-xs font-semibold mb-1 text-green-700 dark:text-green-400">
                      {msg.userName}
                    </p>
                  )}
                  <p className="break-words">{msg.message}</p>
                  <span className="block text-[10px] text-white mt-1 text-right">
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

        {/* INPUT SECTION */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex items-center gap-3 relative">
          {/* EMOJI PICKER BUTTON */}
          <div className="relative" ref={emojiRef}>
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Smile className="w-5 h-5 text-green-600" />
            </button>

            {showEmojiPicker && (
              <div
                onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                }}
                
                className="absolute bottom-12 left-0 z-50">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme="auto"
                  width={320}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* MESSAGE INPUT */}
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

          {/* SEND BUTTON */}
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
