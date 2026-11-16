import React from 'react';
import { ShieldCheck, Home, Zap, CheckCircle2 } from 'lucide-react';
import { VerificationBadges } from '../types';

interface VerificationBadgePillProps {
  badges: VerificationBadges;
  compact?: boolean;
  showAll?: boolean;
}

export const VerificationBadgePill: React.FC<VerificationBadgePillProps> = ({
  badges,
  compact = false,
  showAll = false
}) => {
  const isFullyVerified = badges.identity && badges.propertyAuthority && badges.electricalSafety && badges.compatibility;

  if (compact) {
    if (isFullyVerified) {
      return (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
          title="Fully Verified: Identity, Property Authority, Electrical Earthing & Compatibility"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Host</span>
        </span>
      );
    }

    if (badges.electricalSafety) {
      return (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
          title="Electrical Earthing Verified"
        >
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Earthing OK</span>
        </span>
      );
    }

    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
        title="Pending Full Verification"
      >
        <span>Pending Inspection</span>
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span 
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
          badges.identity 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}
        title="Host identity and government ID verified"
      >
        <ShieldCheck className="w-3 h-3" />
        Identity
      </span>

      <span 
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
          badges.propertyAuthority 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}
        title="Property ownership / lease authority verified"
      >
        <Home className="w-3 h-3" />
        Property
      </span>

      <span 
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
          badges.electricalSafety 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}
        title="Certified earthing (< 2V neutral-to-earth) and dedicated MCB"
      >
        <Zap className="w-3 h-3" />
        Electrical Earthing
      </span>

      {(showAll || badges.compatibility) && (
        <span 
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
            badges.compatibility 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
          title="Tested and validated for EV BMS communication"
        >
          <CheckCircle2 className="w-3 h-3" />
          Compatibility
        </span>
      )}
    </div>
  );
};
