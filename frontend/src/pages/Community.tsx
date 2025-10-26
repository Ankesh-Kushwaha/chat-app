/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {Users,MessageCircle, Search, Send, CheckCircle2, LogIn, LogOut, PlusCircle, XCircle} from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import avatar from '../../public/logo-icon.webp'

type Room = {
  id: string;
  name: string;
  description: string;
  members: string[];
};

const CommunityPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
  const [messages, setMessages] = useState<
    { user: string; text: string; time: string; avatar: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  

useEffect(() => {
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/community/get/all", {
        headers: {
          Authorization:`Bearer ${token}`
        }
      });

      if (res.data.success === true || res.data.success === "true") {
        const communities = res.data.communities;
        setRooms(communities);

    
        const joined = communities
          .filter((room: any) => room.members.includes(userId))
          .map((room: any) => room._id);
        setJoinedRooms(joined);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  fetchRooms();
}, []);


const handleJoinLeaveRoom = async (roomId: string) => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      toast.error("Please log in first");
      return;
    }

    const joined = joinedRooms.includes(roomId);
    const url = joined
      ? "http://localhost:3000/api/community/leave"
      : "http://localhost:3000/api/community/join";

    const res = await axios.post(
      url,
      { communityId: roomId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      if (joined) {
        // Leaving
        setJoinedRooms((prev) => prev.filter((id) => id !== roomId));
        setRooms((prev) =>
          prev.map((room) =>
            room._id === roomId
              ? {
                  ...room,
                  members: room.members.filter(
                    (id) => String(id) !== String(userId)
                  ),
                }
              : room
          )
        );
        toast.success("You left the community");
      } else {
        // Joining
        setJoinedRooms((prev) => [...prev, roomId]);
        setRooms((prev) =>
          prev.map((room) =>
            room._id === roomId
              ? {
                  ...room,
                  members: [...room.members, String(userId)],
                }
              : room
          )
        );
        toast.success("Joined the community successfully!");
      }
    } else {
      toast.error(res.data.message || "Failed to update community status");
    }
  } catch (error: any) {
    console.error("Join/Leave error:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};



  const handleCreateRoom = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newRoom.name.trim() || !newRoom.description.trim()) return;
      const res = await axios.post(
        'http://localhost:3000/api/community/create',
        {
          name: newRoom.name.trim(),
          description: newRoom.description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success == true) {
        toast.success(res.data.message);
      }
      else {
        toast.error("error while creating room")
      }
      setShowModal(false);
    }
    catch (err:any) {
      console.log("errror while creating room", err.message);
    }
  };

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <div className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 onClick={() => navigate('/')} className="text-5xl font-extrabold text-green-800 dark:text-green-400 text-center drop-shadow cursor-pointer flex justify-center">
            <img className="h-15 w-15 rounded-full m-1" src={avatar} alt="" />
           Create Your Room or Join One
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 md:mt-0 px-5 py-2 flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition"
          >
            <PlusCircle className="w-5 h-5" /> Create Room
          </button>
        </div>

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
            const joined = joinedRooms.includes(room._id);
            return (
              <div
                key={room._id}
                className={`p-6 rounded-2xl bg-white/60 dark:bg-gray-800/70 backdrop-blur shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all border relative overflow-hidden ${
                  activeRoom?.id === room._id ? "border-green-500" : "border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setActiveRoom(room)}
                  >
                    <Users className="w-5 h-5 text-green-600" />
                    <h3
                        onClick={() => {
                            room.members.includes(userId)
                              ? navigate(`/rooms/${room._id}`)
                              : toast.error("Please join the room first");
                        }} 
                      className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {room.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleJoinLeaveRoom(room._id)}
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
                <div className="text-xs text-green-500 flex items-center gap-1">
                  <Users className="w-4 h-4" /> {room.members.length} members
                </div>
                {joined && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-b-2xl" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Room Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeInUp">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-center text-green-700 dark:text-green-400 mb-4">
              Create a New Room
            </h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="Enter room name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newRoom.description}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, description: e.target.value })
                  }
                  placeholder="Enter room description"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-400"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-full hover:opacity-90 transition"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
