import React from "react";
import { motion } from "framer-motion";
import type { User } from '../pages/types.tsx'


interface UserCardProps {
  user: User;
  actionButton?: React.ReactNode;
  onClick?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, actionButton, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.03, backgroundColor: "#1a1a27" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    onClick={onClick}
    className="flex items-center justify-between bg-[#0f0f16] border border-gray-700 hover:border-blue-500 rounded-xl p-3 transition-all cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <img
        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user._id}`}
        alt={user.name}
        className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
      />
      <div>
        <h3 className="font-semibold text-gray-100">{user.name}</h3>
        <p className="text-sm text-gray-400">{user.bio}</p>
      </div>
    </div>
    {actionButton}
  </motion.div>
);

export default UserCard;
