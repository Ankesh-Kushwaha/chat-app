import React from "react";
import { Github, Twitter, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-green-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="text-center lg:text-left">
          <h4 className="text-2xl font-bold text-green-900 dark:text-green-400">
            Chatty
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Realtime. Secure. Scalable.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
          <a href="#features" className="hover:text-green-700 dark:hover:text-green-400 transition">
            Features
          </a>
          <a href="#pricing" className="hover:text-green-700 dark:hover:text-green-400 transition">
            Pricing
          </a>
          <a href="#about" className="hover:text-green-700 dark:hover:text-green-400 transition">
            About
          </a>
          <a href="#contact" className="hover:text-green-700 dark:hover:text-green-400 transition">
            Contact
          </a>
        </nav>

        <div className="flex gap-4">
          <a href="https://github.com" aria-label="GitHub" className="p-2 bg-green-100 dark:bg-gray-800 rounded-full hover:bg-green-200 dark:hover:bg-gray-700 transition">
            <Github className="w-5 h-5 text-green-700 dark:text-green-300" />
          </a>
          <a href="https://twitter.com" aria-label="Twitter" className="p-2 bg-green-100 dark:bg-gray-800 rounded-full hover:bg-green-200 dark:hover:bg-gray-700 transition">
            <Twitter className="w-5 h-5 text-green-700 dark:text-green-300" />
          </a>
          <a href="mailto:hello@chatty.com" aria-label="Email" className="p-2 bg-green-100 dark:bg-gray-800 rounded-full hover:bg-green-200 dark:hover:bg-gray-700 transition">
            <Mail className="w-5 h-5 text-green-700 dark:text-green-300" />
          </a>
        </div>
      </div>

      <div className="text-center py-4 border-t border-green-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Chatty. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
