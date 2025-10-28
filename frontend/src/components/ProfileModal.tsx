import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from '../pages/FriendsPage'

interface ProfileModalProps {
  user: User | null;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => (
  <AnimatePresence>
    {user && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-[#15151f] text-gray-200 rounded-2xl p-6 w-80 border border-gray-700 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-blue-600 object-cover mb-3"
            />
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            <p className="text-gray-400 mt-1 mb-4">{user.bio}</p>
            <div className="flex gap-3 mt-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
                Message
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ProfileModal;
