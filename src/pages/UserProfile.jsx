import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, UserPlus, UserMinus, BookOpen, Ruler, Weight, GraduationCap, Star } from 'lucide-react';
import { getUserPosts } from '../api/posts';
import { getUser, followUser } from '../api/messages';
import { toggleWatchlist } from '../api/recruitment';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import { SportBadge, VerifiedBadge, RoleBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [onWatchlist, setOnWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = parseInt(id);

  // Redirect to own profile
  useEffect(() => {
    if (authUser && userId === authUser.id) {
      navigate('/profile', { replace: true });
    }
  }, [userId, authUser, navigate]);

  useEffect(() => {
    Promise.all([
      getUser(userId),
      getUserPosts(userId),
    ]).then(([userData, postsData]) => {
      setUser(userData);
      setPosts(postsData);
      setFollowing(Boolean(userData.is_following));
      setFollowerCount(userData.follower_count || 0);
    }).catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);

    const wasFollowing = following;
    setFollowing(!wasFollowing);
    setFollowerCount(c => wasFollowing ? c - 1 : c + 1);

    try {
      const result = await followUser(userId);
      setFollowing(result.following);
      setFollowerCount(result.follower_count);
    } catch {
      setFollowing(wasFollowing);
      setFollowerCount(c => wasFollowing ? c + 1 : c - 1);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleWatchlist = async () => {
    if (watchlistLoading) return;
    setWatchlistLoading(true);
    try {
      const result = await toggleWatchlist(userId);
      setOnWatchlist(result.onWatchlist);
    } catch (err) {
      console.error(err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  if (error || !user) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted">{error || 'User not found'}</p>
        <button onClick={() => navigate(-1)} className="text-primary mt-2 text-sm">Go back</button>
      </div>
    );
  }

  const isRecruiter = authUser?.role === 'recruiter';

  return (
    <div className="pb-6">
      {/* Profile header */}
      <div className="relative bg-gradient-to-br from-primary/15 to-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg/70 pointer-events-none" />

        <div className="relative px-4 pt-8 pb-5">
          <div className="flex items-end gap-4 mb-4">
            <Avatar user={user} size="3xl" className="border-4 border-bg shadow-2xl" />
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl font-black text-white">{user.first_name} {user.last_name}</h1>
                {user.verified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <RoleBadge role={user.role} />
                {user.sport && <SportBadge sport={user.sport} />}
              </div>
            </div>
          </div>

          {user.school && (
            <div className="flex items-center gap-2 text-muted text-sm mb-2">
              <GraduationCap size={14} />
              <span>{user.school}</span>
            </div>
          )}

          {user.bio && (
            <p className="text-white/80 text-sm leading-relaxed mb-4">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-2 mb-4">
            {[
              { label: 'Posts', value: user.post_count || 0 },
              { label: 'Followers', value: followerCount },
              { label: 'Following', value: user.following_count || 0 },
            ].map((stat, i) => (
              <div key={i} className="flex-1 text-center py-2.5 bg-surface/60 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="text-lg font-black text-white">{stat.value}</div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                following
                  ? 'bg-surface border-border text-muted hover:text-red-400 hover:border-red-400/50'
                  : 'bg-primary border-primary text-white hover:bg-primary-light'
              }`}
            >
              {following ? <UserMinus size={16} /> : <UserPlus size={16} />}
              {following ? 'Following' : 'Follow'}
            </button>

            <button
              onClick={() => navigate(`/messages/${userId}`)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-card border border-border text-white hover:border-primary/50 transition-all"
            >
              <MessageCircle size={16} />
              Message
            </button>

            {isRecruiter && user.role === 'player' && (
              <button
                onClick={handleWatchlist}
                disabled={watchlistLoading}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  onWatchlist
                    ? 'bg-yellow-400/15 border-yellow-400/30 text-yellow-400'
                    : 'bg-card border-border text-muted hover:text-yellow-400 hover:border-yellow-400/30'
                }`}
              >
                <Star size={18} fill={onWatchlist ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Athlete details */}
      {user.role === 'player' && (
        <div className="px-4 py-3 grid grid-cols-2 gap-2">
          {user.grade_level && (
            <div className="bg-card rounded-xl px-3 py-2 flex items-center gap-2 border border-border">
              <GraduationCap size={14} className="text-primary" />
              <span className="text-sm text-white">{user.grade_level}</span>
            </div>
          )}
          {user.height && (
            <div className="bg-card rounded-xl px-3 py-2 flex items-center gap-2 border border-border">
              <Ruler size={14} className="text-primary" />
              <span className="text-sm text-white">{user.height}</span>
            </div>
          )}
          {user.weight && (
            <div className="bg-card rounded-xl px-3 py-2 flex items-center gap-2 border border-border">
              <Weight size={14} className="text-primary" />
              <span className="text-sm text-white">{user.weight} lbs</span>
            </div>
          )}
          {user.gpa && (
            <div className="bg-card rounded-xl px-3 py-2 flex items-center gap-2 border border-border">
              <BookOpen size={14} className="text-primary" />
              <span className="text-sm text-white">GPA {user.gpa}</span>
            </div>
          )}
        </div>
      )}

      {/* Posts grid */}
      <div className="px-4 pt-2">
        <h3 className="font-bold text-white text-sm mb-3">
          Posts ({posts.length})
        </h3>
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-3xl mb-2">📸</p>
            <p className="text-muted text-sm">No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {posts.map(post => (
              <div key={post.id} className="aspect-square bg-surface relative overflow-hidden rounded-sm">
                {post.media_url ? (
                  <img
                    src={post.media_url}
                    alt={post.content?.slice(0, 30)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-card flex items-center justify-center p-2">
                    <p className="text-white text-[10px] text-center line-clamp-4">{post.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
