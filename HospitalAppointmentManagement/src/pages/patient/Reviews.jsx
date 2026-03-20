import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, Quote, Calendar } from 'lucide-react';
import { apiService } from "../../services/api";
import { useAuth } from '../../context/AuthContext';

export default function Reviews() {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    apiService.getFeedback().then((data) => {
      setAllReviews(data.slice().reverse()); // newest first
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await apiService.submitFeedback({
      patient_name: user?.name || 'Anonymous',
      doctor_name: 'General',
      rating,
      comment: comment.trim(),
    });

    setSubmitted(true);
    setComment('');
    setRating(5);
    fetchReviews();
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderStars = (r) =>
    [1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} className={s <= r ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
    ));

  return (
    <>
      {/* Submit Review Form */}
      <div className="pd-card">
        <h3 className="pd-card-title">Rate &amp; Review</h3>

        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem 0', color: 'var(--success)' }}>
            <CheckCircle size={40} />
            <p style={{ fontWeight: 700 }}>Thank you! Your review has been submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="pd-form-group">
              <label className="pd-form-label">Star Rating</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="pd-btn pd-btn-secondary"
                    style={{ padding: '0.5rem' }}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={24}
                      style={{ color: s <= (hoverRating || rating) ? '#f59e0b' : '#cbd5e1' }}
                      fill={s <= (hoverRating || rating) ? '#f59e0b' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="pd-form-group">
              <label className="pd-form-label">Comment</label>
              <textarea
                className="pd-form-input"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                required
              />
            </div>
            <button type="submit" className="pd-btn pd-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={16} /> Submit Review
            </button>
          </form>
        )}
      </div>

      {/* All Reviews */}
      <div className="pd-card">
        <h3 className="pd-card-title">All Patient Reviews</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading reviews...</p>
        ) : allReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Quote size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {allReviews.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--card-border)',
                  padding: '1.25rem',
                  position: 'relative',
                }}
              >
                <Quote size={20} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--card-border)', opacity: 0.5 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.patient_name)}&background=random&size=40`}
                    alt={item.patient_name}
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{item.patient_name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: 2 }}>{renderStars(item.rating)}</div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Calendar size={10} />
                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>"{item.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
