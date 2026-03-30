import React, { useState } from 'react';

export default function PostMedia({ url, type = 'image', alt = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!url || error) return null;

  const isYouTube = url.includes('youtube.com/embed') || url.includes('youtu.be');

  if (type === 'video' || isYouTube) {
    return (
      <div className="relative w-full overflow-hidden rounded-none" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={url}
          title={alt || 'Video'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full bg-surface overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
