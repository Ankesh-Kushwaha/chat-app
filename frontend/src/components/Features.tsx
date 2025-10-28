import { motion } from "framer-motion";
import { Zap, Shield, Plug, Users } from "lucide-react";

export const Features = () => {
  const items = [
    { 
      title: "Realtime", 
      desc: "WebSocket-first for instant updates.", 
      icon: <Zap className="w-6 h-6 text-purple-600" /> 
    },
    { 
      title: "Secure", 
      desc: "End-to-end encrypted communication.", 
      icon: <Shield className="w-6 h-6 text-purple-600" /> 
    },
    { 
      title: "Integrations", 
      desc: "Plug-ins for auth, storage, analytics.", 
      icon: <Plug className="w-6 h-6 text-purple-600" /> 
    },
    { 
      title: "Scalable", 
      desc: "Supports thousands of concurrent rooms.", 
      icon: <Users className="w-6 h-6 text-blue-600" /> 
    },
  ];

  return (
    <section
      id="features"
      className="relative max-w-7xl mx-auto px-6 py-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white -z-10"></div>

      <h3 className="text-5xl font-extrabold text-blue-900 mb-12 text-center">
        Why Chatty?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((f,) => (
          <motion.div
            key={f.title}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="p-6 bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-lg transition relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 rounded-xl">{f.icon}</div>
              <h4 className="text-lg font-semibold text-green-900">{f.title}</h4>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
