import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Car, 
  Bike, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Coffee, 
  Home, 
  CheckCircle2, 
  Star,
  Users,
  Percent,
  Sliders,
  ChevronRight,
  Gauge,
  Navigation,
  Compass,
  Activity,
  Fuel,
  Info,
  Layers,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  Maximize2
} from 'lucide-react';
import { Charger, User } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { ChargerCard } from '../components/ChargerCard';
import { MapLeaflet } from '../components/MapLeaflet';

interface HomePageProps {
  chargers: Charger[];
  currentUser: User;
  onNavigate: (page: string, params?: any) => void;
  onSelectCharger: (charger: Charger) => void;
  onBookCharger: (charger: Charger) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  chargers,
  currentUser,
  onNavigate,
  onSelectCharger,
  onBookCharger
}) => {
  // Hero Search States
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [vehicleType, setVehicleType] = useState<'all' | 'two_wheeler' | 'four_wheeler'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // =========================================================================
  // JESKO JETS STYLE: FLEET SWITCHER (CAR, SCOOTER, HYPERCHARGER)
  // =========================================================================
  type FleetTab = 'car' | 'scooter' | 'charger';
  const [activeFleetTab, setActiveFleetTab] = useState<FleetTab>('car');

  const fleetData = {
    car: {
      id: 'car',
      tabLabel: '01 / ELECTRIC CAR',
      splitLeft: 'Charge in',
      splitRight: 'Silence',
      subLeft: 'Energy that moves with you.',
      modelTag: 'TATA NEXON EV MAX & PORSCHE TAYCAN READY',
      description:
        'Engineered for effortless intercity mobility. Access certified residential wallboxes, boutique café chargers, and high-voltage highway hyperchargers with guaranteed IS 17017 earthing integrity.',
      image: '/images/luxury_ev_car.jpg',
      alt: 'Luxury Electric Sedan Top-down',
      stats: [
        { label: 'Max Certified Range', value: '453 KM' },
        { label: 'DC Hypercharge Rate', value: '50 kW' },
        { label: 'Neutral-to-Earth', value: '< 1.8 V' },
        { label: 'Verified Tariffs', value: '₹14/kWh' }
      ],
      features: [
        'Liquid-cooled CCS2 fast charging up to 50 kW',
        'Automatic reservation lock to eliminate queueing',
        'Direct UPI & auto-metered kilowatt billing'
      ]
    },
    scooter: {
      id: 'scooter',
      tabLabel: '02 / SMART TWO-WHEELER',
      splitLeft: 'Ride in',
      splitRight: 'Agility',
      subLeft: 'Urban freedom with zero compromise.',
      modelTag: 'ATHER 450X APEX & OLA S1 PRO COMPATIBLE',
      description:
        'India’s largest verified network for electric two-wheelers. Plug into dedicated 15A weatherproof points and Ather Dot hubs with built-in RCBO shock protection and sub-₹1/km running costs.',
      image: '/images/luxury_ev_scooter.jpg',
      alt: 'Luxury Smart Scooter Top-down',
      stats: [
        { label: 'Urban Commute Range', value: '146 KM' },
        { label: 'Full Top-Up Time', value: '45 MIN' },
        { label: 'Surge Protection', value: 'IP67 RCBO' },
        { label: 'Cost Per Kilometer', value: '₹0.48' }
      ],
      features: [
        'Dedicated surge-protected 15A 3-pin domestic outlets',
        'Verified neutral-to-earth potential under 2.0V',
        'Safe overnight charging at residential host villas'
      ]
    },
    charger: {
      id: 'charger',
      tabLabel: '03 / HYPERCHARGER BAY',
      splitLeft: 'Power in',
      splitRight: 'Speed',
      subLeft: 'Commercial-grade infrastructure at your fingertips.',
      modelTag: 'VOLTCIRCLE ARCHITECTURAL CHARGING PEDESTAL',
      description:
        'Designed with surgical precision for both residential estates and commercial destinations. Delivering 7.2 kW AC through 120 kW DC with smart load management and automated telemetry.',
      image: '/images/luxury_ev_charger.jpg',
      alt: 'Architectural EV Hypercharger Top-down',
      stats: [
        { label: 'Continuous Output', value: '7.2 – 50 kW' },
        { label: 'Certified Uptime', value: '99.8%' },
        { label: 'Safety Standard', value: 'IS 17017' },
        { label: 'Host Net Commission', value: '85%' }
      ],
      features: [
        'Dual protocol support for 2-wheelers and 4-wheelers',
        'Dynamic load balancing with solar integration',
        'Full host telemetry app and instant UPI settlement'
      ]
    }
  };

  const activeFleet = fleetData[activeFleetTab];

  // 3D Parallax Tilt Effect on Mouse Move
  const heroRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // =========================================================================
  // INTERACTIVE CORRIDOR DRIVE / FLIGHT PLANNER (JESKO JETS FLIGHT PATH STYLE)
  // =========================================================================
  const corridors = [
    {
      id: 'blr_mys',
      name: 'Bengaluru ↔ Mysuru Expressway',
      tag: 'Expressway Corridors',
      distanceKm: 145,
      from: 'Bengaluru (Koramangala)',
      to: 'Mysuru (Heritage Palace)',
      stops: 1,
      recommendedHost: 'Koramangala 4th Block Villa Bay',
      cafeStop: 'Third Wave Coffee Indiranagar',
      hostType: 'Villa / Café'
    },
    {
      id: 'mum_pun',
      name: 'Mumbai ↔ Pune Expressway',
      tag: 'Ghat Corridors',
      distanceKm: 148,
      from: 'Mumbai (Bandra West)',
      to: 'Pune (Koregaon Park)',
      stops: 1,
      recommendedHost: 'Blue Tokai Lower Parel Hub',
      cafeStop: 'German Bakery Koregaon Park',
      hostType: 'Gourmet Café'
    },
    {
      id: 'del_jpr',
      name: 'Delhi NCR ↔ Jaipur Highway',
      tag: 'Golden Triangle',
      distanceKm: 270,
      from: 'Delhi (Connaught Place)',
      to: 'Jaipur / Neemrana Resort',
      stops: 2,
      recommendedHost: 'DLF Cyber Hub Super Bay',
      cafeStop: 'Burma Burma Cyber Hub',
      hostType: 'Commercial Hub'
    },
    {
      id: 'hyd_vja',
      name: 'Hyderabad ↔ Vijayawada Corridor',
      tag: 'Tech Corridors',
      distanceKm: 275,
      from: 'Hyderabad (Hitec City)',
      to: 'Suryapet Highway Junction',
      stops: 2,
      recommendedHost: 'Cyber Towers Fast Hub',
      cafeStop: 'Hitec City Food Court',
      hostType: 'High-Speed Hub'
    }
  ];

  const [selectedCorridor, setSelectedCorridor] = useState(corridors[0]);
  const [corridorVehicle, setCorridorVehicle] = useState<'nexon' | 'ather' | 'mg_zs'>('nexon');

  const vehicleSpecs = {
    nexon: { name: 'Tata Nexon EV Max', battery: 40.5, range: 453, rate: 7.2, type: 'Car' },
    ather: { name: 'Ather 450X Gen 3', battery: 3.7, range: 146, rate: 3.3, type: '2W' },
    mg_zs: { name: 'MG ZS EV Long Range', battery: 50.3, range: 461, rate: 50.0, type: 'Car' }
  };

  const activeVehicle = vehicleSpecs[corridorVehicle];
  const corridorStopsNeeded = Math.max(1, Math.ceil(selectedCorridor.distanceKm / (activeVehicle.range * 0.75)) - 1);
  const corridorEnergyNeeded = Math.round((selectedCorridor.distanceKm / 7.2) * 10) / 10;
  const corridorEstimatedCost = Math.round(corridorEnergyNeeded * 16);
  const corridorPetrolCost = Math.round(selectedCorridor.distanceKm * 7.5);
  const corridorSavings = Math.max(0, corridorPetrolCost - corridorEstimatedCost);

  // =========================================================================
  // HOST EARNINGS CALCULATOR
  // =========================================================================
  const [sessionsPerDay, setSessionsPerDay] = useState<number>(3);
  const [unitRate, setUnitRate] = useState<number>(16);
  const estimatedMonthlyGross = Math.round(sessionsPerDay * 15 * unitRate * 30);
  const platformFee = Math.round(estimatedMonthlyGross * BRAND_CONFIG.defaultCommissionRate);
  const estimatedHostEarnings = estimatedMonthlyGross - platformFee;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('find_chargers', {
      city: selectedCity,
      vehicleType,
      query: searchQuery
    });
  };

  // Featured verified chargers
  const featuredChargers = chargers.filter(c => c.verificationStatus === 'verified').slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased">
      
      {/* =========================================================================
          TOP EDITORIAL SUB-NAV (JESKO JETS STYLE)
      ========================================================================= */}
      <div className="border-b border-neutral-200/80 bg-[#FAF8F3]/90 backdrop-blur-md sticky top-16 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-neutral-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE NETWORK: 684+ VERIFIED BAYS
            </span>
            <span className="hidden md:inline-block text-neutral-400">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-neutral-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% IS 17017 EARTHING CERTIFIED
            </span>
          </div>

          <div className="flex items-center gap-5 text-neutral-600 font-medium">
            <a href="tel:+918047108800" className="hidden sm:flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 80 4710 8800</span>
            </a>
            <button
              onClick={() => onNavigate('site_partnerships')}
              className="text-xs font-semibold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Space Co-Hosting</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
            <button
              onClick={() => onNavigate('become_host')}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-emerald-700 underline underline-offset-4"
            >
              Become a Host →
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          1. THE ICONIC JESKO JETS HERO SECTION
             Split Headline + Vertical Vehicle Centerpiece + Floating Reservation Pill
      ========================================================================= */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-[#FAF8F3] via-[#F6F3EC] to-[#EFECE4]"
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.8),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Switcher: Our Fleet / Charging Classes */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-full bg-neutral-200/60 backdrop-blur-md border border-neutral-300/60 shadow-xs">
              {(['car', 'scooter', 'charger'] as FleetTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFleetTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    activeFleetTab === tab
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-300/40'
                  }`}
                >
                  {fleetData[tab].tabLabel}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN HERO SPLIT GRID WITH VERTICAL CENTERPIECE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4 min-h-[580px]">
            
            {/* LEFT COLUMN: "Charge in" / "Ride in" + Subtitle */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left lg:pr-4 order-1 lg:order-1">
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl xl:text-[104px] font-normal tracking-tight text-neutral-900 leading-[0.88]">
                {activeFleet.splitLeft}
              </h1>
              <p className="font-display text-xl sm:text-2xl font-light text-neutral-600 mt-4 max-w-sm">
                {activeFleet.subLeft}
              </p>

              {/* Editorial Feature Specs */}
              <div className="mt-8 pt-6 border-t border-neutral-300/70 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block">
                  NETWORK CAPABILITIES
                </span>
                {activeFleet.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Quick Jump Buttons */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('find_chargers', { vehicleType: activeFleetTab === 'scooter' ? 'two_wheeler' : 'four_wheeler' })}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-emerald-700 group"
                >
                  <span>Explore nearby bays</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* CENTER COLUMN: Vertical High-Res Vehicle Render + Floating Reservation Pill */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative order-3 lg:order-2 my-6 lg:my-0">
              
              {/* 3D Perspective Card Container */}
              <div 
                className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] transition-transform duration-200 ease-out flex justify-center items-center"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.02, 1.02, 1.02)`
                }}
              >
                {/* Vehicle Top-Down Cutout Image */}
                <div className="relative group">
                  <img
                    src={activeFleet.image}
                    alt={activeFleet.alt}
                    className="w-full h-auto max-h-[520px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] select-none transition-all duration-500"
                    draggable={false}
                  />

                  {/* Glowing Radar Point on Charging Port */}
                  <div className="absolute top-[28%] right-[22%] group-hover:scale-125 transition-transform">
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-md"></span>
                    </div>
                  </div>
                </div>

                {/* THE FLOATING WHITE CAPSULE PILL CTA (EXACT JESKO JETS AESTHETIC) */}
                <div className="absolute -bottom-5 sm:-bottom-6 z-20">
                  <button
                    onClick={() => onNavigate('find_chargers')}
                    className="inline-flex items-center gap-4 bg-white/95 hover:bg-white text-neutral-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.18)] border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300 group active:scale-95"
                  >
                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                      Reserve a Charger
                    </span>
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white group-hover:bg-emerald-600 transition-colors">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Interactive Vehicle Switch Dots */}
              <div className="flex items-center gap-2 mt-10">
                {(['car', 'scooter', 'charger'] as FleetTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFleetTab(tab)}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      activeFleetTab === tab ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-500'
                    }`}
                    aria-label={`Switch to ${tab}`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: "Silence" / "Agility" + Editorial Specs */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left lg:pl-4 order-2 lg:order-3">
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl xl:text-[104px] font-normal tracking-tight text-neutral-900 leading-[0.88]">
                {activeFleet.splitRight}
              </h1>

              <div className="mt-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">
                  {activeFleet.modelTag}
                </span>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-normal">
                  {activeFleet.description}
                </p>
              </div>

              {/* Stat Telemetry Matrix */}
              <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-neutral-300/70">
                {activeFleet.stats.map((s, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white/50 border border-neutral-200/60 backdrop-blur-xs">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                      {s.label}
                    </span>
                    <span className="font-display text-xl font-semibold text-neutral-900 mt-0.5 block">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('calculator')}
                  className="text-xs font-semibold text-neutral-800 hover:text-emerald-700 underline underline-offset-4 flex items-center gap-1.5"
                >
                  <span>Calculate charging cost</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* =========================================================================
              CLEAN CONCIERGE SEARCH BAR (DOCKED DIRECTLY UNDER HERO)
          ========================================================================= */}
          <div className="mt-14 max-w-4xl mx-auto">
            <form 
              onSubmit={handleHeroSearch}
              className="p-2 sm:p-2.5 rounded-3xl bg-white/90 backdrop-blur-xl border border-neutral-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center gap-2"
            >
              {/* City Selection */}
              <div className="w-full md:w-1/3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-200">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="flex-1 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    City / Corridor
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs font-semibold text-neutral-800 bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    <option value="Bengaluru">Bengaluru, Karnataka</option>
                    <option value="Delhi NCR">Delhi NCR, Capital Region</option>
                    <option value="Mumbai">Mumbai, Maharashtra</option>
                    <option value="Hyderabad">Hyderabad, Telangana</option>
                    <option value="Pune">Pune, Maharashtra</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="w-full md:w-1/3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-200">
                {vehicleType === 'two_wheeler' ? (
                  <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <div className="flex-1 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full text-xs font-semibold text-neutral-800 bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">All Vehicles (2W & 4W)</option>
                    <option value="four_wheeler">Electric Cars (CCS2 / Type 2)</option>
                    <option value="two_wheeler">Electric 2-Wheelers (Ather / 15A)</option>
                  </select>
                </div>
              </div>

              {/* Keyword / Area Search */}
              <div className="w-full md:w-1/3 flex items-center gap-2.5 px-4 py-2">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Area, hotel, café, or villa..."
                  className="w-full text-xs font-medium text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-hidden"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-sm"
              >
                <span>Find Charger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. OUR FLEET / CHARGING TIERS (JESKO JETS EDITORIAL PORTFOLIO)
      ========================================================================= */}
      <section className="py-20 bg-[#FAF8F3] border-t border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                VERIFIED ARCHITECTURE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900">
                Four Distinct Classes of Charging
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-neutral-600 max-w-md">
              From peaceful residential villa bays to intercity highway hyperchargers, every bay is tested for verified electrical earthing and seamless booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tier 01: Private Villa */}
            <div className="group rounded-3xl p-6 bg-white border border-neutral-200/80 hover:border-neutral-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-neutral-400">CLASS 01</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Residential
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                  Villa & Estate Sanctuaries
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  Peaceful private residential bays with 7.2 kW AC wallboxes. Perfect for secure overnight replenishment with solar rooftop generation.
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Power Output</span>
                  <span className="font-semibold text-neutral-900">7.2 – 11 kW AC</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Typical Tariff</span>
                  <span className="font-semibold text-emerald-700">₹14 – ₹16 / kWh</span>
                </div>
                <button
                  onClick={() => onNavigate('find_chargers', { query: 'villa' })}
                  className="mt-5 w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Villas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tier 02: Charge + Explore Cafés */}
            <div className="group rounded-3xl p-6 bg-white border border-neutral-200/80 hover:border-neutral-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-neutral-400">CLASS 02</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Hospitality
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                  Gourmet Cafés & Dining
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  Partnered with Blue Tokai, Third Wave Coffee, and boutique hotels. Enjoy artisan pour-overs or lunch while adding 120+ km of range.
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Perk Included</span>
                  <span className="font-semibold text-amber-700">Complimentary Drink</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Power Output</span>
                  <span className="font-semibold text-neutral-900">11 – 22 kW AC</span>
                </div>
                <button
                  onClick={() => onNavigate('charge_explore')}
                  className="mt-5 w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Café Bays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tier 03: Highway Hyperchargers */}
            <div className="group rounded-3xl p-6 bg-white border border-neutral-200/80 hover:border-neutral-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-neutral-400">CLASS 03</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    High Speed
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                  Highway Hyperchargers
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  Strategically situated on India’s major expressways. 50 kW to 120 kW dual-gun CCS2 DC fast charging for rapid 20-minute turnarounds.
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Charging Time</span>
                  <span className="font-semibold text-blue-700">18 – 25 Min (80%)</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Connector</span>
                  <span className="font-semibold text-neutral-900">CCS2 DC Gun</span>
                </div>
                <button
                  onClick={() => onNavigate('find_chargers', { query: 'hyper' })}
                  className="mt-5 w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Expressway Hubs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tier 04: Two-Wheeler Urban Hubs */}
            <div className="group rounded-3xl p-6 bg-white border border-neutral-200/80 hover:border-neutral-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-neutral-400">CLASS 04</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                    Urban 2W
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                  Two-Wheeler Quick-Bays
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  Compact 3.3 kW points tailored for Ather, Ola, Chetak, and TVS iQube with dedicated surge suppression and verified grounding.
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Running Cost</span>
                  <span className="font-semibold text-purple-700">Sub-₹0.50 / km</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Socket Type</span>
                  <span className="font-semibold text-neutral-900">15A & Ather Dot</span>
                </div>
                <button
                  onClick={() => onNavigate('find_chargers', { vehicleType: 'two_wheeler' })}
                  className="mt-5 w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Find 2W Bays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE CORRIDOR DRIVE / FLIGHT PLANNER (JESKO JETS ROUTE MAP)
      ========================================================================= */}
      <section className="py-20 bg-[#F6F3EC] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
              INTERCITY TELEMETRY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900">
              Corridor Flight & Drive Planner
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Calculate exact energy requirements, charging stops, and fuel savings along India’s major highway arteries before you embark.
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-neutral-200/90 shadow-xl">
            
            {/* Top Selector Grid: Corridors & Vehicles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-neutral-200/80 pb-8">
              
              {/* Corridor Choice */}
              <div className="lg:col-span-7">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  Select Interstate Corridor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {corridors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCorridor(c)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        selectedCorridor.id === c.id
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                          : 'bg-[#FAF8F3] text-neutral-800 border-neutral-200/80 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          selectedCorridor.id === c.id ? 'text-emerald-400' : 'text-emerald-700'
                        }`}>
                          {c.tag}
                        </span>
                        <span className="text-xs font-mono font-semibold">{c.distanceKm} KM</span>
                      </div>
                      <span className="font-display text-sm font-semibold block truncate">
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Choice */}
              <div className="lg:col-span-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  Vehicle Calibration
                </label>
                <div className="space-y-2">
                  {(['nexon', 'ather', 'mg_zs'] as const).map((key) => {
                    const v = vehicleSpecs[key];
                    const isSelected = corridorVehicle === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCorridorVehicle(key)}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs border transition-all ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold'
                            : 'bg-[#FAF8F3] text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {v.type === '2W' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                          <span>{v.name}</span>
                        </div>
                        <span className="font-mono text-neutral-500">{v.range} km range</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Corridor Telemetry Output Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                  Total Distance
                </span>
                <span className="font-display text-2xl font-bold text-neutral-900 mt-1 block">
                  {selectedCorridor.distanceKm} km
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {selectedCorridor.from.split('(')[0]} → {selectedCorridor.to.split('(')[0]}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                  Recharge Stops
                </span>
                <span className="font-display text-2xl font-bold text-neutral-900 mt-1 block">
                  {corridorStopsNeeded} Pitstop{corridorStopsNeeded > 1 ? 's' : ''}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                  {selectedCorridor.recommendedHost}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                  Estimated EV Cost
                </span>
                <span className="font-display text-2xl font-bold text-neutral-900 mt-1 block">
                  ₹{corridorEstimatedCost}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  ~{corridorEnergyNeeded} kWh required
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                  Trip Petrol Savings
                </span>
                <span className="font-display text-2xl font-bold text-emerald-700 mt-1 block">
                  + ₹{corridorSavings}
                </span>
                <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
                  Compared to ICE fuel
                </span>
              </div>

            </div>

            {/* Book Corridor Station CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-900 block">
                    Recommended Refreshment Pairing: {selectedCorridor.cafeStop}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Complimentary beverage included when you reserve with ChargeCircle
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('find_chargers', { query: selectedCorridor.name.split(' ')[0] })}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors"
              >
                Reserve Route Bay →
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. THE LIVE MAP SANCTUARY (DOMINANT VIEWPORT MAP FEATURE)
      ========================================================================= */}
      <section className="py-20 bg-[#FAF8F3] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                SPATIAL RADAR
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900">
                Live Interactive Charging Grid
              </h2>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={() => onNavigate('find_chargers')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Full-Bleed Map (70% Large Map)</span>
              </button>
            </div>
          </div>

          {/* Embedded High-Impact Leaflet Map */}
          <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-white relative">
            <div className="h-[520px] w-full">
              <MapLeaflet
                chargers={chargers}
                onSelectCharger={onSelectCharger}
                onBookCharger={onBookCharger}
                center={
                  selectedCity === 'Mumbai' ? [18.9220, 72.8347] :
                  selectedCity === 'Delhi NCR' ? [28.6139, 77.2090] :
                  selectedCity === 'Hyderabad' ? [17.3850, 78.4867] :
                  selectedCity === 'Pune' ? [18.5204, 73.8567] :
                  [12.9716, 77.5946]
                }
                onCitySelect={(c) => setSelectedCity(c)}
              />
            </div>
          </div>

          {/* Quick city navigation pills */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 font-medium">Quick Pan to Metropolitan Hub:</span>
            <div className="flex flex-wrap items-center gap-2">
              {['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                    selectedCity === c 
                      ? 'bg-neutral-900 text-white shadow-xs' 
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. FEATURED CHARGERS SHOWCASE
      ========================================================================= */}
      <section className="py-20 bg-[#F6F3EC] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                VERIFIED HOSTS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900">
                Premier Charging Sanctuaries
              </h2>
            </div>
            <button
              onClick={() => onNavigate('find_chargers')}
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-emerald-700 underline underline-offset-4"
            >
              Browse all 680+ locations →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredChargers.map((charger) => (
              <ChargerCard
                key={charger.id}
                charger={charger}
                onSelect={onSelectCharger}
                onBook={onBookCharger}
                onViewDetails={onSelectCharger}
              />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. HOST YIELD ENGINE (TURN YOUR DRIVEWAY INTO A MICRO UTILITY)
      ========================================================================= */}
      <section className="py-20 bg-[#FAF8F3] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                MONETISE YOUR WALLBOX
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900 leading-tight">
                Turn Idle Kilowatts Into Predictable Revenue
              </h2>
              <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                Whether you own a residential villa in Koramangala or run a gourmet café in Bandra, listing your existing charger allows you to earn while helping EV drivers eliminate range anxiety.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase">Automated Double-Booking Lockout</h4>
                    <p className="text-xs text-neutral-500">Only verified drivers with pre-allocated time slots can navigate to your bay.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase">Automated Digital Metering & Settlement</h4>
                    <p className="text-xs text-neutral-500">Earnings are credited directly to your bank account via instant UPI payouts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase">Optional Partner Installation</h4>
                    <p className="text-xs text-neutral-500">No charger yet? We dispatch certified electrical contractors to inspect and install.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('become_host')}
                  className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                >
                  List My Charger →
                </button>
                <button
                  onClick={() => onNavigate('site_partnerships')}
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Co-Host Space (Partner Funds Charger)</span>
                </button>
                <button
                  onClick={() => onNavigate('become_host', { defaultTab: 'install' })}
                  className="px-5 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-semibold transition-all"
                >
                  Request Installation
                </button>
              </div>
            </div>

            {/* Interactive Calculator Slider Card */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-6">
                  HOST YIELD CALCULATOR
                </span>

                {/* Slider 1: Sessions per day */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-neutral-800">Completed Sessions / Day</span>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {sessionsPerDay} Sessions
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={sessionsPerDay}
                    onChange={(e) => setSessionsPerDay(parseInt(e.target.value))}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>1 (Casual)</span>
                    <span>5 (Active Bay)</span>
                    <span>10 (Commercial Hub)</span>
                  </div>
                </div>

                {/* Slider 2: Rate per kWh */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-neutral-800">Dispense Tariff (₹ / kWh)</span>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹{unitRate} / kWh
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="25"
                    step="1"
                    value={unitRate}
                    onChange={(e) => setUnitRate(parseInt(e.target.value))}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>₹12 (Subsidized)</span>
                    <span>₹16 (Average)</span>
                    <span>₹25 (Fast Hub)</span>
                  </div>
                </div>

                {/* Yield Output */}
                <div className="p-6 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80">
                  <span className="text-[11px] font-bold uppercase text-neutral-500 block">
                    PROJECTED NET MONTHLY EARNINGS
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-bold text-neutral-900">
                      ₹{estimatedHostEarnings.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">/ month</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase">Gross Revenue</span>
                      <span className="font-semibold text-neutral-800">₹{estimatedMonthlyGross.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase">Platform Commission (15%)</span>
                      <span className="font-semibold text-neutral-500">-₹{platformFee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          7. EDITORIAL FOOTER & CONCIERGE DIRECTORY
      ========================================================================= */}
      <footer className="bg-neutral-900 text-white pt-16 pb-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-neutral-950 font-bold">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <span className="font-display text-xl tracking-wider uppercase font-semibold text-white">
                  {BRAND_CONFIG.name}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-6">
                India’s premier peer-to-peer EV charging ecosystem. Certified residential wallboxes, boutique café destination charging, and highway hyperchargers.
              </p>
              <div className="flex items-center gap-4 text-neutral-400 text-xs">
                <span>© 2026 {BRAND_CONFIG.name} Inc.</span>
                <span>•</span>
                <span className="text-emerald-400">IS 17017 Certified</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4">
                Drivers
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><button onClick={() => onNavigate('find_chargers')} className="hover:text-white transition-colors">Find Chargers</button></li>
                <li><button onClick={() => onNavigate('charge_explore')} className="hover:text-white transition-colors">Charge + Explore</button></li>
                <li><button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors">Cost Calculator</button></li>
                <li><button onClick={() => onNavigate('my_bookings')} className="hover:text-white transition-colors">My Reservations</button></li>
                <li><button onClick={() => onNavigate('how_it_works')} className="hover:text-white transition-colors">How It Works</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4">
                Hosts & Partners
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><button onClick={() => onNavigate('become_host')} className="hover:text-white transition-colors">Become a Host</button></li>
                <li><button onClick={() => onNavigate('become_host', { defaultTab: 'install' })} className="hover:text-white transition-colors">Request Installation</button></li>
                <li><button onClick={() => onNavigate('host_dashboard')} className="hover:text-white transition-colors">Host Dashboard</button></li>
                <li><button onClick={() => onNavigate('admin_dashboard')} className="hover:text-white transition-colors">Admin Verification</button></li>
                <li><a href="mailto:hosts@chargecircle.com" className="hover:text-white transition-colors">Host Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4">
                Concierge Desk
              </h4>
              <div className="space-y-3 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+91 80 4710 8800</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>concierge@chargecircle.com</span>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] uppercase text-neutral-500 block">Headquarters</span>
                  <span className="text-neutral-300 text-xs">Indiranagar 100ft Road, Bengaluru, KA</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
            <div>
              Designed for luxury electric mobility. Verified neutral-to-earth potential guaranteed under 2.0V across all active partner bays.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-neutral-400 cursor-pointer">Security Protocol</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
