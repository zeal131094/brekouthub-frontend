import React, { useState } from 'react';

const AVATAR_COLORS = [
  'from-purple-600 to-purple-800',
  'from-orange-500 to-red-600',
  'from-blue-500 to-blue-700',
  'from-green-500 to-green-700',
  'from-pink-500 to-pink-700',
  'from-yellow-500 to-orange-600',
  'from-teal-500 to-teal-700',
  'from-indigo-500 to-indigo-700',
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(firstName, lastName) {
  const first = (firstName || '').charAt(0).toUpperCase();
  const last = (lastName || '').charAt(0).toUpperCase();
  return first + last || '?';
}

export default function Avatar({ user, size = 'md', className = '', onClick }) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-24 h-24 text-3xl',
    '3xl': 'w-28 h-28 text-4xl',
  };

  const initials = getInitials(user?.first_name, user?.last_name);
  const colorClass = getAvatarColor(user?.first_name || user?.email);
  const sizeClass = sizes[size] || sizes.md;
  const baseClass = `${sizeClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`;

  if (user?.avatar_url && !imgError) {
    return (
      <img
        src={user.avatar_url}
        alt={`${user.first_name || ''} ${user.last_name || ''}`}
        className={`${baseClass} object-cover`}
        onClick={onClick}
        onError={() => setImgError(true)}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      />
    );
  }

  return (
    <div
      className={`${baseClass} bg-gradient-to-br ${colorClass} text-white`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {initials}
    </div>
  );
}
