import React, { useState, useEffect } from "react";
import logo from "../../public/logo-icon-2.jpg";
import { Menu, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthModal } from "../components/RegisterModal.tsx";
import { toast } from "react-toastify";
import axios from 'axios';

const Header: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
     const token = localStorage.getItem("token");
     const userId = localStorage.getItem("userId");
 
     if (token && userId) {
       // Fetch user info
       axios
         .get(`http://localhost:3000/api/user/get-profile/${userId}`, {
           headers: { Authorization: `Bearer ${token}` },
         })
         .then((res) => {
           const user = res.data.user;
           setUser({name:user.name,email:user.email})
         })
         .catch((err) => {
           toast.error("Failed to fetch user info:", err);
         });
     }
   }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setShowProfile(false);
    toast.success("Logged out successfully!");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-green-500/30 shadow-md">
            <img src={logo} className="w-full h-full object-cover" alt="Chatty logo" />
          </div>
          <div>
            <div className="font-extrabold text-green-800 dark:text-green-400 text-lg tracking-tight">Chatty</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Real-time messaging web</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          <a href="#features" className="hover:text-green-700 dark:hover:text-green-400 transition-colors">Features</a>
          <a href="#docs" className="hover:text-green-700 dark:hover:text-green-400 transition-colors">Docs</a>

          {!user ? (
            <button
              onClick={() => setShowAuth(true)}
              className="ml-2 flex items-center gap-2 rounded-lg bg-green-600 text-white px-5 py-2.5 font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all"
            >
              Login / Register
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <User size={16} /> {user.name}
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-72 border border-gray-200 dark:border-gray-700 flex flex-col gap-3 z-50"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl text-gray-700 dark:text-gray-300">
                        {user.name[0].toUpperCase()}
                      </div>
                      <h3 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mt-3"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {!user ? (
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all"
            >
              <User size={16} /> {user.name}
            </button>
          )}

          <button
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={(data) => setUser(data)}
      />
    </header>
  );
};

export default Header;
