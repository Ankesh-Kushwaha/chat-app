import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

type Props = {
open: boolean;
onClose: () => void;
onRegister?: (data: { name: string; email: string }) => void;
};

export const RegisterModal: React.FC<Props> = ({ open, onClose, onRegister }) => {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);

async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
await new Promise((r) => setTimeout(r, 600));
setSuccess(true);
onRegister?.({ name, email });
setTimeout(() => onClose(), 1000);
setLoading(false);
}

if (!open) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border p-6"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Create your account</h4>
        <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
          ✕
        </button>
      </div>



    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <Input label="Name" icon={<User size={16} />} value={name} onChange={setName} />
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
        className="w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold mt-2 hover:bg-indigo-700 transition"
      >
        {loading ? "Creating..." : success ? "Welcome!" : "Create account"}
      </button>
    </form>

    <p className="text-xs text-gray-500 mt-3">
      By continuing, you agree to our Terms and Privacy Policy.
    </p>
  </motion.div>
</div>);};

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
      }) => ( <label className="block"> <div className="text-xs text-gray-600 mb-1">{label}</div> <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-indigo-300">
      {icon}
      <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 outline-none text-sm"
      required
   />
 </div>
</label>
);
