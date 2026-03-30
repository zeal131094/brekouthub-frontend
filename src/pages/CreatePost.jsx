import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, X, Hash, Tag } from 'lucide-react';
import { createPost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { SportBadge } from '../components/ui/Badge';

const SPORTS = ['Basketball', 'Football', 'Soccer', 'Track & Field', 'Baseball', 'Volleyball'];
const SAMPLE_IMAGES = [
  { label: '🏀 Basketball', url: 'https://picsum.photos/seed/bball1/600/400' },
  { label: '🏈 Football', url: 'https://picsum.photos/seed/football1/600/400' },
  { label: '⚽ Soccer', url: 'https://picsum.photos/seed/soccer1/600/400' },
  { label: '🏃 Track', url: 'https://picsum.photos/seed/track1/600/400' },
  { label: '⚾ Baseball', url: 'https://picsum.photos/seed/baseball1/600/400' },
  { label: '🏐 Volleyball', url: 'https://picsum.photos/seed/volleyball1/600/400' },
  { label: '💪 Training', url: 'https://picsum.photos/seed/training1/600/400' },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [sportTag, setSportTag] = useState(user?.sport || '');
  const [hashtags, setHashtags] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const charLimit = 500;

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Please write something first');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createPost({
        content: content.trim(),
        media_url: mediaUrl || null,
        media_type: mediaUrl ? 'image' : null,
        sport_tag: sportTag || null,
        hashtags: hashtags.trim() || null,
      });

      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-muted hover:text-white rounded-xl hover:bg-card transition-colors"
        >
          <X size={20} />
        </button>
        <h1 className="font-bold text-white">New Post</h1>
        <Button
          size="sm"
          loading={submitting}
          disabled={!content.trim()}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* User info */}
        <div className="flex items-center gap-3">
          <Avatar user={user} size="md" />
          <div>
            <p className="font-bold text-white text-sm">{user?.first_name} {user?.last_name}</p>
            {sportTag && <SportBadge sport={sportTag} className="mt-0.5" />}
          </div>
        </div>

        {/* Text area */}
        <div>
          <textarea
            value={content}
            onChange={e => {
              if (e.target.value.length <= charLimit) {
                setContent(e.target.value);
                setError('');
              }
            }}
            placeholder="Share your highlight, achievement, or update with the BrekoutHub community..."
            rows={6}
            className="w-full bg-transparent text-white placeholder-muted text-base leading-relaxed focus:outline-none resize-none"
            autoFocus
          />
          <div className="flex justify-end">
            <span className={`text-xs ${content.length > charLimit * 0.9 ? 'text-accent' : 'text-muted'}`}>
              {content.length}/{charLimit}
            </span>
          </div>
        </div>

        {/* Media preview */}
        {mediaUrl && (
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img src={mediaUrl} alt="Post media" className="w-full h-full object-cover" />
            <button
              onClick={() => setMediaUrl('')}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Image picker */}
        {showImagePicker && (
          <div className="bg-surface rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-white mb-3">Choose a photo</p>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_IMAGES.map(img => (
                <button
                  key={img.url}
                  onClick={() => {
                    setMediaUrl(img.url);
                    setShowImagePicker(false);
                  }}
                  className="relative rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all active:scale-95"
                  style={{ aspectRatio: '16/9' }}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                    <span className="text-xs text-white font-medium">{img.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Sport tag */}
        <div>
          <label className="text-xs font-semibold text-muted mb-2 flex items-center gap-1.5">
            <Tag size={13} />
            SPORT TAG
          </label>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map(sport => (
              <button
                key={sport}
                onClick={() => setSportTag(prev => prev === sport ? '' : sport)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  sportTag === sport
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-card text-muted hover:border-primary/50 hover:text-white'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <label className="text-xs font-semibold text-muted mb-2 flex items-center gap-1.5">
            <Hash size={13} />
            HASHTAGS
          </label>
          <input
            value={hashtags}
            onChange={e => setHashtags(e.target.value)}
            placeholder="#basketball #d1bound #grind"
            className="input-field text-sm"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border flex items-center gap-2 bg-surface">
        <button
          onClick={() => setShowImagePicker(!showImagePicker)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            showImagePicker || mediaUrl
              ? 'bg-primary/15 border-primary text-primary'
              : 'bg-card border-border text-muted hover:border-primary/50 hover:text-white'
          }`}
        >
          <Image size={16} />
          {mediaUrl ? 'Change Photo' : 'Add Photo'}
        </button>

        <div className="flex-1" />

        <p className="text-xs text-muted">
          {user?.sport && `Posting as ${user.role}`}
        </p>
      </div>
    </div>
  );
}
