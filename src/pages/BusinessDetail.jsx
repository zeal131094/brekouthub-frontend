import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Globe, CheckCircle, Star, X } from 'lucide-react';
import { getBusiness, reviewBusiness } from '../api/businesses';
import { CategoryBadge, FeaturedBadge } from '../components/ui/Badge';
import { StarDisplay, StarPicker } from '../components/network/StarRating';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';

const CATEGORY_ICONS = {
  'Videographer': '🎬',
  'Photographer': '📸',
  'Trainer': '💪',
  'CPA': '📊',
  'NIL/Legal': '⚖️',
  'Nutrition': '🥗',
};

const CATEGORY_GRADIENTS = {
  'Videographer': 'from-purple-800 to-purple-900',
  'Photographer': 'from-blue-800 to-blue-900',
  'Trainer': 'from-green-800 to-green-900',
  'CPA': 'from-yellow-800 to-yellow-900',
  'NIL/Legal': 'from-red-800 to-red-900',
  'Nutrition': 'from-teal-800 to-teal-900',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}yr ago`;
}

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getBusiness(id)
      .then(setBusiness)
      .catch(() => setError('Business not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async () => {
    if (!reviewRating) return;
    setSubmitting(true);
    try {
      await reviewBusiness(id, { rating: reviewRating, body: reviewText });
      const updated = await getBusiness(id);
      setBusiness(updated);
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewText('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  if (error || !business) return (
    <div className="p-6 text-center">
      <p className="text-muted">{error || 'Business not found'}</p>
      <button onClick={() => navigate(-1)} className="text-primary mt-2">Go back</button>
    </div>
  );

  const icon = CATEGORY_ICONS[business.category] || '🏢';
  const gradient = CATEGORY_GRADIENTS[business.category] || 'from-card to-surface';

  return (
    <div className="pb-24">
      {/* Hero header */}
      <div className={`relative bg-gradient-to-br ${gradient} pt-8 pb-6 px-4 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-black/30 border border-white/20 flex items-center justify-center text-4xl flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-black text-white text-xl leading-tight">{business.name}</h1>
                {business.verified && <CheckCircle size={18} className="text-blue-400 flex-shrink-0" fill="currentColor" />}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={business.category} />
                {business.featured && <FeaturedBadge />}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <StarDisplay rating={business.avg_rating || 0} size={14} showNumber />
                <span className="text-white/70 text-sm">({business.review_count} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* Description */}
        {business.description && (
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="font-bold text-white text-sm mb-2">About</h3>
            <p className="text-muted text-sm leading-relaxed">{business.description}</p>
          </div>
        )}

        {/* Contact info */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="font-bold text-white text-sm mb-3">Contact</h3>

          {business.city && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={15} className="text-muted" />
              </div>
              <span className="text-sm text-muted">{business.address && `${business.address}, `}{business.city}, {business.state}</span>
            </div>
          )}

          {business.phone && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone size={15} className="text-muted" />
              </div>
              <a href={`tel:${business.phone}`} className="text-sm text-primary hover:text-primary-light">{business.phone}</a>
            </div>
          )}

          {business.website && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe size={15} className="text-muted" />
              </div>
              <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-light truncate">
                {business.website}
              </a>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button fullWidth size="lg" variant="accent" onClick={() => { if (business.phone) window.open(`tel:${business.phone}`); else if (business.website) window.open(`https://${business.website}`, `_blank`); }}>
          Contact Business
        </Button>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Reviews ({business.review_count})</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewModal(true)}
            >
              Write Review
            </Button>
          </div>

          {(business.reviews || []).length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <p className="text-muted text-sm">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(business.reviews || []).map(review => (
                <div key={review.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-start gap-3">
                    <Avatar user={{ first_name: review.first_name, last_name: review.last_name }} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">
                          {review.first_name} {review.last_name}
                        </span>
                        <span className="text-xs text-muted">{timeAgo(review.created_at)}</span>
                      </div>
                      <StarDisplay rating={review.rating} size={12} className="mt-0.5" />
                      {review.body && <p className="text-sm text-muted mt-1.5 leading-relaxed">{review.body}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)} />
          <div className="relative w-full max-w-[430px] mx-auto bg-surface rounded-t-3xl border-t border-border p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white text-lg">Write a Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-1.5 text-muted hover:text-white rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted mb-3">Your rating</p>
              <StarPicker value={reviewRating} onChange={setReviewRating} />
            </div>

            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Share your experience with this business..."
              rows={4}
              className="input-field resize-none mb-4"
            />

            <Button
              fullWidth
              loading={submitting}
              disabled={!reviewRating}
              onClick={handleReview}
            >
              Submit Review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
