import { useState } from "react";
import ChatRoom from "./ChatRoom";

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  avatar: string;
}

export default function App() {
  const [contacts] = useState<Contact[]>([
    { id: "room1", name: "Tech Talks 💻", lastMessage: "Let’s discuss AI!", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "room2", name: "Friends ❤️", lastMessage: "Movie night?", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: "room3", name: "Work Updates 🧠", lastMessage: "Deadline tomorrow!", avatar: "https://i.pravatar.cc/150?img=8" },
  ]);

  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 text-gray-800 overflow-hidden relative">
      
      {/* Sidebar */}
      <div
        className={`bg-white flex flex-col shadow-lg overflow-hidden
          fixed md:relative top-0 left-0 h-full z-20
          w-64 md:w-1/3 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-5 flex items-center justify-between shadow-md">
          <h1 className="text-xl font-bold text-white tracking-wider">Chatty</h1>
          <img src="https://i.pravatar.cc/40" alt="me" className="w-10 h-10 rounded-full border-2 border-white" />
          {/* Mobile close button */}
          <button className="md:hidden text-white text-xl ml-auto" onClick={() => setSidebarOpen(false)}>×</button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white border-b border-gray-200">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full p-3 text-sm rounded-full border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 shadow-md transition-all duration-200 bg-gray-50"
          />
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => { setActiveRoom(contact.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-300 rounded-2xl shadow hover:shadow-lg hover:scale-105 ${
                activeRoom === contact.id
                  ? "bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 shadow-xl"
                  : "bg-white"
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-14 h-14 rounded-full ring-2 ring-purple-300 transition-all duration-300"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="font-semibold text-gray-800 truncate">{contact.name}</span>
                <span className="text-sm text-gray-500 truncate">{contact.lastMessage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-10 transition-opacity duration-300 md:hidden ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Chat Window */}
      <div className="flex-1 relative ml-0 md:ml-1/3 flex flex-col">
        {/* Mobile top bar with menu button */}
        <div className="md:hidden flex items-center justify-between bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-3 shadow-lg">
          <button onClick={() => setSidebarOpen(true)} className="text-white text-2xl">☰</button>
          <span className="text-white font-bold truncate max-w-[70%]">{activeRoom || "Chatty"}</span>
          <div className="w-8" /> {/* spacing */}
        </div>

        {activeRoom ? (
          <ChatRoom roomId={activeRoom} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <img
              src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
              alt="WhatsChat Logo"
              className="w-36 opacity-70 mb-6"
            />
            <h2 className="text-2xl font-bold mb-2 text-purple-700">Welcome to Chatty</h2>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Select a conversation from the left to start chatting. Enjoy a vibrant, modern chat experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
