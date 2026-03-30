import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, MessageCircle, Heart, Eye, Flame } from 'lucide-react';
import { getTop10 } from '../api/posts';
import Spinner from '../components/ui/Spinner';
import { SportBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PostCard from '../components/feed/PostCard';
import { useAuth } from '../context/AuthContext';

function formatCount(n) {
  if (!n) return '0';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTop10()
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Hero greeting */}
      <div className="relative px-4 pt-5 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />

        <div className="relative">
          <p className="text-muted text-sm">{greeting()},</p>
          <h1 className="text-2xl font-black text-white mt-0.5">
            {user?.first_name} {user?.last_name}
            <span className="ml-2 text-primary">👋</span>
          </h1>
          {user?.sport && (
            <div className="mt-2">
              <SportBadge sport={user.sport} />
            </div>
          )}
        </div>

        {/* Quick stats row */}
        <div className="flex gap-3 mt-4">
          {[
            { label: 'This Week', value: 'Top 10', icon: '🏆', color: 'text-yellow-400' },
            { label: 'Trending', value: '+18%', icon: '📈', color: 'text-green-400' },
            { label: 'Live Now', value: '247', icon: '🔴', color: 'text-red-400' },
          ].map((stat, i) => (
            <div key={i} className="flex-1 bg-card rounded-2xl border border-border px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm">{stat.icon}</span>
                <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-accent" />
          <h2 className="text-lg font-black text-white">TOP 10 THIS WEEK</h2>
        </div>
        <button
          onClick={() => navigate('/feed')}
          className="text-xs text-primary font-semibold hover:text-primary-light"
        >
          See All
        </button>
      </div>

      {error ? (
        <EmptyState icon="⚠️" title="Failed to load" description={error} />
      ) : posts.length === 0 ? (
        <EmptyState icon="🏆" title="No posts yet" description="Be the first to share your highlights!" />
      ) : (
        <div className="space-y-0">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} rank={index + 1} showRank />
          ))}
        </div>
      )}
    </div>
  );
}
