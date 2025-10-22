import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  users: string[];
}

interface ChatMessage {
  text: string;
  fromSelf: boolean;
  time: string;
  avatar: string;
  user: string;
}

export default function ChatRoom({ roomId, roomName, users }: ChatRoomProps) {
  const [userId] = useState(() => crypto.randomUUID());
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [someoneTyping, setSomeoneTyping] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "subscribe", roomId, senderId: userId }));
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "typing" && data.senderId !== userId) {
          setSomeoneTyping(data.isTyping ? data.senderId : null);
          return;
        }
        if (!data.message || data.senderId === userId) return;
        setMessages((prev) => [
          ...prev,
          {
            text: data.message,
            fromSelf: false,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${data.senderId}`,
            user: "Someone",
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            text: event.data,
            fromSelf: false,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=unknown`,
            user: "Someone",
          },
        ]);
      }
    };
    setWs(socket);
    return () => {
      if (socket.readyState === WebSocket.OPEN)
        socket.send(JSON.stringify({ type: "unsubscribe", roomId, senderId: userId }));
      socket.close();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && input.trim() !== "") {
      ws.send(JSON.stringify({ type: "sendMessage", roomId, message: input, senderId: userId }));
      setMessages((prev) => [
        ...prev,
        {
          text: input,
          fromSelf: true,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${userId}`,
          user: "You",
        },
      ]);
      setInput("");
      sendTypingStatus(false);
    }
  };

  const sendTypingStatus = (status: boolean) => {
    if (ws && ws.readyState === WebSocket.OPEN)
      ws.send(JSON.stringify({ type: "typing", roomId, senderId: userId, isTyping: status }));
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
    }, 1200);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 flex flex-col">
      {/* HEADER */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-green-600 w-6 h-6" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            #{roomName}
          </h2>
        </div>
       <span className="text-sm text-gray-400">{users?.length ?? 0} members</span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 dark:scrollbar-thumb-green-600">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end gap-2 max-w-[70%] ${msg.user === "You" ? "flex-row-reverse" : "flex-row"}`}>
              <img
                src={msg.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700"
              />
              <div className={`px-4 py-2 rounded-2xl text-sm ${msg.user === "You" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-800"}`}>
                <p>{msg.text}</p>
                <span className="block text-[10px] text-gray-300 mt-1 text-right">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
        {someoneTyping && (
          <div className="text-sm italic text-gray-400 animate-pulse">Someone is typing...</div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg flex gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-gray-200"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full hover:opacity-90 flex items-center gap-1 transition"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </main>
  );
}
