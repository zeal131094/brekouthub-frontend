import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth pages
import Welcome from './pages/auth/Welcome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// App layout
import AppShell from './components/layout/AppShell';

// App pages
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import Network from './pages/Network';
import BusinessDetail from './pages/BusinessDetail';
import Recruitment from './pages/Recruitment';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Messages from './pages/Messages';
import Conversation from './pages/Conversation';
import Notifications from './pages/Notifications';
import CreatePost from './pages/CreatePost';

// Loading screen
import Spinner from './components/ui/Spinner';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black mb-4">
            <span className="text-white">BREKOUT</span>
            <span className="text-primary">HUB</span>
          </div>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected routes inside AppShell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="feed" element={<Feed />} />
        <Route path="network" element={<Network />} />
        <Route path="network/:id" element={<BusinessDetail />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:id" element={<UserProfile />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<Conversation />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="create-post" element={<CreatePost />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
