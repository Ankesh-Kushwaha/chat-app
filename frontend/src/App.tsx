import React from 'react';
import type  { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatRoomPage from './pages/ChatRoomPage';
import CommunityPage from './pages/Community';
import RoomPage from './pages/RoomPage';
import FriendsPage from './pages/FriendsPage';
import { ProfilePage } from './pages/ProfilePage';
import {toast} from 'react-toastify'

// Define a type for ProtectedRoute props
interface ProtectedRouteProps {
  children: ReactNode;
}

// ProtectedRoute wrapper
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("You must be logged in to access this page!");
    return <Navigate to="/" replace />; // Redirect to homepage
  }

  return <>{children}</>; // Render children if token exists
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route 
        path='/chatroom/:userId' 
        element={
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/community' 
        element={
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/rooms/:roomId' 
        element={
          <ProtectedRoute>
            <RoomPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/friends' 
        element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/user-profile' 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;
