import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import { getConversations } from '../api/messages';
import Avatar from '../components/ui/Avatar';
import { SportBadge, RoleBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = conversations.filter(c =>
    !search || `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-white">Messages</h1>
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <MessageCircle size={16} className="text-primary" />
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="💬"
          title={search ? "No results" : "No messages yet"}
          description={search ? "Try a different search" : "Start connecting with coaches and athletes"}
        />
      ) : (
        <div className="divide-y divide-border">
          {filtered.map(conv => (
            <button
              key={conv.other_user_id}
              onClick={() => navigate(`/messages/${conv.other_user_id}`)}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-surface/50 transition-colors text-left active:bg-surface/80"
            >
              <div className="relative flex-shrink-0">
                <Avatar
                  user={{ first_name: conv.first_name, last_name: conv.last_name, avatar_url: conv.avatar_url }}
                  size="lg"
                />


              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">
                      {conv.first_name} {conv.last_name}
                    </span>
                  </div>
                  <span className="text-xs text-muted flex-shrink-0">{timeAgo(conv.last_message_at)}</span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <RoleBadge role={conv.role} className="text-[10px] py-0.5 px-1.5" />
                  {conv.sport && <SportBadge sport={conv.sport} className="text-[10px] py-0.5 px-1.5" />}
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-white font-medium' : 'text-muted'}`}>
                    {conv.sender_id === user?.id ? 'You: ' : ''}{conv.last_message}
                  </p>
                  {conv.unread_count > 0 && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
