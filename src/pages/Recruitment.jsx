import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, BookOpen, School } from 'lucide-react';
import { getAthletes, getWatchlist, getRecruiterUpdates } from '../api/recruitment';
import { useAuth } from '../context/AuthContext';
import AthleteCard from '../components/recruitment/AthleteCard';
import FilterSheet from '../components/recruitment/FilterSheet';
import Avatar from '../components/ui/Avatar';
import { SportBadge, VerifiedBadge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// Athlete view: recruiter updates
function AthleteView() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecruiterUpdates()
      .then(setUpdates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>;

  return (
    <div className="px-4 pb-6">
      {/* Header */}
      <div className="py-5 mb-2">
        <h1 className="text-2xl font-black text-white mb-1">Recruiter Updates</h1>
        <p className="text-muted text-sm">See what coaches are looking for</p>
      </div>

      {/* Info card */}
      <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-bold text-white text-sm">Coaches are watching!</p>
            <p className="text-muted text-xs mt-1 leading-relaxed">
              Keep your profile updated with recent highlights, grades, and stats. Recruiters search BrekoutHub daily.
            </p>
          </div>
        </div>
      </div>

      {updates.length === 0 ? (
        <EmptyState icon="📋" title="No updates yet" description="Check back soon for recruiter posts" />
      ) : (
        <div className="space-y-4">
          {updates.map(update => (
            <div key={update.id} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar user={{ first_name: update.first_name, last_name: update.last_name }} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-white text-sm">
                      Coach {update.first_name} {update.last_name}
                    </span>
                    {update.verified ? <VerifiedBadge /> : null}
                  </div>
                  {update.school && (
                    <p className="text-xs text-primary font-medium mt-0.5">{update.school}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {update.sport && <SportBadge sport={update.sport} />}
                    <span className="text-xs text-muted">{timeAgo(update.created_at)}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed">{update.content}</p>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">Recruiting Update</span>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <School size={12} />
                  <span>College Program</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Target Schools section */}
      <div className="mt-6">
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <School size={18} className="text-primary" />
          Target Schools
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'University of Texas', sport: 'Basketball', status: 'Interested' },
            { name: 'Michigan State', sport: 'Soccer', status: 'Watching' },
            { name: 'Duke University', sport: 'Basketball', status: 'Top Choice' },
            { name: 'UCLA', sport: 'Track', status: 'Interested' },
          ].map((school, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-3">
              <p className="font-semibold text-white text-xs leading-tight">{school.name}</p>
              <SportBadge sport={school.sport} className="mt-1" />
              <div className={`mt-2 text-xs font-medium px-2 py-0.5 rounded-full inline-block ${
                school.status === 'Top Choice'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-surface text-muted'
              }`}>
                {school.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Recruiter view: athlete search
function RecruiterView() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ sport: '', grade: '', gender: '', min_gpa: '', min_height: '' });
  const [activeTab, setActiveTab] = useState('search'); // search | watchlist
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const loadAthletes = (f = filters, q = search) => {
    setLoading(true);
    const params = { ...f };
    if (q.trim()) params.search = q.trim();
    Object.keys(params).forEach(k => !params[k] && delete params[k]);

    getAthletes(params)
      .then(setAthletes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const loadWatchlist = () => {
    setWatchlistLoading(true);
    getWatchlist()
      .then(setWatchlist)
      .catch(console.error)
      .finally(() => setWatchlistLoading(false));
  };

  useEffect(() => {
    loadAthletes();
    loadWatchlist();
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    if (val.length === 0 || val.length >= 2) {
      setTimeout(() => loadAthletes(filters, val), 300);
    }
  };

  const handleApplyFilters = (f) => {
    setFilters(f);
    loadAthletes(f, search);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <h1 className="text-2xl font-black text-white mb-1">Athlete Search</h1>
        <p className="text-muted text-sm">Find your next recruit</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            Search Athletes
          </button>
          <button
            onClick={() => { setActiveTab('watchlist'); loadWatchlist(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'watchlist'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            <Star size={14} fill={activeTab === 'watchlist' ? 'currentColor' : 'none'} />
            Watchlist
            {watchlist.length > 0 && (
              <span className="bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {watchlist.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'search' ? (
        <>
          {/* Search + Filter */}
          <div className="px-4 mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search athletes..."
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`relative p-3 rounded-xl border transition-all ${
                activeFiltersCount > 0
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'bg-card border-border text-muted hover:border-primary/50 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={18} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filters */}
          {activeFiltersCount > 0 && (
            <div className="px-4 mb-3 flex flex-wrap gap-2">
              {filters.sport && <FilterChip label={filters.sport} onRemove={() => handleApplyFilters({ ...filters, sport: '' })} />}
              {filters.grade && <FilterChip label={filters.grade} onRemove={() => handleApplyFilters({ ...filters, grade: '' })} />}
              {filters.gender && <FilterChip label={filters.gender} onRemove={() => handleApplyFilters({ ...filters, gender: '' })} />}
              {filters.min_gpa && <FilterChip label={`GPA ${filters.min_gpa}+`} onRemove={() => handleApplyFilters({ ...filters, min_gpa: '' })} />}
            </div>
          )}

          {/* Results count */}
          {!loading && (
            <div className="px-4 mb-3">
              <p className="text-xs text-muted">{athletes.length} athlete{athletes.length !== 1 ? 's' : ''} found</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
          ) : athletes.length === 0 ? (
            <EmptyState icon="🔍" title="No athletes found" description="Try adjusting your search or filters" />
          ) : (
            <div className="px-4 space-y-3">
              {athletes.map(athlete => (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="px-4">
          {watchlistLoading ? (
            <div className="flex items-center justify-center h-48"><Spinner size="lg" /></div>
          ) : watchlist.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="Watchlist is empty"
              description="Star athletes from your search to add them here"
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted mb-2">{watchlist.length} athlete{watchlist.length !== 1 ? 's' : ''} saved</p>
              {watchlist.map(athlete => (
                <AthleteCard key={athlete.id} athlete={athlete} />
              ))}
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <FilterSheet
          filters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-1.5 px-3 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs text-primary hover:bg-primary/25 transition-colors"
    >
      {label}
      <span className="text-primary/70">×</span>
    </button>
  );
}

export default function Recruitment() {
  const { user } = useAuth();

  if (user?.role === 'recruiter') {
    return <RecruiterView />;
  }

  return <AthleteView />;
}
