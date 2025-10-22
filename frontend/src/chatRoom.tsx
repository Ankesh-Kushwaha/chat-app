import { useState, useEffect, useRef } from "react";

interface ChatRoomProps {
  roomId: string;
}

interface ChatMessage {
  text: string;
  fromSelf: boolean;
  time: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [userId] = useState(() => crypto.randomUUID());
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [someoneTyping, setSomeoneTyping] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "subscribe", roomId, senderId: userId }));
    };

    socket.onmessage = (event: MessageEvent) => {
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
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            text: event.data,
            fromSelf: false,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
      ws.send(
        JSON.stringify({ type: "sendMessage", roomId, message: input, senderId: userId })
      );
      setMessages((prev) => [
        ...prev,
        {
          text: input,
          fromSelf: true,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-purple-900 to-indigo-900 text-white font-sans relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 flex items-center justify-between shadow-lg rounded-b-3xl">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${roomId}`}
            alt="room avatar"
            className="w-12 h-12 rounded-full ring-2 ring-white"
          />
          <div>
            <h2 className="text-lg font-bold tracking-wider">{roomId}</h2>
            <p className="text-xs text-gray-200">Online</p>
          </div>
        </div>
        <span className="text-2xl opacity-70 cursor-pointer hover:scale-110 transition">⋮</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-3xl shadow-lg break-words ${
                msg.fromSelf
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white animate-slide-in-right"
                  : "bg-gray-800 text-gray-100 animate-slide-in-left"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-[10px] mt-1 text-right opacity-70">{msg.time}</p>
            </div>
          </div>
        ))}

        {someoneTyping && (
          <p className="text-xs italic text-gray-300 ml-2 animate-pulse">
            {`${someoneTyping} is typing...`}
          </p>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 w-full px-4 py-3 bg-gray-900/80 backdrop-blur-md flex justify-end">
        <div className="flex items-center space-x-3 w-full max-w-xl">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700/60 placeholder-gray-300 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <button
            onClick={sendMessage}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
