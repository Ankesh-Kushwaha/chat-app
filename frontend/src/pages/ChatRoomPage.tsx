/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ChatRoom from "../components/chatRoom";
import logo from "../../public/logo-icon-2.jpg";
import { MessageSquare, Users, Settings } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = import.meta.env.VITE_BASE_URL;

interface Contact {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
}

const ChatRoomPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");


  const { userId: currentUserId } = useParams<{ userId: string }>();

  // Generate a deterministic roomId for any two users
  const generateRoomId = (userId1: string, userId2: string) => {
    const sorted = [userId1, userId2].sort();
    return `chat_${sorted[0]}_${sorted[1]}`;
  };

  // Fetch user's friends
  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${base_url}/user/get-friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setContacts(res.data.friends);
        }
      } catch (err: any) {
        console.error("Error while fetching friends:", err.message);
        toast.error("Error while getting user friends");
      }
    };

    fetchUserFriends();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#1E1F22] text-gray-200 font-inter">
      {/* Sidebar */}
      <div
        className={`bg-[#2B2D31] flex flex-col border-r border-[#3A3C40]
          fixed md:relative top-0 left-0 h-full z-20
          w-80 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#202225] border-b border-[#3A3C40] shadow-md">
          <h1
            onClick={() => navigate("/")}
            className="cursor-pointer text-lg font-bold text-white tracking-wide"
          >
            Chatty
          </h1>
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${currentUserId}`}
            alt="me"
            className="w-8 h-8 rounded-full border border-gray-500"
          />
          <button
            className="md:hidden text-white text-2xl ml-auto"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 text-sm rounded-md bg-[#1E1F22] border border-[#3A3C40] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3A3C40] p-3 space-y-2">
          <p className="uppercase text-xs text-gray-400 font-semibold tracking-widest mb-2">
            Contacts
          </p>

          {contacts.length > 0 ? (
            contacts
              .filter((contact) => {
                const query = searchQuery.toLowerCase();
                return (
                  contact.name.toLowerCase().includes(query) ||
                  contact.email.toLowerCase().includes(query)
                );
              })
              .map((contact) => {
                const thisRoomId = currentUserId
                  ? generateRoomId(currentUserId, contact._id)
                  : "";

                return (
                  <div
                    key={contact._id}
                    onClick={() => {
                      if (!currentUserId) return;
                      setActiveRoom(thisRoomId);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all ${
                      activeRoom === thisRoomId
                        ? "bg-[#404249] shadow-md"
                        : "hover:bg-[#34363B]"
                    }`}
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${contact._id}`}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-gray-100 truncate">
                        {contact.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500 text-sm">No contacts yet.</p>
          )}
       </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#3A3C40] bg-[#202225]">
          <div className="flex items-center justify-around text-gray-400">
            <MessageSquare className="w-5 h-5 hover:text-indigo-400 cursor-pointer" />
            <Users
              onClick={() => navigate("/friends")}
              className="w-5 h-5 hover:text-indigo-400 cursor-pointer"
            />
            <Settings
              onClick={() => navigate("/user-profile")}
              className="w-5 h-5 hover:text-indigo-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-10 md:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="md:hidden flex items-center justify-between bg-[#202225] p-3 border-b border-[#3A3C40]">
          <button onClick={() => setSidebarOpen(true)} className="text-white text-2xl">
            ☰
          </button>
          <span className="text-white font-semibold truncate max-w-[70%]">
            {activeRoom
              ? contacts.find(
                  (c) =>
                    generateRoomId(currentUserId!, c._id) === activeRoom
                )?.name ?? "Chat"
              : "Chatty"}
          </span>
          <div className="w-6" />
        </div>

        {activeRoom ? (
          <ChatRoom
            key={activeRoom} // force new instance for each friend
            roomId={activeRoom}
            roomName={
              contacts.find(
                (c) => generateRoomId(currentUserId!, c._id) === activeRoom
              )?.name ?? ""
            }
            users={contacts}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <img
              src={logo}
              alt="Chatty"
              className="w-32 rounded-full opacity-80 mb-6"
            />
            <h2 className="text-2xl font-bold text-indigo-400 mb-2">
              Welcome to Chatty
            </h2>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Select a contact to start chatting one-on-one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomPage;
