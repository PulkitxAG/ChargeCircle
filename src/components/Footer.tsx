import React from 'react';
import { 
  Zap, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  ExternalLink,
  Car,
  Bike
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                {BRAND_CONFIG.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India’s premier peer-to-peer EV charging marketplace. We connect electric car and two-wheeler owners with verified charging hosts at homes, cafes, restaurants, hotels, and retail destinations.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24x7 Driver & Host Helpline: {BRAND_CONFIG.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{BRAND_CONFIG.supportEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Certified Electrical Earthing Inspections
              </span>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('find_chargers')} className="hover:text-emerald-400 transition-colors">
                  Find EV Chargers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('charge_explore')} className="hover:text-emerald-400 transition-colors">
                  Charge + Explore (Dine & Shop)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-emerald-400 transition-colors">
                  Charging Cost Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how_it_works')} className="hover:text-emerald-400 transition-colors">
                  How ChargeCircle Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my_bookings')} className="hover:text-emerald-400 transition-colors">
                  Driver Bookings & QR Passes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Hosts & Businesses */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Hosts & Partners</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('become_host')} className="hover:text-emerald-400 transition-colors">
                  List Your Charger
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('become_host', { defaultTab: 'install' })} className="hover:text-emerald-400 transition-colors">
                  Request Charger Installation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('host_dashboard')} className="hover:text-emerald-400 transition-colors">
                  Host Earnings Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('become_host')} className="hover:text-emerald-400 transition-colors">
                  Restaurant & Café Partnerships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin_dashboard')} className="hover:text-emerald-400 transition-colors">
                  Admin Verification Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust, Safety & Cities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Supported Cities</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {BRAND_CONFIG.cities.map((city, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{city}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Safety & Demo Notice Banner */}
        <div className="my-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-200 block">Demonstration & Safety Notice:</strong>
              <span>
                ChargeCircle is an interactive prototype. Domestic 15A plugs are not automatically approved for public EV charging without professional earthing and MCB verification.
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 whitespace-nowrap">
            v1.0 MVP · Built for Indian EV Ecosystem
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-4">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name} Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Host Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
