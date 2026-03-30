import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { likePost } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { SportBadge, VerifiedBadge } from '../ui/Badge';
import PostMedia from './PostMedia';
import CommentSheet from './CommentSheet';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n || 0);
}

export default function PostCard({ post: initialPost, rank, showRank = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    // Optimistic update
    const wasLiked = post.is_liked;
    setPost(prev => ({
      ...prev,
      is_liked: wasLiked ? 0 : 1,
      like_count: wasLiked ? (prev.like_count - 1) : (prev.like_count + 1),
    }));

    try {
      const result = await likePost(post.id);
      setPost(prev => ({
        ...prev,
        is_liked: result.liked ? 1 : 0,
        like_count: result.like_count,
      }));
    } catch {
      // Revert on error
      setPost(prev => ({
        ...prev,
        is_liked: wasLiked ? 1 : 0,
        like_count: wasLiked ? (prev.like_count + 1) : (prev.like_count - 1),
      }));
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: `${post.first_name}'s post`, text: post.content });
    }
  };

  const userObj = {
    first_name: post.first_name,
    last_name: post.last_name,
    avatar_url: post.avatar_url,
  };

  const isLiked = Boolean(post.is_liked);
  const engagementScore = (post.like_count || 0) * 3 + (post.comment_count || 0) * 5 + (post.views || 0);

  return (
    <>
      <article className="bg-card border-b border-border/50">
        {/* Rank header for dashboard */}
        {showRank && rank && (
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <span className={`text-2xl font-black ${rank <= 3 ? 'text-accent' : 'text-muted'}`}>
              #{rank}
            </span>
            {rank <= 3 && <span className="text-sm">🔥</span>}
            <span className="ml-auto text-xs text-muted flex items-center gap-1">
              <span className="text-accent">🔥</span>
              {formatCount(engagementScore)} interactions
            </span>
          </div>
        )}

        {/* Post Header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <Avatar
            user={userObj}
            size="md"
            onClick={() => navigate(`/profile/${post.user_id}`)}
            className="cursor-pointer flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => navigate(`/profile/${post.user_id}`)}
                className="font-bold text-white text-sm hover:text-primary transition-colors"
              >
                {post.first_name} {post.last_name}
              </button>
              {post.verified ? <VerifiedBadge /> : null}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {post.sport_tag && <SportBadge sport={post.sport_tag} />}
              <span className="text-xs text-muted">{timeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <div className="px-4 pb-3">
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        )}

        {/* Media */}
        {post.media_url && (
          <PostMedia url={post.media_url} type={post.media_type} alt={post.content?.slice(0, 50)} />
        )}

        {/* Action Bar */}
        <div className="px-4 py-3 flex items-center gap-1">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
              isLiked
                ? 'text-red-500 bg-red-500/10'
                : 'text-muted hover:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={2} />
            <span className="text-sm font-medium">{formatCount(post.like_count)}</span>
          </button>

          {/* Comment */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 active:scale-95"
          >
            <MessageCircle size={18} strokeWidth={2} />
            <span className="text-sm font-medium">{formatCount(post.comment_count)}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted hover:text-green-400 hover:bg-green-500/10 transition-all duration-200 active:scale-95"
          >
            <Share2 size={18} strokeWidth={2} />
          </button>

          {/* Views */}
          <div className="ml-auto flex items-center gap-1 text-muted/60">
            <Eye size={14} />
            <span className="text-xs">{formatCount(post.views)}</span>
          </div>
        </div>
      </article>

      {showComments && (
        <CommentSheet
          postId={post.id}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setPost(prev => ({ ...prev, comment_count: (prev.comment_count || 0) + 1 }))}
        />
      )}
    </>
  );
}
