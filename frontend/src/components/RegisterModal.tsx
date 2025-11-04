/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState} from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Text } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const base_url = import.meta.env.VITE_BASE_URL;

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthSuccess?: (data: { name: string; email: string }) => void;
};

export const AuthModal: React.FC<Props> = ({ open, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login & register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
 

  if (!open) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isLogin
        ? `${base_url}/user/login`
        : `${base_url}/user/signup`;

      const payload = isLogin ? { email, password } : { name, email, password,bio };
      const res = await axios.post(url, payload);

      if (res.status === 200) {
        toast.success(isLogin ? "Login successful!" : "Account created!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.createdUser._id);
        const userId = res.data.createdUser._id;
        onAuthSuccess?.({ name: res.data.createdUser.name || name, email });
        onClose();
        resetForm();
        navigate(`/chatroom/${userId}`);
      } else {
        toast.error(isLogin ? "Login failed!" : "Registration failed!");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed mt-70 inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border p-6"
      >
        {/* Header shows pre-filled name/email if already logged in */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isLogin
              ? `Welcome back${name ? `, ${name}` : ""}`
              : `Create your account${name ? `, ${name}` : ""}`}
          </h4>
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Toggle Tabs */}
        <div className="flex mb-4 gap-4">
          <button
            className={`flex-1 py-1 font-semibold rounded ${
              isLogin
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-1 font-semibold rounded ${
              !isLogin
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <>
            <Input label="Name" icon={<User size={16} />} value={name} onChange={setName} />
            <Input label="bio" icon={<Text size={16} />} value={bio} onChange={setBio} />
            </>
          }
          <Input label="Email" icon={<Mail size={16} />} value={email} onChange={setEmail} />
         
          <Input
            label="Password"
            icon={<Lock size={16} />}
            value={password}
            onChange={setPassword}
            type="password"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-semibold text-white transition ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (isLogin ? "Logging in..." : "Creating...") : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

const Input = ({
  label,
  icon,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <label className="block">
    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</div>
    <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-indigo-300 dark:border-gray-700 dark:bg-gray-800">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100"
        required
      />
    </div>
  </label>
);
