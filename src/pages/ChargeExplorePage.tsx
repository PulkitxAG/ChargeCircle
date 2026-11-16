import React, { useState } from 'react';
import { 
  Coffee, 
  Utensils, 
  Hotel, 
  MapPin, 
  Zap, 
  Percent, 
  Star, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Car,
  Bike
} from 'lucide-react';
import { BusinessOffer, Charger } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { getBusinessOffers, getChargerById } from '../services/storage';

interface ChargeExplorePageProps {
  onBookCharger: (charger: Charger) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const ChargeExplorePage: React.FC<ChargeExplorePageProps> = ({
  onBookCharger,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const offers = getBusinessOffers();

  const categories = ['All', 'Café', 'Restaurant', 'Hotel'];

  const filteredOffers = offers.filter(o => {
    if (selectedCategory === 'All') return true;
    return o.businessType.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleBookOffer = (offer: BusinessOffer) => {
    const charger = getChargerById(offer.chargerId);
    if (charger) {
      onBookCharger(charger);
    } else {
      onNavigate('find_chargers', { query: offer.businessName });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-14 mb-12 shadow-xl border border-slate-800">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Charge + Explore Program</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              "Charge Your Vehicle. Enjoy Your Time."
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Why wait by the roadside? Discover curated cafes, bistros, hotels, and dining hubs in Bengaluru, Delhi NCR, and Mumbai where you can plug in while sipping artisanal coffee or enjoying lunch.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Complimentary Drinks & Food Perks</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Reserved EV Parking Bays</span>
              </span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'All Destination Hubs' : `${cat}s`}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredOffers.length}</strong> partner venues with exclusive offers
          </div>
        </div>

        {/* Offers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffers.map((offer) => {
            const charger = getChargerById(offer.chargerId);

            return (
              <div 
                key={offer.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-card transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Promo Badge */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={offer.image} 
                      alt={offer.businessName} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />
                      <span>{offer.discountText}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{offer.rating}</span>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/80 to-transparent text-white flex items-center justify-between text-xs">
                      <span className="font-semibold">{offer.businessType} · {offer.foodType}</span>
                      <span className="text-slate-300">{offer.priceForTwo}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {offer.businessName}
                        </h3>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{offer.area}, {offer.city}</span>
                        </span>
                      </div>

                      <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 mt-2">
                        <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Exclusive Offer: {offer.title}</span>
                        </h4>
                        <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
                          {offer.description}
                        </p>
                      </div>
                    </div>

                    {/* Venue Perks */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Partner Perks</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {offer.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Charger details preview */}
                    {charger && (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">{charger.powerRatingKw} kW {charger.speedCategory.toUpperCase()}</span>
                            <span className="text-slate-400 block text-[11px]">{charger.connectorTypes.join(', ')}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-emerald-700">{BRAND_CONFIG.currency}{charger.pricingPerKwh}</span>
                          <span className="text-[10px] text-slate-400 block">/kWh</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">{offer.validity}</span>
                  <button
                    type="button"
                    onClick={() => handleBookOffer(offer)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                  >
                    <span>Book Charging Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Disclaimer */}
        <div className="mt-12 text-center text-xs text-slate-400">
          *All partner restaurant offers are illustrative demonstrations for the ChargeCircle marketplace prototype.
        </div>

      </div>
    </div>
  );
};
