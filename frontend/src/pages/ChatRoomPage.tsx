import { useState } from "react";
import ChatRoom from "../components/chatRoom"
import logo from "../../public/logo-icon-2.jpg";
import { MessageSquare, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  avatar: string;
}

const ChatRoomPage: React.FC = () => {
  const [contacts] = useState<Contact[]>([
    { id: "room1", name: "Tech Talks 💻", lastMessage: "Let’s discuss AI!", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "room2", name: "Friends ❤️", lastMessage: "Movie night?", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: "room3", name: "Work Updates 🧠", lastMessage: "Deadline tomorrow!", avatar: "https://i.pravatar.cc/150?img=8" },
  ]);

  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen bg-[#1E1F22] text-gray-200 overflow-hidden font-inter">
      {/* Sidebar */}
      <div
        className={`bg-[#2B2D31] flex flex-col border-r border-[#3A3C40]
          fixed md:relative top-0 left-0 h-full z-20
          w-90 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* App Header */}
        <div className="flex items-center justify-between p-4 bg-[#202225] border-b border-[#3A3C40] shadow-md">
          <h1 onClick={() => navigate("/")} className="cursor-pointer text-lg font-bold text-white tracking-wide">
            Chatty
          </h1>
          <img src="https://i.pravatar.cc/40" alt="me" className="w-8 h-8 rounded-full border border-gray-500" />
          <button
            className="md:hidden text-white text-2xl ml-auto"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full p-2 text-sm rounded-md bg-[#1E1F22] border border-[#3A3C40] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3A3C40] p-3 space-y-2">
          <p className="uppercase text-xs text-gray-400 font-semibold tracking-widest mb-2">Channels</p>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setActiveRoom(contact.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all ${
                activeRoom === contact.id
                  ? "bg-[#404249] shadow-md"
                  : "hover:bg-[#34363B]"
              }`}
            >
              <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-gray-100 truncate">{contact.name}</span>
                <span className="text-sm text-gray-400 truncate">{contact.lastMessage}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Menu */}
        <div className="p-3 border-t border-[#3A3C40] bg-[#202225]">
          <div className="flex items-center justify-around text-gray-400">
            <MessageSquare className="w-5 h-5 hover:text-indigo-400 cursor-pointer" />
            <Users onClick={() => navigate("/friends")} className="w-5 h-5 hover:text-indigo-400 cursor-pointer" />
            <Settings onClick={() => navigate("/user-profile")} className="w-5 h-5 hover:text-indigo-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-10 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between bg-[#202225] p-3 border-b border-[#3A3C40]">
          <button onClick={() => setSidebarOpen(true)} className="text-white text-2xl">
            ☰
          </button>
          <span className="text-white font-semibold truncate max-w-[70%]">
            {activeRoom || "Chatty"}
          </span>
          <div className="w-6" />
        </div>

        {activeRoom ? (
          <ChatRoom
            roomId={activeRoom}
            roomName={contacts.find((c) => c.id === activeRoom)?.name ?? ""}
            users={[]} // You can later pass the actual user list
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <img src={logo} alt="Chatty" className="w-32 rounded-full opacity-80 mb-6" />
            <h2 className="text-2xl font-bold text-indigo-400 mb-2">Welcome to Chatty</h2>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Select a channel to start chatting just like Discord!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomPage;
