import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Trash2, Edit2, Save, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import avatar from '../../public/logo-icon.webp'

const base_url = import.meta.env.VITE_BASE_URL;

const getUserProfile = async () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) throw new Error("User not logged in");

  const res = await axios.get(`${base_url}/user/get-profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


const updateUserProfile = async (data: any) => {
  console.log("Updated user data:", data);
  return data;
};

const deleteUserProfile = async () => {
  console.log("User deleted");
  return true;
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserProfile();
      setUser(data.user);
      setFormData(data.user);
      setAvatarPreview(avatar);
    };
    fetchUser();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Simple validation
    if (name === "email") {
      setErrors({
        ...errors,
        email: /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email",
      });
    }
    if (name === "username") {
      setErrors({
        ...errors,
        username: value.length >= 3 ? "" : "Username must be at least 3 characters",
      });
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (Object.values(errors).some((err) => err !== "")) {
      alert("Please fix form errors before saving.");
      return;
    }
    const updated = await updateUserProfile(formData);
    setUser(updated);
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  const handleDelete = async () => {
    await deleteUserProfile();
    alert("Profile deleted successfully!");
    navigate("/");
  };

  if (!user)
    return <div className="text-center mt-24 text-gray-400 dark:text-gray-300">Loading profile...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8"
        >
          {/* Avatar */}
          <div className="flex-shrink-0 relative">
            <img
              src={avatarPreview || user.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-indigo-600 shadow-md object-cover"
            />
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-500 transition-all">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <Edit2 size={16} />
              </label>
            )}
          </div>

          {/* User info */}
          <div className="flex-1 space-y-4 w-full">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-400">Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-900 text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg font-medium">{user.name}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-400">Username</label>
              {editMode ? (
                <>
                  <input
                    type="text"
                    name="username"
                    value={formData.userName}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-xl px-4 py-2 bg-gray-900 text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.userName ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </>
              ) : (
                <p className="mt-1 text-gray-300">@{user.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-400">Email</label>
              {editMode ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-xl px-4 py-2 bg-gray-900 text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </>
              ) : (
                <p className="mt-1 text-gray-300">{user.email}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-400">Bio</label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-900 text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-gray-300">{user.bio}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              {editMode ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
                >
                  <Save size={18} />
                  Save
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
              >
                <Trash2 size={18} />
                Delete Profile
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-2xl p-8 shadow-xl max-w-sm w-full text-center text-gray-100 relative"
          >
            <X
              size={20}
              className="absolute top-4 right-4 cursor-pointer hover:text-red-500"
              onClick={() => setShowDeleteModal(false)}
            />
            <h2 className="text-xl font-bold">Delete Profile?</h2>
            <p className="mt-2 text-gray-300">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 rounded-xl border border-gray-500 hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all font-semibold"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};
