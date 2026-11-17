import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Zap, 
  Car, 
  Bike, 
  X, 
  ChevronDown, 
  RotateCcw, 
  ArrowUpDown, 
  Map as MapIcon, 
  ListFilter,
  ShieldCheck,
  Star,
  Maximize,
  Columns,
  LayoutGrid,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Charger, ConnectorType, PropertyType } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { ChargerCard } from '../components/ChargerCard';
import { MapLeaflet } from '../components/MapLeaflet';

interface FindChargersPageProps {
  chargers: Charger[];
  initialFilters?: {
    city?: string;
    vehicleType?: 'all' | 'two_wheeler' | 'four_wheeler';
    query?: string;
  };
  onSelectCharger: (charger: Charger) => void;
  onBookCharger: (charger: Charger) => void;
  onViewDetails: (charger: Charger) => void;
}

export const FindChargersPage: React.FC<FindChargersPageProps> = ({
  chargers,
  initialFilters,
  onSelectCharger,
  onBookCharger,
  onViewDetails
}) => {
  // Layout Modes:
  // 'expanded_map': Map covers 70% width, side list covers 30% (Default large map)
  // 'fullscreen_map': Map covers 100% width, floating bottom card drawer
  // 'balanced': 50% / 50% split
  const [layoutMode, setLayoutMode] = useState<'expanded_map' | 'fullscreen_map' | 'balanced'>('expanded_map');

  // Mobile view toggle (List vs Map)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.query || '');
  const [selectedCity, setSelectedCity] = useState<string>(initialFilters?.city || 'Bengaluru');
  const [vehicleCategory, setVehicleCategory] = useState<'all' | 'two_wheeler' | 'four_wheeler'>(
    initialFilters?.vehicleType || 'all'
  );
  const [selectedConnectors, setSelectedConnectors] = useState<ConnectorType[]>([]);
  const [selectedSpeed, setSelectedSpeed] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<PropertyType[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(35);
  const [onlyAvailableNow, setOnlyAvailableNow] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'nearest' | 'price_low' | 'rating_high' | 'power_high'>('nearest');

  // Selected card for map focus
  const [selectedChargerId, setSelectedChargerId] = useState<string | undefined>(chargers[0]?.id);

  // Filter Drawer / Sidebar Toggle
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  // Connector options
  const connectorOptions: ConnectorType[] = [
    'Type 2 (AC)',
    'CCS2 (DC Fast)',
    '15A 3-Pin Domestic',
    'Ather Dot / Grid',
    'Bharat DC001'
  ];

  const propertyOptions: { type: PropertyType; label: string }[] = [
    { type: 'home', label: 'Home / Villa' },
    { type: 'cafe', label: 'Café' },
    { type: 'restaurant', label: 'Restaurant' },
    { type: 'hotel', label: 'Hotel' },
    { type: 'commercial', label: 'Tech Park / Hub' }
  ];

  const handleToggleConnector = (conn: ConnectorType) => {
    setSelectedConnectors(prev => 
      prev.includes(conn) ? prev.filter(c => c !== conn) : [...prev, conn]
    );
  };

  const handleToggleSpeed = (speed: string) => {
    setSelectedSpeed(prev => 
      prev.includes(speed) ? prev.filter(s => s !== speed) : [...prev, speed]
    );
  };

  const handleToggleProperty = (prop: PropertyType) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(prop) ? prev.filter(p => p !== prop) : [...prev, prop]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setVehicleCategory('all');
    setSelectedConnectors([]);
    setSelectedSpeed([]);
    setSelectedPropertyTypes([]);
    setMaxPrice(35);
    setOnlyAvailableNow(false);
    setOnlyVerified(false);
    setSortBy('nearest');
  };

  // Filter & Sort Logic
  const filteredChargers = useMemo(() => {
    return chargers.filter(c => {
      // City
      if (selectedCity && selectedCity !== 'All Cities' && c.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Keyword query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesAddr = c.address.toLowerCase().includes(q);
        const matchesLandmark = c.landmark.toLowerCase().includes(q);
        const matchesHost = c.hostName.toLowerCase().includes(q);
        if (!matchesName && !matchesAddr && !matchesLandmark && !matchesHost) {
          return false;
        }
      }

      // Vehicle Category
      if (vehicleCategory !== 'all') {
        if (c.supportedVehicles !== 'both' && c.supportedVehicles !== vehicleCategory) {
          return false;
        }
      }

      // Connectors
      if (selectedConnectors.length > 0) {
        const hasConnector = c.connectorTypes.some(ct => selectedConnectors.includes(ct));
        if (!hasConnector) return false;
      }

      // Speed Category
      if (selectedSpeed.length > 0) {
        if (!selectedSpeed.includes(c.speedCategory)) return false;
      }

      // Property Type
      if (selectedPropertyTypes.length > 0) {
        if (!selectedPropertyTypes.includes(c.hostType)) return false;
      }

      // Price
      if (c.pricingPerKwh > maxPrice) return false;

      // Available Now
      if (onlyAvailableNow && !c.isAvailableNow) return false;

      // Only Verified
      if (onlyVerified && c.verificationStatus !== 'verified') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.pricingPerKwh - b.pricingPerKwh;
      if (sortBy === 'rating_high') return b.rating - a.rating;
      if (sortBy === 'power_high') return b.powerRatingKw - a.powerRatingKw;
      return (a.distanceKm || 99) - (b.distanceKm || 99);
    });
  }, [
    chargers,
    selectedCity,
    searchQuery,
    vehicleCategory,
    selectedConnectors,
    selectedSpeed,
    selectedPropertyTypes,
    maxPrice,
    onlyAvailableNow,
    onlyVerified,
    sortBy
  ]);

  // Center coordinates by city
  const cityCoordinates: { [city: string]: [number, number] } = {
    'Bengaluru': [12.9716, 77.5946],
    'Delhi NCR': [28.5355, 77.1910],
    'Mumbai': [19.0760, 72.8777],
    'Hyderabad': [17.3850, 78.4867],
    'Pune': [18.5204, 73.8567],
    'Chennai': [13.0827, 80.2707],
  };

  const mapCenter = cityCoordinates[selectedCity] || [12.9716, 77.5946];

  const activeFiltersCount = 
    (selectedCity !== 'All Cities' && selectedCity !== 'Bengaluru' ? 1 : 0) +
    (vehicleCategory !== 'all' ? 1 : 0) +
    selectedConnectors.length +
    selectedSpeed.length +
    selectedPropertyTypes.length +
    (maxPrice < 35 ? 1 : 0) +
    (onlyAvailableNow ? 1 : 0) +
    (onlyVerified ? 1 : 0);

  const selectedCharger = chargers.find(c => c.id === selectedChargerId);

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col bg-[#fafbfc]">
      
      {/* Search & Filter Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input, City Picker & Vehicle Toggle */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1 max-w-3xl">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locality (e.g. Koramangala, Indiranagar, Cyber Hub)..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* City Dropdown */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="All Cities">All Cities</option>
                {BRAND_CONFIG.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Vehicle Type Toggle */}
              <div className="inline-flex p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setVehicleCategory('all')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    vehicleCategory === 'all' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleCategory('four_wheeler')}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                    vehicleCategory === 'four_wheeler' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Car</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleCategory('two_wheeler')}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                    vehicleCategory === 'two_wheeler' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>2W</span>
                </button>
              </div>
            </div>

            {/* Right Controls: Filters, Sort, and MAP EXPANSION LAYOUT SWITCHER */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2">
              
              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  activeFiltersCount > 0
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort By Dropdown */}
              <div className="hidden sm:flex items-center gap-1 text-xs">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="nearest">Nearest</option>
                  <option value="price_low">Lowest Price</option>
                  <option value="rating_high">Top Rated</option>
                  <option value="power_high">Fastest kW</option>
                </select>
              </div>

              {/* DESKTOP MAP PROMINENCE LAYOUT SWITCHER */}
              <div className="hidden lg:flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLayoutMode('expanded_map')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    layoutMode === 'expanded_map' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Large Map (70% Map View)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Large Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('fullscreen_map')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    layoutMode === 'fullscreen_map' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Full-Page Map (100% Map View)"
                >
                  <Maximize className="w-3.5 h-3.5" />
                  <span>100% Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('balanced')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    layoutMode === 'balanced' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Balanced 50/50 View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>50/50</span>
                </button>
              </div>

              {/* Mobile View Toggle: List vs Map */}
              <div className="lg:hidden flex items-center p-0.5 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMobileView('map')}
                  className={`p-1.5 rounded-lg text-xs font-semibold ${
                    mobileView === 'map' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className={`p-1.5 rounded-lg text-xs font-semibold ${
                    mobileView === 'list' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                  }`}
                  title="List View"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Expandable Filter Drawer */}
          {isFilterPanelOpen && (
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
              {/* Connector Types */}
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
                  Connector Type
                </label>
                <div className="space-y-1.5">
                  {connectorOptions.map((conn) => (
                    <label key={conn} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedConnectors.includes(conn)}
                        onChange={() => handleToggleConnector(conn)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{conn}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Charging Speed */}
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
                  Speed / Power
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'rapid', label: 'Rapid DC (≥ 50 kW)' },
                    { id: 'fast', label: 'Fast AC (7.2 - 22 kW)' },
                    { id: 'slow', label: 'Standard Socket (3.3 kW)' }
                  ].map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSpeed.includes(s.id)}
                        onChange={() => handleToggleSpeed(s.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Host / Venue Type */}
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
                  Host Property
                </label>
                <div className="space-y-1.5">
                  {propertyOptions.map((p) => (
                    <label key={p.type} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPropertyTypes.includes(p.type)}
                        onChange={() => handleToggleProperty(p.type)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Slider & Toggles */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Max Price:</span>
                    <span className="text-emerald-700 font-extrabold">{BRAND_CONFIG.currency}{maxPrice}/kWh</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="35"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyAvailableNow}
                      onChange={(e) => setOnlyAvailableNow(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Available Right Now</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Verified Hosts Only</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          MODE 1: FULLSCREEN MAP (100% Map Width & Height)
          The map takes over the entire page with floating bottom station carousel
      ========================================================================= */}
      {layoutMode === 'fullscreen_map' && (
        <div 
          className="relative w-full flex-1 overflow-hidden"
          style={{ height: 'calc(100vh - 125px)', minHeight: '650px' }}
        >
          {/* Edge-to-Edge Map */}
          <MapLeaflet
            key="map-fullscreen"
            chargers={filteredChargers}
            selectedChargerId={selectedChargerId}
            onSelectCharger={(c) => {
              setSelectedChargerId(c.id);
              onSelectCharger(c);
            }}
            onBookCharger={onBookCharger}
            center={mapCenter}
            zoom={12}
            className="w-full h-full rounded-none border-none shadow-none"
            onCitySelect={(c) => setSelectedCity(c)}
          />

          {/* Floating Bottom Card Carousel */}
          <div className="absolute bottom-6 inset-x-0 z-[400] px-4 pointer-events-none">
            <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pointer-events-auto">
              {filteredChargers.map((c) => {
                const isSelected = c.id === selectedChargerId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedChargerId(c.id);
                      onSelectCharger(c);
                    }}
                    className={`min-w-[280px] sm:min-w-[320px] max-w-[340px] bg-white/95 backdrop-blur-md rounded-2xl p-3 border shadow-xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-105 bg-white' 
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img src={c.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            {c.powerRatingKw} kW
                          </span>
                          <span className="text-xs font-bold text-slate-800">★ {c.rating.toFixed(1)}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{c.landmark}, {c.city}</p>
                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100">
                          <span className="text-xs font-extrabold text-emerald-700">
                            {BRAND_CONFIG.currency}{c.pricingPerKwh}/kWh
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookCharger(c);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow-xs"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: EXPANDED MAP VIEW (70% MAP / 30% SIDEBAR LIST)
          DEFAULT! The map covers a large dominant 70% portion of the screen height & width!
      ========================================================================= */}
      {layoutMode === 'expanded_map' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch h-[calc(100vh-140px)] min-h-[680px]">
            
            {/* Left Sidebar List (4 cols = ~33% width) with internal scrolling */}
            <div className={`lg:col-span-4 xl:col-span-4 flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden ${mobileView === 'map' ? 'hidden lg:flex' : 'flex'}`}>
              
              {/* Header inside list */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-900">{filteredChargers.length} Stations Found</span>
                  <span className="text-[11px] text-slate-500 block">Click station to center on map</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button onClick={handleResetFilters} className="text-xs text-emerald-700 font-semibold hover:underline">
                    Reset ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Scrollable Cards Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                {filteredChargers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-3">
                    <p>No stations matching criteria.</p>
                    <button onClick={handleResetFilters} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredChargers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedChargerId(c.id);
                        onSelectCharger(c);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        c.id === selectedChargerId
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md'
                          : 'border-slate-200 hover:border-emerald-300 hover:shadow-xs bg-white'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img src={c.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                              {c.powerRatingKw} kW · {c.speedCategory.toUpperCase()}
                            </span>
                            <span className="text-xs font-bold text-slate-800">★ {c.rating.toFixed(1)}</span>
                          </div>

                          <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{c.landmark}, {c.city}</p>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400">Rate: </span>
                              <span className="text-xs font-extrabold text-emerald-700">{BRAND_CONFIG.currency}{c.pricingPerKwh}</span>
                              <span className="text-[10px] text-slate-400">/kWh</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewDetails(c);
                                }}
                                className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBookCharger(c);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Map Canvas (8 cols = ~67% width) - COVERS A LARGE DOMINANT PART OF THE PAGE! */}
            <div className={`lg:col-span-8 xl:col-span-8 h-full min-h-[500px] ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
              <MapLeaflet
                key="map-expanded"
                chargers={filteredChargers}
                selectedChargerId={selectedChargerId}
                onSelectCharger={(c) => {
                  setSelectedChargerId(c.id);
                  onSelectCharger(c);
                }}
                onBookCharger={onBookCharger}
                center={mapCenter}
                zoom={12}
                className="w-full h-full min-h-[600px] rounded-3xl"
                onCitySelect={(c) => setSelectedCity(c)}
              />
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: BALANCED 50/50 SPLIT
      ========================================================================= */}
      {layoutMode === 'balanced' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[calc(100vh-140px)] min-h-[650px]">
            
            {/* 6 Cols Cards */}
            <div className={`lg:col-span-6 overflow-y-auto h-full pr-1 space-y-4 ${mobileView === 'map' ? 'hidden lg:block' : 'block'}`}>
              <div className="text-xs text-slate-600 mb-2">
                Showing <strong className="text-slate-900">{filteredChargers.length}</strong> stations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredChargers.map((c) => (
                  <ChargerCard
                    key={c.id}
                    charger={c}
                    isSelected={c.id === selectedChargerId}
                    onSelect={(ch) => {
                      setSelectedChargerId(ch.id);
                      onSelectCharger(ch);
                    }}
                    onBook={onBookCharger}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            </div>

            {/* 6 Cols Map */}
            <div className={`lg:col-span-6 h-full min-h-[500px] ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
              <MapLeaflet
                key="map-balanced"
                chargers={filteredChargers}
                selectedChargerId={selectedChargerId}
                onSelectCharger={(c) => {
                  setSelectedChargerId(c.id);
                  onSelectCharger(c);
                }}
                onBookCharger={onBookCharger}
                center={mapCenter}
                zoom={12}
                className="w-full h-full min-h-[550px] rounded-3xl"
                onCitySelect={(c) => setSelectedCity(c)}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
