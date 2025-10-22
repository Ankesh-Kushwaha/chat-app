import React, { useState } from "react";
import {
  Send,
  Users,
  LogOut,
  MessageCircle,
  Search,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline";
};

type Message = {
  user: string;
  text: string;
  time: string;
  avatar: string;
};

const sampleUsers: User[] = [
  { id: 1, name: "Aarav Mehta", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aarav", status: "online" },
  { id: 2, name: "Sara Patel", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sara", status: "online" },
  { id: 3, name: "Rohan Gupta", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rohan", status: "offline" },
  { id: 4, name: "Anjali Sharma", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anjali", status: "online" },
  { id: 5, name: "Karan Singh", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Karan", status: "offline" },
];

const RoomPage: React.FC<{ roomName?: string; onBack?: () => void }> = ({
  roomName = "Tech Talk",
  onBack,
}) => {
  const [users] = useState<User[]>(sampleUsers);
  const [messages, setMessages] = useState<Message[]>([
    {
      user: "Aarav Mehta",
      text: "Hey everyone 👋 excited for today’s discussion?",
      time: "10:45 AM",
      avatar: sampleUsers[0].avatar,
    },
    {
      user: "You",
      text: "Absolutely! Let's dive into new tech trends 🚀",
      time: "10:47 AM",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=You",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([
      ...messages,
      {
        user: "You",
        text: input,
        time,
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=You",
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* LEFT SIDEBAR - USERS */}
      <aside className="w-72 bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
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

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search user..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700 transition"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.name}
                </h4>
                <p className="text-xs text-gray-400">{user.status}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT SIDE - CHAT SECTION */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-green-600 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              #{roomName}
            </h2>
          </div>
          <span className="text-sm text-gray-400">{users.length} members</span>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 dark:scrollbar-thumb-green-600">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.user === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end gap-2 max-w-[70%] ${
                  msg.user === "You" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <img
                  src={msg.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700"
                />
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.user === "You"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-800"
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
        </div>

        {/* INPUT AREA */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
