import React from "react";
import logo from "../../public/logo-icon-2.jpg";
import { Menu } from "lucide-react";

type Props = {
  onRegisterClick: () => void;
};

const Header: React.FC<Props> = ({ onRegisterClick }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-green-500/30 shadow-md">
            <img src={logo} className="w-full h-full object-cover" alt="Chatty logo" />
          </div>
          <div>
            <div className="font-extrabold text-green-800 dark:text-green-400 text-lg tracking-tight">
              Chatty
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Real-time messaging web
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          <a
            href="#features"
            className="hover:text-green-700 dark:hover:text-green-400 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#docs"
            className="hover:text-green-700 dark:hover:text-green-400 transition-colors duration-200"
          >
            Docs
          </a>
          <button
            onClick={onRegisterClick}
            className="ml-2 inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-green-700 hover:shadow-md focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-200"
          >
            Register
          </button>
        </nav>

        {/* Mobile Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all"
          >
            Register
          </button>

          <button
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
