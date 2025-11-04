/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import UserCard from "../components/UserCard";
import FriendsSection from "../components/FriendsSection";
import ProfileModal from "../components/ProfileModal";
import SectionContainer from "../components/SectionConatiner"
import ScrollDots from "../components/ScrollDots";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.VITE_BASE_URL as string;

export type User = {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
};

type FriendRequest = {
  id: string;
  sender: User;
  receiver: User;
  status: "pending" | "accepted" | "declined";
};

const FriendsPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSections = 3;

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // --- Scroll controls ---
  const handleDotClick = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollRef.current.scrollTo({
      left: newIndex * window.innerWidth,
      behavior: "smooth",
    });
  };

  // --- Motion transforms ---
  const opacity1 = useTransform(scrollXProgress, [0, 0.3], [1, 0]);
  const opacity2 = useTransform(scrollXProgress, [0.3, 0.6], [0, 1]);
  const opacity3 = useTransform(scrollXProgress, [0.6, 1], [0, 1]);

  const x1 = useTransform(scrollXProgress, [0, 0.3], [0, -100]);
  const x2 = useTransform(scrollXProgress, [0.3, 0.6], [100, 0]);
  const x3 = useTransform(scrollXProgress, [0.6, 1], [100, 0]);

  // --- Data Fetch ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const resUsers = await axios.get<{ users: User[] }>(`${base_url}/user/all`, { headers });
        const filteredUsers = resUsers.data.users.filter((u) => u._id !== userId);
        setAllUsers(filteredUsers);

        const resFriends = await axios.get<{ friends: User[] }>(`${base_url}/user/get-friends`, { headers });
        setFriends(resFriends.data.friends);

        const resRequests = await axios.get<{
          pending: any[];
          sentRequest: any[];
        }>(`${base_url}/user/get-all-pending-request`, { headers });

        const incoming = resRequests.data.pending || [];
        setIncomingRequests(
          incoming.map((req: any) => ({
            id: req._id,
            sender: req.sender,
            receiver: req.receiver,
            status: req.status as "pending" | "accepted" | "declined",
          }))
        );

        const outgoing = resRequests.data.sentRequest || [];
        setOutgoingRequests(
          outgoing.map((req: any) => ({
            id: req._id,
            sender: req.sender,
            receiver: {
              _id: req.receiver,
              name: filteredUsers.find((u) => u._id === req.receiver)?.name || "Unknown",
            },
            status: req.status as "pending" | "accepted" | "declined",
          }))
        );
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [token, userId]);

  // --- Filters ---
  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  // --- Friend actions ---
  const sendFriendRequest = async (receiver: User) => {
    if (!userId) return toast.error("You must be logged in to send a friend request");
    try {
      const response = await axios.post<{ _id: string }>(
        `${base_url}/user/send/friend-request`,
        { senderId: userId, receiverId: receiver._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOutgoingRequests((prev) => [
        ...prev,
        { id: response.data._id, sender: { _id:userId, name: "You" }, receiver, status: "pending" },
      ]);

      toast.success(`Friend request sent to ${receiver.name}`);
    } catch (err: any) {
      toast.error(err.response.data || "Failed to send friend request");
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const res = await axios.post(`${base_url}/user/accept/friend-request`, { requestId }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 200) {
        const req = incomingRequests.find((r) => r.id === requestId);
        if (!req) return;
        setFriends((prev) => [...prev, req.sender]);
        setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
        toast.success(`Accepted ${req.sender.name}'s request`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  const declineRequest = (requestId: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    toast.info("Declined request");
  };

  // --- Scroll tracking ---
  useEffect(() => {
    if (!scrollRef.current) return;
    const handleScroll = () => {
      const index = Math.round(scrollRef.current!.scrollLeft / window.innerWidth);
      setCurrentIndex(index);
    };
    const ref = scrollRef.current;
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Styles ---
  const sectionStyle =
    "w-full max-w-3xl mx-auto bg-[#1a1a28] p-8 rounded-3xl shadow-xl border border-gray-700 space-y-6";

  // --- Render ---
  return (
    <div className="relative h-screen w-screen bg-[#050509] text-gray-200">
      <div ref={scrollRef} className="h-full w-full flex overflow-x-scroll snap-x snap-mandatory scroll-smooth">
        {/* Find Friends */}
        <SectionContainer style={{ opacity: opacity1, x: x1 }}>
          <div className={sectionStyle}>
            <button onClick={() => navigate(`/chatroom/${userId}`)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 cursor-pointer">
              <ArrowLeft size={18} /> Back
            </button>
            <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center neon-text">Find New Friends</h2>

            <input
              type="text"
              placeholder="Search for users..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="bg-[#0f0f16] text-gray-300 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full mb-6 shadow-inner"
            />

            <div className="grid md:grid-cols-2 gap-4">
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onClick={() => setSelectedUser(user)}
                    actionButton={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendFriendRequest(user);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all"
                      >
                        Add Friend
                      </button>
                    }
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-2">No users found.</p>
              )}
            </div>
          </div>
        </SectionContainer>

        {/* Friend Requests */}
        <SectionContainer style={{ opacity: opacity2, x: x2 }}>
          <div className={sectionStyle}>
            <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 cursor-pointer">
              <ArrowLeft size={18} /> Back
            </button>
            <h2 className="text-3xl font-bold text-green-400 mb-6 text-center neon-text">Friend Requests</h2>

            <FriendsSection title="Incoming Requests">
              {incomingRequests.length ? (
                incomingRequests.map((req) => (
                  <UserCard
                    key={req.id}
                    user={req.sender}
                    onClick={() => setSelectedUser(req.sender)}
                    actionButton={
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptRequest(req.id);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md shadow-md hover:shadow-lg transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            declineRequest(req.id);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-md hover:shadow-lg transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    }
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No incoming requests.</p>
              )}
            </FriendsSection>

            <FriendsSection title="Outgoing Requests">
              {outgoingRequests.length ? (
                outgoingRequests.map((req) => (
                  <UserCard
                    key={req.id}
                    user={req.receiver}
                    onClick={() => setSelectedUser(req.receiver)}
                    actionButton={<span className="text-gray-400 font-semibold">Pending...</span>}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No outgoing requests.</p>
              )}
            </FriendsSection>
          </div>
        </SectionContainer>

        {/* My Friends */}
        <SectionContainer style={{ opacity: opacity3, x: x3 }}>
          <div className={sectionStyle}>
            <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 cursor-pointer">
              <ArrowLeft size={18} /> Back
            </button>
            <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center neon-text">My Friends</h2>
            <div className="space-y-4">
              {friends.length ? (
                friends.map((friend) => (
                  <UserCard
                    key={friend._id}
                    user={friend}
                    onClick={() => setSelectedUser(friend)}
                    actionButton={<span className="text-green-400 font-semibold">Friends ✓</span>}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center">You have no friends yet.</p>
              )}
            </div>
          </div>
        </SectionContainer>
      </div>

      <ScrollDots currentIndex={currentIndex} total={totalSections} onDotClick={handleDotClick} />

      <motion.div
        style={{ scaleX: scrollXProgress }}
        className="fixed bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
      />

      <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default FriendsPage;
