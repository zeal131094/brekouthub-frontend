import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Edit3, BookOpen, Ruler, Weight, GraduationCap, Users, FileText } from 'lucide-react';
import { getUserPosts } from '../api/posts';
import { getUser } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Avatar from '../components/ui/Avatar';
import { SportBadge, VerifiedBadge, RoleBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(authUser);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!authUser) return;

    Promise.all([
      getUser(authUser.id),
      getUserPosts(authUser.id),
    ]).then(([userData, postsData]) => {
      setUser(userData);
      setPosts(postsData);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [authUser?.id]);

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  if (!user) return null;

  const statItems = [
    { label: 'Posts', value: user.post_count || posts.length, onClick: () => setActiveTab('posts') },
    { label: 'Followers', value: user.follower_count || 0, onClick: () => setActiveTab('followers') },
    { label: 'Following', value: user.following_count || 0, onClick: () => setActiveTab('following') },
  ];

  return (
    <div className="pb-6">
      {/* Profile header */}
      <div className="relative bg-gradient-to-br from-primary/20 to-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg/80 pointer-events-none" />

        {/* Top actions */}
        <div className="absolute top-3 right-4 z-10 flex gap-2">
          <button
            onClick={handleLogout}
            className="p-2.5 bg-surface/80 backdrop-blur-sm rounded-xl text-muted hover:text-red-400 transition-colors border border-border"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="relative px-4 pt-12 pb-6">
          {/* Avatar */}
          <div className="flex items-end gap-4 mb-4">
            <div className="relative">
              <Avatar user={user} size="3xl" className="border-4 border-bg shadow-2xl" />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full border-2 border-bg flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">
                  {user.first_name} {user.last_name}
                </h1>
                {user.verified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <RoleBadge role={user.role} />
                {user.sport && <SportBadge sport={user.sport} />}
              </div>
            </div>
          </div>

          {/* School */}
          {user.school && (
            <div className="flex items-center gap-2 text-muted text-sm mb-3">
              <GraduationCap size={15} />
              <span>{user.school}</span>
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <p className="text-white/80 text-sm leading-relaxed mb-4">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-1 mb-4">
            {statItems.map((stat, i) => (
              <button
                key={i}
                onClick={stat.onClick}
                className="flex-1 text-center py-3 bg-surface/60 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 transition-colors active:scale-95"
              >
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-muted mt-0.5">{stat.label}</div>
              </button>
            ))}
          </div>

          {/* Athlete details */}
          {user.role === 'player' && (
            <div className="grid grid-cols-2 gap-2">
              {user.grade_level && (
                <div className="bg-surface/60 backdrop-blur-sm rounded-xl px-3 py-2.5 flex items-center gap-2 border border-border/50">
                  <GraduationCap size={14} className="text-primary" />
                  <span className="text-sm text-white font-medium">{user.grade_level}</span>
                </div>
              )}
              {user.height && (
                <div className="bg-surface/60 backdrop-blur-sm rounded-xl px-3 py-2.5 flex items-center gap-2 border border-border/50">
                  <Ruler size={14} className="text-primary" />
                  <span className="text-sm text-white font-medium">{user.height}</span>
                </div>
              )}
              {user.weight && (
                <div className="bg-surface/60 backdrop-blur-sm rounded-xl px-3 py-2.5 flex items-center gap-2 border border-border/50">
                  <Weight size={14} className="text-primary" />
                  <span className="text-sm text-white font-medium">{user.weight} lbs</span>
                </div>
              )}
              {user.gpa && (
                <div className="bg-surface/60 backdrop-blur-sm rounded-xl px-3 py-2.5 flex items-center gap-2 border border-border/50">
                  <BookOpen size={14} className="text-primary" />
                  <span className="text-sm text-white font-medium">GPA {user.gpa}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-3 border-b border-border bg-surface sticky top-0 z-10">
        {[
          { id: 'posts', label: 'Posts', icon: <FileText size={16} /> },
          { id: 'followers', label: 'Followers', icon: <Users size={16} /> },
          { id: 'following', label: 'Following', icon: <Users size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-muted hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Posts grid */}
          {activeTab === 'posts' && (
            posts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-3">📸</p>
                <p className="text-white font-semibold">No posts yet</p>
                <p className="text-muted text-sm mt-1">Share your first highlight</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5 p-0.5">
                {posts.map(post => (
                  <div key={post.id} className="aspect-square bg-surface relative overflow-hidden">
                    {post.media_url ? (
                      <img
                        src={post.media_url}
                        alt={post.content?.slice(0, 30)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-card flex items-center justify-center p-2">
                        <p className="text-white text-xs text-center line-clamp-3">{post.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* Followers/Following tabs — show placeholder */}
          {(activeTab === 'followers' || activeTab === 'following') && (
            <FollowList userId={user.id} type={activeTab} />
          )}
        </>
      )}
    </div>
  );
}

function FollowList({ userId, type }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = type === 'followers'
      ? `/api/users/${userId}/followers`
      : `/api/users/${userId}/following`;
    api.get(endpoint)
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, type]);

  if (loading) return <div className="flex items-center justify-center h-32"><Spinner /></div>;

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-3xl mb-2">👥</p>
        <p className="text-muted text-sm">No {type} yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {users.map(u => (
        <button
          key={u.id}
          onClick={() => navigate(`/profile/${u.id}`)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors text-left"
        >
          <Avatar user={u} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm">{u.first_name} {u.last_name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {u.sport && <SportBadge sport={u.sport} />}
              {u.school && <span className="text-xs text-muted truncate">{u.school}</span>}
            </div>
          </div>
          <RoleBadge role={u.role} />
        </button>
      ))}
    </div>
  );
}
