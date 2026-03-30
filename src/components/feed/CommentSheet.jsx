import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { getComments, commentPost } from '../../api/posts';
import Avatar from '../ui/Avatar';
import Spinner from '../ui/Spinner';
import { useAuth } from '../../context/AuthContext';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommentSheet({ postId, onClose, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    getComments(postId)
      .then(setComments)
      .catch(console.error)
      .finally(() => setLoading(false));

    setTimeout(() => inputRef.current?.focus(), 300);
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    try {
      const comment = await commentPost(postId, text.trim());
      setComments(prev => [...prev, comment]);
      setText('');
      onCommentAdded?.();
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[430px] mx-auto bg-surface rounded-t-3xl border-t border-border animate-slide-up flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-bold text-white text-base">Comments</h3>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-card">
            <X size={18} />
          </button>
        </div>

        {/* Comments list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading ? (
            <div className="py-8"><Spinner className="mx-auto" /></div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-muted text-sm">No comments yet. Be the first!</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <Avatar user={{ first_name: comment.first_name, last_name: comment.last_name }} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="bg-card rounded-2xl rounded-tl-sm px-3 py-2">
                    <span className="font-semibold text-white text-sm">
                      {comment.first_name} {comment.last_name}
                    </span>
                    <p className="text-sm text-muted mt-0.5">{comment.content}</p>
                  </div>
                  <span className="text-xs text-muted/60 mt-1 ml-2">{timeAgo(comment.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border flex gap-3 items-center bg-surface">
          <Avatar user={user} size="sm" />
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="p-2.5 bg-primary rounded-full text-white disabled:opacity-40 hover:bg-primary-light transition-colors active:scale-95"
          >
            {submitting ? <Spinner size="sm" color="white" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
