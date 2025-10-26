import React from "react";
import { motion } from "framer-motion";
import { Send, Users } from "lucide-react";
import chatSvg from "../../public/undraw_chat-interface_vofq.png";
import { useNavigate } from "react-router-dom";

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  // Smooth scroll function
  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      {/* Decorative gradient orbs */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        className="absolute -top-32 -left-20 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-r from-indigo-400/30 to-pink-300/20 rounded-full blur-3xl animate-pulse"
      />
      <motion.div
        whileHover={{ scale: 1.05, rotate: -5 }}
        className="absolute bottom-0 right-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-gradient-to-tl from-purple-400/20 to-indigo-300/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left section — headline */}
        <section>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900"
          >
            Talk less,
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Connect deeper.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed"
          >
            <strong>Chatty</strong> is the next-gen chat platform designed for creators,
            communities, and product teams who care about <em>style</em> and <em>speed</em>.
            Real-time. Encrypted. Beautiful by default.
          </motion.p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(99,102,241,0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/chatroom')}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all w-full sm:w-auto"
            >
              <Send size={18} />
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(99,102,241,0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/community')}
              className="inline-flex items-center justify-center gap-3 bg-white/90 text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-md border border-indigo-300 hover:bg-indigo-50 transition-all w-full sm:w-auto"
            >
              <Users size={18} />
              Explore Community
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToFeatures}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all w-full sm:w-auto"
            >
              Learn More
            </motion.button>
          </div>

          {/* Stats cards */}
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 shadow-sm text-center"
            >
              <div className="text-xs text-gray-500 tracking-wide uppercase">Messages/sec</div>
              <div className="font-semibold text-xl text-gray-800 mt-1">10k+</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 shadow-sm text-center"
            >
              <div className="text-xs text-gray-500 tracking-wide uppercase">Latency (p95)</div>
              <div className="font-semibold text-xl text-gray-800 mt-1">120ms</div>
            </motion.div>
          </div>
        </section>

        {/* Right section — image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center relative mt-12 md:mt-0"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="absolute -z-10 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-tr from-indigo-300/40 to-pink-300/20 blur-3xl rounded-full"
          />
          <img
            src={chatSvg}
            alt="Chat Illustration"
            className="w-full h-full max-w-sm md:max-w-md rounded-3xl shadow-2xl ring-1 ring-indigo-200/30 hover:scale-[1.02] transition-transform duration-300"
          />
        </motion.div>
      </div>
    </main>
  );
};
