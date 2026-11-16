import React from 'react';
import { 
  Zap, 
  MapPin, 
  Star, 
  Clock, 
  ShieldCheck, 
  Car, 
  Bike, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Charger } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { VerificationBadgePill } from './VerificationBadgePill';

interface ChargerCardProps {
  charger: Charger;
  isSelected?: boolean;
  onSelect?: (charger: Charger) => void;
  onBook: (charger: Charger) => void;
  onViewDetails: (charger: Charger) => void;
}

export const ChargerCard: React.FC<ChargerCardProps> = ({
  charger,
  isSelected = false,
  onSelect,
  onBook,
  onViewDetails
}) => {
  const getVehicleBadge = () => {
    if (charger.supportedVehicles === 'both') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Car className="w-3 h-3" />
          <Bike className="w-3 h-3" />
          <span>2W & 4W</span>
        </span>
      );
    }
    if (charger.supportedVehicles === 'two_wheeler') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Bike className="w-3 h-3" />
          <span>Two-Wheelers Only</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Car className="w-3 h-3" />
        <span>Cars Only</span>
      </span>
    );
  };

  const getSpeedBadge = () => {
    switch (charger.speedCategory) {
      case 'rapid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
            <Zap className="w-3 h-3 fill-white" />
            {charger.powerRatingKw} kW Rapid DC
          </span>
        );
      case 'fast':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
            <Zap className="w-3 h-3" />
            {charger.powerRatingKw} kW Fast AC
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-white">
            {charger.powerRatingKw} kW Standard
          </span>
        );
    }
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(charger)}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        isSelected 
          ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-card bg-emerald-50/10' 
          : 'border-slate-200 hover:border-emerald-300 hover:shadow-card'
      }`}
    >
      {/* Top Media Area */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={charger.images[0]} 
          alt={charger.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {getSpeedBadge()}
          {charger.verificationStatus === 'verified' && (
            <VerificationBadgePill badges={charger.verificationBadges} compact />
          )}
        </div>

        {/* Top Right Availability Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
            charger.isAvailableNow 
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
              : 'bg-slate-900/80 text-slate-300 border border-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${charger.isAvailableNow ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
            {charger.isAvailableNow ? 'Available' : 'Occupied'}
          </span>
        </div>

        {/* Bottom Bar on Image: Property & Distance */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex items-center justify-between text-white text-xs">
          <span className="capitalize font-medium tracking-wide flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {charger.hostType} Host: {charger.hostName}
          </span>
          {charger.distanceKm && (
            <span className="font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
              {charger.distanceKm} km away
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Vehicle Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {getVehicleBadge()}
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{charger.rating > 0 ? charger.rating.toFixed(1) : 'New'}</span>
              <span className="text-slate-400 font-normal">({charger.reviewCount})</span>
            </div>
          </div>

          {/* Charger Name & Location */}
          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
            {charger.name}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{charger.landmark}, {charger.city}</span>
          </p>

          {/* Connectors Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {charger.connectorTypes.map((conn, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
              >
                {conn}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Pricing</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-emerald-600">
                {BRAND_CONFIG.currency}{charger.pricingPerKwh}
              </span>
              <span className="text-xs text-slate-500 font-normal">/kWh</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(charger);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBook(charger);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all flex items-center gap-1 group/btn"
            >
              <span>Book</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
