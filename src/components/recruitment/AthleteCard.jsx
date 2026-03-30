import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, BookOpen, Ruler } from 'lucide-react';
import { toggleWatchlist } from '../../api/recruitment';
import Avatar from '../ui/Avatar';
import { SportBadge, VerifiedBadge } from '../ui/Badge';

export default function AthleteCard({ athlete: initialAthlete }) {
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(initialAthlete);
  const [toggling, setToggling] = useState(false);

  const handleWatchlist = async (e) => {
    e.stopPropagation();
    if (toggling) return;

    setToggling(true);
    // Optimistic
    setAthlete(prev => ({ ...prev, on_watchlist: prev.on_watchlist ? 0 : 1 }));

    try {
      const result = await toggleWatchlist(athlete.id);
      setAthlete(prev => ({ ...prev, on_watchlist: result.onWatchlist ? 1 : 0 }));
    } catch {
      setAthlete(prev => ({ ...prev, on_watchlist: prev.on_watchlist ? 0 : 1 }));
    } finally {
      setToggling(false);
    }
  };

  const isOnWatchlist = Boolean(athlete.on_watchlist);

  return (
    <div
      className="bg-card rounded-2xl border border-border p-4 cursor-pointer active:scale-[0.99] transition-all duration-200 hover:border-primary/40"
      onClick={() => navigate(`/profile/${athlete.id}`)}
    >
      <div className="flex items-start gap-3">
        <Avatar user={athlete} size="lg" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <h3 className="font-bold text-white text-sm">
              {athlete.first_name} {athlete.last_name}
            </h3>
            {athlete.verified ? <VerifiedBadge /> : null}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {athlete.sport && <SportBadge sport={athlete.sport} />}
            {athlete.grade_level && (
              <span className="text-xs text-muted">{athlete.grade_level}</span>
            )}
          </div>

          {athlete.school && (
            <p className="text-xs text-muted mt-1 truncate">{athlete.school}</p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {athlete.height && (
              <div className="flex items-center gap-1 text-muted">
                <Ruler size={12} />
                <span className="text-xs">{athlete.height}</span>
              </div>
            )}
            {athlete.gpa && (
              <div className="flex items-center gap-1 text-muted">
                <BookOpen size={12} />
                <span className="text-xs">GPA {athlete.gpa}</span>
              </div>
            )}
            {athlete.post_count > 0 && (
              <span className="text-xs text-muted">{athlete.post_count} posts</span>
            )}
          </div>
        </div>

        {/* Watchlist button */}
        <button
          onClick={handleWatchlist}
          disabled={toggling}
          className={`p-2 rounded-xl transition-all duration-200 active:scale-90 flex-shrink-0 ${
            isOnWatchlist
              ? 'text-yellow-400 bg-yellow-400/15 border border-yellow-400/30'
              : 'text-muted hover:text-yellow-400 hover:bg-yellow-400/10 border border-border'
          }`}
          title={isOnWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Star size={18} fill={isOnWatchlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      {athlete.bio && (
        <p className="text-xs text-muted mt-3 line-clamp-2 leading-relaxed">{athlete.bio}</p>
      )}
    </div>
  );
}
