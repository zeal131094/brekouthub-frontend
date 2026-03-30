import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Heart, UserPlus, MessageCircle, CheckCheck } from 'lucide-react';
import { getNotifications, markAllNotificationsRead } from '../api/messages';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_CONFIG = {
  like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10' },
  follow: { icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  message: { icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif) => {
    // Mark as read locally
    setNotifications(prev =>
      prev.map(n => n.id === notif.id ? { ...n, read: 1 } : n)
    );

    // Navigate based on type
    if (notif.type === 'message' && notif.from_user_id) {
      navigate(`/messages/${notif.from_user_id}`);
    } else if (notif.from_user_id) {
      navigate(`/profile/${notif.from_user_id}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-light transition-colors"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications"
          description="When athletes or coaches interact with your content, you'll see it here"
        />
      ) : (
        <div className="divide-y divide-border">
          {notifications.map(notif => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.like;
            const Icon = config.icon;

            return (
              <button
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full flex items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-surface/50 active:bg-surface/80 ${
                  !notif.read ? 'bg-primary/5' : ''
                }`}
              >
                {/* User avatar with notification type icon */}
                <div className="relative flex-shrink-0">
                  {notif.first_name ? (
                    <Avatar
                      user={{ first_name: notif.first_name, last_name: notif.last_name, avatar_url: notif.avatar_url }}
                      size="md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center border border-border">
                      <Bell size={20} className="text-muted" />
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${config.bg} ${config.color} rounded-full flex items-center justify-center border-2 border-bg`}>
                    <Icon size={10} fill="currentColor" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${!notif.read ? 'text-white font-medium' : 'text-muted'}`}>
                    {notif.first_name && (
                      <span className="font-semibold text-white">{notif.first_name} {notif.last_name} </span>
                    )}
                    {notif.message.replace(`${notif.first_name} ${notif.last_name} `, '')}
                  </p>
                  <span className="text-xs text-muted/70 mt-1 block">{timeAgo(notif.created_at)}</span>
                </div>

                {/* Unread indicator */}
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
