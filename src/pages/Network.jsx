import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { getBusinesses } from '../api/businesses';
import BusinessCard from '../components/network/BusinessCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const CATEGORIES = ['All', 'Videographer', 'Photographer', 'Trainer', 'CPA', 'NIL/Legal', 'Nutrition'];

export default function Network() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState('');

  const loadBusinesses = (cat = activeCategory, q = search) => {
    setLoading(true);
    const params = {};
    if (cat !== 'All') params.category = cat;
    if (q.trim()) params.search = q.trim();

    getBusinesses(params)
      .then(setBusinesses)
      .catch(() => setError('Failed to load businesses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    if (val.length === 0 || val.length >= 2) {
      setTimeout(() => loadBusinesses(activeCategory, val), 300);
    }
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    loadBusinesses(cat, search);
  };

  const featured = businesses.filter(b => b.featured);
  const regular = businesses.filter(b => !b.featured);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 bg-gradient-to-b from-primary/10 to-transparent">
        <h1 className="text-2xl font-black text-white mb-1">Business Network</h1>
        <p className="text-muted text-sm">Find sports services near you</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search businesses..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-white shadow-glow-purple'
                  : 'bg-card border-border text-muted hover:border-primary/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <EmptyState icon="⚠️" title="Failed to load" description={error} />
      ) : businesses.length === 0 ? (
        <EmptyState icon="🏢" title="No businesses found" description="Try adjusting your search or filters" />
      ) : (
        <>
          {/* Featured section */}
          {featured.length > 0 && (
            <div className="mb-5">
              <div className="px-4 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <h2 className="font-bold text-white text-sm">Featured Partners</h2>
                </div>
                <span className="text-xs text-muted">{featured.length} featured</span>
              </div>
              <div className="px-4 grid grid-cols-2 gap-3">
                {featured.map(biz => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            </div>
          )}

          {/* Near You section */}
          {regular.length > 0 && (
            <div>
              <div className="px-4 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                <h2 className="font-bold text-white text-sm">Near You</h2>
              </div>
              <div className="px-4 grid grid-cols-2 gap-3">
                {regular.map(biz => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
