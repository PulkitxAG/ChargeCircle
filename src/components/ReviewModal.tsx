import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquare } from 'lucide-react';
import { Charger, User, Review } from '../types';
import { addReview } from '../services/storage';

interface ReviewModalProps {
  charger: Charger;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  charger,
  currentUser,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [vehicle, setVehicle] = useState<string>(currentUser.vehicleModel || 'Tata Nexon EV Max');
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addReview({
        chargerId: charger.id,
        driverId: currentUser.id,
        driverName: currentUser.name,
        driverAvatar: currentUser.avatar,
        driverVehicle: vehicle,
        rating,
        comment: comment.trim()
      });
      setIsSubmitting(false);
      onSuccess(created);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Rate Your Charging Session</h3>
              <p className="text-xs text-slate-300 line-clamp-1">{charger.name}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Star selector */}
          <div className="text-center py-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overall Rating</div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              {rating === 5 && 'Outstanding! (5/5)'}
              {rating === 4 && 'Very Good (4/5)'}
              {rating === 3 && 'Average (3/5)'}
              {rating === 2 && 'Needs Improvement (2/5)'}
              {rating === 1 && 'Poor Experience (1/5)'}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Vehicle Charged</label>
            <input 
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="e.g. Ather 450X / Tata Nexon EV"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Review & Experience Notes</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the charger accessibility, host communication, charging speed, and parking space?"
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Post Verified Review'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
