import React, { useState } from "react";
import {
  Users,
  MessageCircle,
  Search,
  Send,
  CheckCircle2,
  LogIn,
  LogOut,
  UserCircle2,
} from "lucide-react";

type Room = {
  id: number;
  name: string;
  description: string;
  members: number;
};

const roomsData: Room[] = [
  { id: 1, name: "Tech Talk", description: "Discuss latest tech trends", members: 23 },
  { id: 2, name: "Gaming", description: "Game strategies & news", members: 17 },
  { id: 3, name: "Music", description: "Share your favorite songs", members: 10 },
  { id: 4, name: "Fitness", description: "Workout tips & plans", members: 8 },
  { id: 5, name: "Travel", description: "Travel stories & advice", members: 12 },
];

const CommunityPage: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [joinedRooms, setJoinedRooms] = useState<number[]>([]);
  const [messages, setMessages] = useState<
    { user: string; text: string; time: string; avatar: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const filteredRooms = roomsData.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!input.trim() || !activeRoom) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=You`;

    setMessages([
      ...messages,
      { user: "You", text: input, time, avatar },
    ]);
    setInput("");
  };

  const handleJoinLeaveRoom = (roomId: number) => {
    if (joinedRooms.includes(roomId)) {
      setJoinedRooms(joinedRooms.filter((id) => id !== roomId));
    } else {
      setJoinedRooms([...joinedRooms, roomId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <div className="max-w-7xl mx-auto px-6 py-10 w-full">
        <h2 className="text-5xl font-extrabold text-green-800 dark:text-green-400 text-center mb-10 drop-shadow">
          Community Rooms
        </h2>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-gray-200 transition"
          />
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {filteredRooms.map((room) => {
            const joined = joinedRooms.includes(room.id);
            return (
              <div
                key={room.id}
                className={`p-6 rounded-2xl bg-white/60 dark:bg-gray-800/70 backdrop-blur shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all border relative overflow-hidden ${
                  activeRoom?.id === room.id ? "border-green-500" : "border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setActiveRoom(room)}
                  >
                    <Users className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {room.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleJoinLeaveRoom(room.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
                      joined
                        ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-white hover:bg-green-200 dark:hover:bg-green-600"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-600 dark:hover:text-white"
                    }`}
                  >
                    {joined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Joined
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" /> Join
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {room.description}
                </p>

                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" /> {room.members} members
                </div>

                {joined && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-b-2xl" />
                )}
              </div>
            );
          })}
        </div>

        {/* Chat + Info Panel */}
        {activeRoom && (
          <div className="flex flex-col md:flex-row gap-6 animate-fadeIn">
            {/* Chat Area */}
            <div className="md:w-2/3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  #{activeRoom.name}
                </h3>
                <span className="text-sm text-gray-400">
                  {activeRoom.members} online
                </span>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 h-80 space-y-4 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 dark:scrollbar-thumb-green-600">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center mt-20">
                    No messages yet. Start the conversation 👋
                  </p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.user === "You" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[75%] ${
                          msg.user === "You" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <img
                          src={msg.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700"
                        />
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm ${
                            msg.user === "You"
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className="block text-[10px] text-gray-300 mt-1">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3 mt-auto">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-gray-200 transition"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full hover:opacity-90 flex items-center gap-1 transition"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="md:w-1/3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" /> About #{activeRoom.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {activeRoom.description}
              </p>
              <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mb-4">
                <Users className="w-4 h-4" /> {activeRoom.members} members currently
              </div>
              <button
                onClick={() => setActiveRoom(null)}
                className="mt-auto px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full hover:opacity-90 transition flex items-center gap-1 justify-center"
              >
                <LogOut className="w-4 h-4" /> Leave Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
