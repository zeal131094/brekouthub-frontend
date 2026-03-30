import React from 'react';

const SPORT_BADGE_MAP = {
  'basketball': 'badge-basketball',
  'football': 'badge-football',
  'soccer': 'badge-soccer',
  'track & field': 'badge-track',
  'track': 'badge-track',
  'baseball': 'badge-baseball',
  'volleyball': 'badge-volleyball',
};

export function SportBadge({ sport, className = '' }) {
  if (!sport) return null;
  const badgeClass = SPORT_BADGE_MAP[sport.toLowerCase()] || 'badge-default';

  return (
    <span className={`sport-badge ${badgeClass} ${className}`}>
      {sport}
    </span>
  );
}

export function RoleBadge({ role, className = '' }) {
  const roleConfig = {
    player: { label: 'Athlete', class: 'bg-primary/20 text-primary border border-primary/30' },
    parent: { label: 'Parent', class: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    recruiter: { label: 'Recruiter', class: 'bg-accent/20 text-accent border border-accent/30' },
    business: { label: 'Business', class: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  };

  const config = roleConfig[role] || roleConfig.player;

  return (
    <span className={`sport-badge ${config.class} ${className}`}>
      {config.label}
    </span>
  );
}

export function VerifiedBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold text-blue-400 ${className}`}>
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

export function FeaturedBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full ${className}`}>
      ⭐ Featured
    </span>
  );
}

export function CategoryBadge({ category, className = '' }) {
  const categoryColors = {
    'Videographer': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Photographer': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Trainer': 'bg-green-500/20 text-green-400 border-green-500/30',
    'CPA': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'NIL/Legal': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Nutrition': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  };

  const colorClass = categoryColors[category] || 'bg-muted/20 text-muted border-muted/30';

  return (
    <span className={`sport-badge border ${colorClass} ${className}`}>
      {category}
    </span>
  );
}

export default SportBadge;
