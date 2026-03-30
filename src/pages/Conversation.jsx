import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Phone, Video, Info } from 'lucide-react';
import { getMessages, sendMessage } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import { SportBadge, RoleBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'Z').toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'Z');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Conversation() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    getMessages(userId)
      .then(({ messages: msgs, otherUser: ou }) => {
        setMessages(msgs);
        setOtherUser(ou);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    const content = text.trim();
    setText('');
    setSending(true);

    // Optimistic message
    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      receiver_id: parseInt(userId),
      content,
      created_at: new Date().toISOString().replace('Z', ''),
      first_name: user.first_name,
      last_name: user.last_name,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const sent = await sendMessage(userId, content);
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? sent : m));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setText(content);
    } finally {
      setSending(false);
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100dvh - 120px)' }}>
      {/* Conversation header */}
      {otherUser && (
        <div className="flex-shrink-0 px-4 py-3 bg-surface border-b border-border flex items-center gap-3">
          <Avatar user={otherUser} size="md" className="cursor-pointer" onClick={() => navigate(`/profile/${otherUser.id}`)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-white text-sm">{otherUser.first_name} {otherUser.last_name}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <RoleBadge role={otherUser.role} className="text-[10px]" />
              {otherUser.sport && <SportBadge sport={otherUser.sport} className="text-[10px]" />}
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 text-muted hover:text-white rounded-xl hover:bg-card transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 text-muted hover:text-white rounded-xl hover:bg-card transition-colors">
              <Video size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            {otherUser && (
              <div className="text-center">
                <Avatar user={otherUser} size="xl" className="mx-auto mb-3" />
                <p className="font-bold text-white">{otherUser.first_name} {otherUser.last_name}</p>
                <p className="text-muted text-sm mt-1">Say hello to start the conversation!</p>
              </div>
            )}
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted font-medium px-2">{date}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {msgs.map((msg, i) => {
                const isOwn = msg.sender_id === user?.id;
                const showAvatar = !isOwn && (i === 0 || msgs[i - 1]?.sender_id !== msg.sender_id);

                return (
                  <div key={msg.id} className={`flex items-end gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isOwn && (
                      <div className="w-7 flex-shrink-0">
                        {showAvatar && otherUser && (
                          <Avatar user={otherUser} size="xs" />
                        )}
                      </div>
                    )}
                    <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isOwn
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-surface text-white border border-border rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <span className={`text-[10px] text-muted mt-1 ${isOwn ? 'mr-1' : 'ml-1'}`}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex-shrink-0 px-4 py-3 bg-surface border-t border-border flex items-center gap-2"
      >
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Message ${otherUser?.first_name || ''}...`}
          className="flex-1 bg-card border border-border rounded-full px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:bg-primary-light transition-all active:scale-95 flex-shrink-0 shadow-glow-purple"
        >
          {sending ? <Spinner size="sm" color="white" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}
