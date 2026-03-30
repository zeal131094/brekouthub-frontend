import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { getFeed } from '../api/posts';
import PostCard from '../components/feed/PostCard';
import CreatePostButton from '../components/feed/CreatePostButton';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';

const STORIES = [
  { id: 1, name: 'Marcus', sport: 'Basketball', color: 'from-orange-500 to-red-500' },
  { id: 2, name: 'Sarah', sport: 'Soccer', color: 'from-blue-500 to-cyan-500' },
  { id: 3, name: 'DeAndre', sport: 'Football', color: 'from-green-500 to-emerald-500' },
  { id: 4, name: 'Aaliyah', sport: 'Track', color: 'from-red-500 to-pink-500' },
  { id: 5, name: 'Tyler', sport: 'Baseball', color: 'from-purple-500 to-violet-500' },
  { id: 6, name: 'Emma', sport: 'Volleyball', color: 'from-teal-500 to-cyan-500' },
];

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const loadMoreRef = useRef(null);

  const loadPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      const data = await getFeed(pageNum, 8);
      if (append) {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPosts = data.posts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
      } else {
        setPosts(data.posts);
      }
      setHasMore(pageNum < data.pagination.pages);
      setError('');
    } catch (err) {
      setError('Failed to load feed');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadPosts(1, false).finally(() => setLoading(false));
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          setLoadingMore(true);
          loadPosts(nextPage, true).finally(() => setLoadingMore(false));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, loadPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadPosts(1, false);
    setRefreshing(false);
  };

  return (
    <div className="relative">
      {/* Stories row */}
      <div className="bg-surface border-b border-border">
        <div className="px-4 py-3">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {/* Own story */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg border-2 border-primary/50">
                  {(user?.first_name || 'U').charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-bg flex items-center justify-center text-xs text-white font-bold">+</div>
              </div>
              <span className="text-[10px] text-muted font-medium">Your Story</span>
            </div>

            {STORIES.map(story => (
              <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-white font-bold text-lg border-2 border-transparent ring-2 ring-primary/60`}>
                  {story.name.charAt(0)}
                </div>
                <span className="text-[10px] text-white font-medium max-w-[56px] text-center truncate">{story.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refresh indicator */}
      {refreshing && (
        <div className="flex justify-center py-3 bg-primary/10 border-b border-border">
          <div className="flex items-center gap-2 text-primary text-sm">
            <RefreshCw size={14} className="animate-spin" />
            Refreshing...
          </div>
        </div>
      )}

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="Couldn't load feed"
          description={error}
          action={
            <button onClick={handleRefresh} className="btn-primary text-sm px-6 py-2.5">
              Try Again
            </button>
          }
        />
      ) : posts.length === 0 ? (
        <EmptyState icon="📱" title="Feed is empty" description="Follow athletes to see their posts here" />
      ) : (
        <>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
            {loadingMore && <Spinner size="sm" />}
            {!hasMore && posts.length > 0 && (
              <p className="text-xs text-muted py-4">You're all caught up! 🎉</p>
            )}
          </div>
        </>
      )}

      {/* Create post button - only for athletes and parents */}
      {(user?.role === 'player' || user?.role === 'parent') && (
        <CreatePostButton />
      )}
    </div>
  );
}
