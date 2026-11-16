import React, { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Star, 
  Clock, 
  ShieldCheck, 
  Car, 
  Bike, 
  CheckCircle2, 
  Phone, 
  Wifi, 
  Coffee, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Calendar, 
  AlertCircle,
  MessageSquare,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Charger, User, Review } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { VerificationBadgePill } from '../components/VerificationBadgePill';
import { getReviews } from '../services/storage';

interface ChargerDetailPageProps {
  charger: Charger;
  currentUser: User;
  onBack: () => void;
  onBook: (charger: Charger) => void;
  onOpenReviewModal: (charger: Charger) => void;
}

export const ChargerDetailPage: React.FC<ChargerDetailPageProps> = ({
  charger,
  currentUser,
  onBack,
  onBook,
  onOpenReviewModal
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const reviews = getReviews(charger.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isFavorited 
                  ? 'border-rose-200 bg-rose-50 text-rose-600' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="md:col-span-2 h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 relative shadow-sm border border-slate-200">
            <img 
              src={charger.images[selectedImageIndex] || charger.images[0]} 
              alt={charger.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-white backdrop-blur-md">
                {charger.powerRatingKw} kW · {charger.speedCategory.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                {BRAND_CONFIG.currency}{charger.pricingPerKwh}/kWh
              </span>
            </div>
          </div>

          <div className="flex md:flex-col gap-3 h-auto md:h-96 overflow-x-auto md:overflow-visible">
            {charger.images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`flex-1 min-w-[120px] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 hover:opacity-90'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="capitalize px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                    {charger.hostType} Charging Port
                  </span>
                  {charger.supportedVehicles === 'both' ? (
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" />
                      <Bike className="w-3.5 h-3.5" />
                      <span>2W & 4W</span>
                    </span>
                  ) : charger.supportedVehicles === 'two_wheeler' ? (
                    <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5" />
                      <span>Two-Wheelers Only</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" />
                      <span>Cars Only</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{charger.rating > 0 ? charger.rating.toFixed(1) : 'New'}</span>
                  <span className="text-slate-400 font-normal">({charger.reviewCount} verified reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {charger.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{charger.address}, {charger.landmark}, {charger.city} - {charger.pincode}</span>
              </p>

              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {charger.description}
              </p>
            </div>

            {/* Verification & Safety Guarantee Banner */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">ChargeCircle 4-Point Verified Station</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  Certified Safe
                </span>
              </div>

              <VerificationBadgePill badges={charger.verificationBadges} showAll />

              <div className="text-[11px] text-slate-600 bg-white/80 p-3 rounded-2xl border border-emerald-100 space-y-1">
                <p><strong>Electrical Earthing Certified:</strong> Neutral-to-earth potential checked under 2.0V with dedicated 32A/63A Miniature Circuit Breaker (MCB) and Residual Current Device (RCD).</p>
                <p><strong>Property Access Verified:</strong> Host has verified gated rights to allow EV charging guests during designated hours.</p>
              </div>
            </div>

            {/* Technical Specifications & Compatibility */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-bold text-base text-slate-900">Technical Specifications</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Power Output</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{charger.powerRatingKw} kW</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{charger.speedCategory.toUpperCase()}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Pricing Unit</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{BRAND_CONFIG.currency}{charger.pricingPerKwh}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Per Kilowatt-hour</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Parking Type</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{charger.parkingType}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Private Bay</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Operating Hours</span>
                  <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{charger.operatingHours.open} - {charger.operatingHours.close}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{charger.operatingHours.days.length} Days / Week</span>
                </div>
              </div>

              {/* Supported Connectors */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Available Connector Ports</h4>
                <div className="flex flex-wrap gap-2">
                  {charger.connectorTypes.map((c, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Host Amenities & Facilities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {charger.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Instructions */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Entry & Arrival Instructions</span>
                </h4>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {charger.accessInstructions}
                </p>
              </div>

            </div>

            {/* Host Profile Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={charger.hostAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'} 
                  alt={charger.hostName} 
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20" 
                />
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Station Host</div>
                  <h3 className="text-base font-extrabold text-slate-900">{charger.hostName}</h3>
                  <p className="text-xs text-slate-500">Response time: usually under 10 minutes · {charger.city}</p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  Auto-Approval Active
                </span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Verified Driver Reviews</h3>
                  <p className="text-xs text-slate-500">Feedback from drivers who completed charging sessions at this station</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenReviewModal(charger)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Write a Review</span>
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No reviews yet. Be the first to charge here and leave a review!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={rev.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                            alt="" 
                            className="w-8 h-8 rounded-xl object-cover" 
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{rev.driverName}</div>
                            <div className="text-[10px] text-slate-500">{rev.driverVehicle} · {rev.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Sticky Booking Widget (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-6">
              
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">Pricing</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-emerald-600">{BRAND_CONFIG.currency}{charger.pricingPerKwh}</span>
                    <span className="text-xs text-slate-500 font-normal">/kWh</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  charger.isAvailableNow ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {charger.isAvailableNow ? '● Available Today' : '● In Use Currently'}
                </span>
              </div>

              {/* Quick Estimate Highlight */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Typical 2-Hour Charge:</span>
                  <strong className="text-slate-900 font-bold">~{Math.round(charger.powerRatingKw * 2 * 0.85)} kWh</strong>
                </div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Estimated Total:</span>
                  <strong className="text-emerald-700 font-extrabold">
                    {BRAND_CONFIG.currency}{Math.round(charger.powerRatingKw * 2 * 0.85 * charger.pricingPerKwh * 1.12)}
                  </strong>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-emerald-200">
                  Includes 10% platform fee & 18% GST. No spot cancellation penalty.
                </div>
              </div>

              {/* Direct Booking CTA */}
              <button
                type="button"
                onClick={() => onBook(charger)}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Book This Charger Now</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="space-y-2.5 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Free cancellation up to 30 mins before slot</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant slot confirmation & QR check-in pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Host phone number shared after reservation</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
