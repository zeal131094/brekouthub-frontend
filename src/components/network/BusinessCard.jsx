import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Star } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';
import { StarDisplay } from './StarRating';

const CATEGORY_ICONS = {
  'Videographer': '🎬',
  'Photographer': '📸',
  'Trainer': '💪',
  'CPA': '📊',
  'NIL/Legal': '⚖️',
  'Nutrition': '🥗',
};

const CATEGORY_GRADIENTS = {
  'Videographer': 'from-purple-900/80 to-purple-800/40',
  'Photographer': 'from-blue-900/80 to-blue-800/40',
  'Trainer': 'from-green-900/80 to-green-800/40',
  'CPA': 'from-yellow-900/80 to-yellow-800/40',
  'NIL/Legal': 'from-red-900/80 to-red-800/40',
  'Nutrition': 'from-teal-900/80 to-teal-800/40',
};

export default function BusinessCard({ business }) {
  const navigate = useNavigate();
  const icon = CATEGORY_ICONS[business.category] || '🏢';
  const gradient = CATEGORY_GRADIENTS[business.category] || 'from-card to-surface';

  return (
    <div
      className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200 hover:border-primary/40"
      onClick={() => navigate(`/network/${business.id}`)}
    >
      {/* Card header image area */}
      <div className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <span className="text-4xl">{icon}</span>
        {business.featured ? (
          <span className="absolute top-2 right-2 text-xs font-semibold text-yellow-400 bg-yellow-400/15 border border-yellow-400/30 px-2 py-0.5 rounded-full">
            ⭐ Featured
          </span>
        ) : null}
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 flex-1">
            {business.name}
          </h3>
          {business.verified ? (
            <CheckCircle size={15} className="text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" />
          ) : null}
        </div>

        <CategoryBadge category={business.category} className="mb-2" />

        <div className="flex items-center gap-1 mt-2">
          <StarDisplay rating={business.avg_rating || 0} size={12} />
          <span className="text-xs text-muted ml-0.5">
            {Number(business.avg_rating || 0).toFixed(1)} ({business.review_count || 0})
          </span>
        </div>

        {business.city && (
          <div className="flex items-center gap-1 mt-1.5 text-muted">
            <MapPin size={11} />
            <span className="text-xs">{business.city}, {business.state}</span>
          </div>
        )}
      </div>
    </div>
  );
}
