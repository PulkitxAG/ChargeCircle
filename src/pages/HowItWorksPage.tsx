import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Home, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Phone,
  Clock,
  DollarSign
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

interface HowItWorksPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can any household 15A 3-pin socket be listed on ChargeCircle?",
      a: "No. For safety, a domestic electrical socket must never be treated as an EV charging station without verification. ChargeCircle requires every host station to pass a certified earthing test (neutral-to-earth potential under 2V), a dedicated miniature circuit breaker (MCB/RCBO), and proper wire gauge before it can receive the Verified badge."
    },
    {
      q: "How does double-booking prevention work?",
      a: "When a driver reserves a time slot (e.g. 2:00 PM to 4:00 PM on a specific date), that slot is locked in real-time in our database. Other drivers searching for that station will see that time slot marked as Booked/Unavailable, preventing overlaps."
    },
    {
      q: "Are electric two-wheelers (Ather, Ola, Chetak) supported?",
      a: "Yes! ChargeCircle is engineered specifically for India's EV landscape. We have dedicated station filters for electric 2-wheelers, including Ather Dot wallboxes and certified industrial 15A 3-pin sockets."
    },
    {
      q: "What is ChargeCircle's platform commission?",
      a: `ChargeCircle charges a nominal ${Math.round(BRAND_CONFIG.defaultCommissionRate * 100)}% platform service fee on successful bookings. This fee provides 24x7 driver customer support, host property damage protection cover, and automated payout processing.`
    },
    {
      q: "How do hosts receive payouts?",
      a: "Hosts receive automated weekly payouts directly into their linked bank accounts via UPI IMPS or NEFT. You can also trigger an instant payout from your Host Dashboard at any time."
    },
    {
      q: "What if I own a restaurant, café, or hotel?",
      a: "Businesses can join our 'Charge + Explore' destination charging network. EV drivers are high-intent customers who spend 45-90 minutes at your establishment. You can offer special perks (like a complimentary coffee or 10% food discount) to drive footfall."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Complete Ecosystem Guide</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How ChargeCircle Works
          </h1>
          <p className="text-sm text-slate-500">
            A trusted marketplace designed to make electric vehicle charging convenient for drivers and profitable for hosts.
          </p>
        </div>

        {/* 2 Big Column Comparison: Driver vs Host */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Driver Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">For EV Drivers</h2>
                <span className="text-xs text-slate-500">Cars & Electric Two-Wheelers</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Discover Nearby Verified Ports</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Browse community chargers at residential homes, cafes, and hotels with live availability and filter by connector (CCS2, Type 2, 15A Socket, Ather).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Reserve Your Slot in Advance</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Select date, time slot, and estimated duration. Instant double-booking prevention guarantees your bay is empty when you arrive.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Show Digital Pass & Charge</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Flash your QR check-in pass at the host gate or reception, plug in, and enjoy transparent ₹/kWh billing with no surprise surge fees.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('find_chargers')}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Chargers Near You</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Host Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">For Charging Hosts</h2>
                <span className="text-xs text-slate-500">Homes, Bungalows & Businesses</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">List Your Existing Station</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Register your wallbox or 15A point. Or request a turnkey hardware installation through our certified partner technicians.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pass Physical Electrical Audit</h4>
                  <p className="text-xs text-slate-500 mt-0.5">We verify your neutral earthing and breaker safety to protect your residential wiring and ensure EV driver peace of mind.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Earn Passive Monthly Income</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Receive direct automated bank payouts for every unit of electricity shared, with host damage protection included.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('become_host')}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>List Your Station in 5 Mins</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

        </div>

        {/* Safety & Electrical Standards Focus */}
        <div className="p-8 rounded-3xl bg-emerald-50/80 border border-emerald-200/90 shadow-sm mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Our 4-Point Safety & Trust Verification</h3>
              <p className="text-xs text-slate-600">Why ChargeCircle is safer than informal community sharing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1">
              <strong className="text-xs text-slate-900 block">1. Host Identity</strong>
              <p className="text-[11px] text-slate-500">Government ID and phone verification for every registered host.</p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1">
              <strong className="text-xs text-slate-900 block">2. Property Authority</strong>
              <p className="text-[11px] text-slate-500">Valid property ownership or society RWA parking authority check.</p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1">
              <strong className="text-xs text-slate-900 block">3. Grounding & Earthing</strong>
              <p className="text-[11px] text-slate-500">Certified neutral-earth potential below 2V with dedicated MCB breaker.</p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 space-y-1">
              <strong className="text-xs text-slate-900 block">4. BMS Compatibility</strong>
              <p className="text-[11px] text-slate-500">Tested communication protocol to prevent vehicle battery degradation.</p>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 py-1 text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 pb-1 pr-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
