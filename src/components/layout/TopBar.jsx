import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronLeft, MessageCircle } from 'lucide-react';
import { getNotifications } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';

// Titles for every route
const ROUTE_TITLES = {
  '/feed': 'Feed',
  '/network': 'Network',
  '/recruitment': 'Recruit',
  '/profile': 'Profile',
  '/messages': 'Messages',
  '/notifications': 'Notifications',
  '/create-post': 'Create Post',
};

function getPageTitle(pathname) {
  if (pathname === '/dashboard') return null;
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  if (pathname.startsWith('/network/')) return 'Business Detail';
  if (pathname.startsWith('/profile/')) return 'Profile';
  if (pathname.startsWith('/messages/')) return 'Conversation';
  return 'Back';
}

const MAIN_TABS = ['/dashboard', '/feed', '/network', '/recruitment', '/profile'];

export default function TopBar({ actions }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const isHome = location.pathname === '/dashboard';
  const showBack = !MAIN_TABS.includes(location.pathname);
  const title = getPageTitle(location.pathname);

  useEffect(() => {
    if (user) {
      getNotifications()
        .then(notifications => {
          const unread = notifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  return (
    <header className="flex-shrink-0 bg-surface/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-muted hover:text-white transition-colors rounded-xl hover:bg-card"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {isHome ? (
          <div className="text-xl font-black tracking-tight">
            <span className="text-white">BREKOUT</span>
            <span className="text-primary">HUB</span>
          </div>
        ) : (
          <h1 className="text-lg font-bold text-white">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {/* Hide message/bell icons on their own pages to avoid confusion */}
        {location.pathname !== '/messages' && (
          <button
            onClick={() => navigate('/messages')}
            className="relative p-2 text-muted hover:text-white transition-colors rounded-xl hover:bg-card"
          >
            <MessageCircle size={22} />
          </button>
        )}

        {location.pathname !== '/notifications' && (
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-muted hover:text-white transition-colors rounded-xl hover:bg-card"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
