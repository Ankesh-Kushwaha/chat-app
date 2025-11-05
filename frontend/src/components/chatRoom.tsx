/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import { SignalingManager } from "../utils/SignalingManager";
import axios from "axios";

interface Contact {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
}

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  users: Contact[];
}

interface ChatMessage {
  text: string;
  fromSelf: boolean;
  time: string;
  avatar: string;
  user: string;
}

export default function ChatRoom({ roomId, roomName, users }: ChatRoomProps) {
  const [userId] = useState(localStorage.getItem("userId") || crypto.randomUUID());
  const signaling = SignalingManager.getInstance();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleMessage = (data: any) => {
      if (!data.message) return;
      const isSelf = data.senderId === userId;
      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          fromSelf: isSelf,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.senderId}`,
          user: isSelf ? "You" : data.userName || "Friend",
        },
      ]);
    };

    const handleTyping = (data: any) => {
      if (data.senderId !== userId) {
        setSomeoneTyping(data.isTyping ? data.senderId : null);
      }
    };

    const getMessageHistory = async () => {
      try {
        const res = await axios.get(
          `https://chat-app-messagebackup-service.onrender.com/chat/chathistory/${roomId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success && Array.isArray(res.data.message)) {
          const formatted = res.data.message.map((msg: any) => ({
            text: msg.message,
            fromSelf: msg.senderId === userId,
            time: new Date(msg.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            avatar: msg.avatar,
            user: msg.senderId === userId ? "You" : msg.userName,
          }));
          setMessages(formatted);
        } else {
          setMessages([]);
        }
      } catch (error: any) {
        console.error("Error fetching chat history:", error.message);
      }
    };

    getMessageHistory();

    signaling.registerCallback("message", handleMessage, `message-${userId}`);
    signaling.registerCallback("typing", handleTyping, `typing-${userId}`);
    signaling.emit("subscribe", { roomId, senderId: userId });

    return () => {
      signaling.emit("unsubscribe", { roomId, senderId: userId });
      signaling.deRegisterCallback("message", `message-${userId}`);
      signaling.deRegisterCallback("typing", `typing-${userId}`);
    };
  }, [roomId, userId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    signaling.emit("message", { roomId, message: input, senderId: userId });

    setMessages((prev) => [
      ...prev,
      {
        text: input,
        fromSelf: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`,
        user: "You",
      },
    ]);
    setInput("");
    sendTypingStatus(false);
  };

  const sendTypingStatus = (status: boolean) => {
    signaling.emit("typing", { roomId, senderId: userId, isTyping: status });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 1000);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex flex-col h-full bg-gradient-to-b from-[#1E1F22] to-[#2B2D31] text-gray-100">
      {/* HEADER */}
      <div className="p-4 border-b border-[#2E2F33] bg-[#2B2D31] flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-green-500 w-6 h-6" />
          <h2 className="text-xl font-semibold">{roomName}</h2>
        </div>
        <span className="text-sm text-gray-400">{users?.length ?? 0} Friends</span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin scrollbar-thumb-[#3A3C40] scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-20">
            No messages yet. Say hi 👋
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-end gap-2 max-w-[75%] ${
                msg.fromSelf ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <img
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`}
                alt={msg.user}
                className="w-8 h-8 rounded-full border border-gray-600"
              />
              <div
                className={`px-4 py-2 text-sm break-words shadow-sm transition-all duration-150 ${
                  msg.fromSelf
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl rounded-br-none"
                    : "bg-[#2F3136] text-gray-100 rounded-2xl rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-[10px] text-gray-300 mt-1 text-right">
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {someoneTyping && (
          <div className="text-sm italic text-gray-400 animate-pulse">
            Someone is typing...
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t border-[#2E2F33] bg-[#2B2D31]/90 backdrop-blur-md flex items-center gap-3 sticky bottom-0">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-full bg-[#1E1F22] border border-[#3A3C40] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white flex items-center gap-1 transition"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </main>
  );
}
