import React, { useState } from 'react';
import { 
  Home, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  Car, 
  Bike, 
  Clock, 
  MapPin, 
  Upload, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  Handshake,
  Building2
} from 'lucide-react';
import { PropertyType, ConnectorType, VehicleCategory } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { addCharger, addInstallationRequest } from '../services/storage';

interface BecomeHostPageProps {
  defaultTab?: 'have_charger' | 'install' | 'partnership';
  onNavigate: (page: string, params?: any) => void;
  onChargerAdded: () => void;
}

export const BecomeHostPage: React.FC<BecomeHostPageProps> = ({
  defaultTab = 'have_charger',
  onNavigate,
  onChargerAdded
}) => {
  const [activeTab, setActiveTab] = useState<'have_charger' | 'install' | 'partnership'>(defaultTab);

  // Success state banners
  const [submittedChargerSuccess, setSubmittedChargerSuccess] = useState<boolean>(false);
  const [submittedInstallSuccess, setSubmittedInstallSuccess] = useState<boolean>(false);

  // --- Form A: I Already Have a Charger ---
  const [name, setName] = useState('Rajesh Sharma');
  const [email, setEmail] = useState('rajesh.sharma@example.com');
  const [phone, setPhone] = useState('+91 98201 54321');
  const [propertyType, setPropertyType] = useState<PropertyType>('home');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560034');
  const [chargerBrand, setChargerBrand] = useState('Tata Power EZ Charge (Wallbox)');
  const [connectorType, setConnectorType] = useState<ConnectorType>('Type 2 (AC)');
  const [powerRatingKw, setPowerRatingKw] = useState<number>(7.2);
  const [supportedVehicles, setSupportedVehicles] = useState<VehicleCategory>('both');
  const [pricingPerKwh, setPricingPerKwh] = useState<number>(15);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [parkingType, setParkingType] = useState<'Covered' | 'Open' | 'Basement'>('Covered');
  const [accessNotes, setAccessNotes] = useState('Driveway on left. Ring bell or tell security at gate.');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Covered Parking',
    'CCTV Security',
    'WiFi Access'
  ]);

  // --- Form B: I Need a Charger Installed ---
  const [instName, setInstName] = useState('');
  const [instEmail, setInstEmail] = useState('');
  const [instPhone, setInstPhone] = useState('');
  const [instPropertyType, setInstPropertyType] = useState<PropertyType>('apartment');
  const [instAddress, setInstAddress] = useState('');
  const [instCity, setInstCity] = useState('Bengaluru');
  const [instPincode, setInstPincode] = useState('');
  const [instParkingSpace, setInstParkingSpace] = useState('Private covered garage for 2 cars');
  const [instMeter, setInstMeter] = useState<'Single Phase (230V)' | 'Three Phase (415V)' | 'Not Sure'>('Three Phase (415V)');
  const [instVehicles, setInstVehicles] = useState<VehicleCategory>('both');
  const [instTimeline, setInstTimeline] = useState('Within 2 weeks');

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Submit Charger Form
  const handleSubmitCharger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    addCharger({
      hostId: `host_${Date.now()}`,
      hostName: name,
      hostPhone: phone,
      hostType: propertyType,
      name: `${name}'s ${propertyType === 'home' ? 'Residential' : propertyType} EV Point`,
      description: `Community charger hosted by ${name}. Brand: ${chargerBrand}. Parking type: ${parkingType}.`,
      address,
      landmark: landmark || 'Near main road',
      city,
      state: city === 'Bengaluru' ? 'Karnataka' : city === 'Delhi NCR' ? 'Delhi' : 'Maharashtra',
      pincode: pincode || '560001',
      lat: city === 'Bengaluru' ? 12.9350 : 28.5350,
      lng: city === 'Bengaluru' ? 77.6250 : 77.2000,
      connectorTypes: [connectorType],
      powerRatingKw,
      pricingPerKwh,
      supportedVehicles,
      speedCategory: powerRatingKw >= 25 ? 'rapid' : powerRatingKw >= 7 ? 'fast' : 'slow',
      operatingHours: {
        open: openTime,
        close: closeTime,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      amenities: selectedAmenities,
      parkingType,
      accessInstructions: accessNotes,
      images: [
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558441719-79a4ec410940?auto=format&fit=crop&w=800&q=80'
      ],
      verificationStatus: 'pending', // Do not automatically mark verified!
      verificationBadges: {
        identity: true,
        propertyAuthority: false,
        electricalSafety: false,
        compatibility: false
      },
      isAvailableNow: false,
      autoApproval: true
    });

    setSubmittedChargerSuccess(true);
    onChargerAdded();
  };

  // Submit Installation Form
  const handleSubmitInstallation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim() || !instAddress.trim()) return;

    addInstallationRequest({
      name: instName,
      email: instEmail,
      phone: instPhone,
      propertyType: instPropertyType,
      address: instAddress,
      city: instCity,
      pincode: instPincode,
      parkingSpaceType: instParkingSpace,
      meterConnection: instMeter,
      expectedVehicles: instVehicles,
      preferredTimeline: instTimeline
    });

    setSubmittedInstallSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monetize Your EV Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Host with ChargeCircle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Whether you already have a charger or need one installed, start earning from India's growing electric vehicle community.
          </p>
        </div>

        {/* Tab Switcher: Option A vs Option B vs Option C */}
        <div className="grid grid-cols-1 sm:grid-cols-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 text-xs font-bold gap-1 sm:gap-0">
          <button
            type="button"
            onClick={() => setActiveTab('have_charger')}
            className={`py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'have_charger'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>Option A: I Have a Charger</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'install'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Option B: Need Installation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partnership')}
            className={`py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'partnership'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Handshake className="w-4 h-4 shrink-0" />
            <span>Option C: Property Co-Hosting</span>
          </button>
        </div>

        {/* Form A: I Already Have a Charger */}
        {activeTab === 'have_charger' && (
          <div className="space-y-6">
            
            {submittedChargerSuccess ? (
              <div className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Charger Submitted for Verification!</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your listing has been saved with <strong>Pending Verification</strong> status. To protect drivers and property, our certified electrical engineer will review your earthing and MCB specifications before your station goes live on the marketplace.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('host_dashboard')}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Go to Host Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedChargerSuccess(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    List Another Charger
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitCharger} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Notice */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong className="block">Verification Protocol:</strong>
                    <span>Domestic wall sockets require certified earthing test (&lt; 2V neutral-to-earth) and a dedicated MCB. Your listing will be reviewed by admin technicians before going live.</span>
                  </div>
                </div>

                {/* Section 1: Host & Property */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">1. Host & Property Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Host Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="home">Independent House / Villa</option>
                        <option value="apartment">Gated Society / Apartment</option>
                        <option value="cafe">Café</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel / Resort</option>
                        <option value="commercial">Commercial / Office</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        {BRAND_CONFIG.cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Exact Address</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Plot 18, 5th Cross, Koramangala 3rd Block"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 560034"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Charger Specifications */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">2. Charger Hardware Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Brand & Model</label>
                      <input
                        type="text"
                        value={chargerBrand}
                        onChange={(e) => setChargerBrand(e.target.value)}
                        placeholder="e.g. Exicom Wallbox / Tata Power"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Connector Port</label>
                      <select
                        value={connectorType}
                        onChange={(e) => setConnectorType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Type 2 (AC)">Type 2 (AC)</option>
                        <option value="15A 3-Pin Domestic">15A 3-Pin Domestic</option>
                        <option value="CCS2 (DC Fast)">CCS2 (DC Fast)</option>
                        <option value="Ather Dot / Grid">Ather Dot / Grid</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Power Rating (kW)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={powerRatingKw}
                        onChange={(e) => setPowerRatingKw(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Supported Vehicles</label>
                      <select
                        value={supportedVehicles}
                        onChange={(e) => setSupportedVehicles(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="both">Both 2-Wheelers & Cars</option>
                        <option value="four_wheeler">Cars Only</option>
                        <option value="two_wheeler">Two-Wheelers Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pricing per kWh ({BRAND_CONFIG.currency})</label>
                      <input
                        type="number"
                        min="10"
                        max="35"
                        value={pricingPerKwh}
                        onChange={(e) => setPricingPerKwh(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Parking Type</label>
                      <select
                        value={parkingType}
                        onChange={(e) => setParkingType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Covered">Covered Car Porch</option>
                        <option value="Open">Open Driveway</option>
                        <option value="Basement">Basement Bay</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Availability & Hours */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">3. Operating Hours & Access</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Opens At</label>
                      <input
                        type="time"
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Closes At</label>
                      <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Access Instructions for Drivers</label>
                      <input
                        type="text"
                        value={accessNotes}
                        onChange={(e) => setAccessNotes(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    By submitting, you agree to host verified EV drivers and adhere to electrical safety standards.
                  </p>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Submit Charger for Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

        {/* Form B: I Need a Charger Installed */}
        {activeTab === 'install' && (
          <div className="space-y-6">
            
            {submittedInstallSuccess ? (
              <div className="p-8 rounded-3xl bg-white border border-emerald-200 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Installation Request Received!</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you! Our turnkey installation partner (Tata Power / Statiq Certified Technicians) will contact you within 24 hours to schedule a complimentary on-site electrical survey.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmittedInstallSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInstallation} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong className="block">Turnkey Partner Installation:</strong>
                    <span>We handle everything: BESCOM/DISCOM sanctioned load feasibility, high-gauge wiring, industrial earth grounding rod installation, and OEM wallbox setup.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={instPhone}
                      onChange={(e) => setInstPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Property Type</label>
                    <select
                      value={instPropertyType}
                      onChange={(e) => setInstPropertyType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="apartment">Apartment / RWA Gated Society</option>
                      <option value="home">Independent House / Bungalow</option>
                      <option value="restaurant">Restaurant / Café</option>
                      <option value="hotel">Hotel / Resort</option>
                      <option value="commercial">Office / Tech Park</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">City</label>
                    <select
                      value={instCity}
                      onChange={(e) => setInstCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      {BRAND_CONFIG.cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={instPincode}
                      onChange={(e) => setInstPincode(e.target.value)}
                      placeholder="e.g. 560066"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Address / Locality</label>
                  <input
                    type="text"
                    required
                    value={instAddress}
                    onChange={(e) => setInstAddress(e.target.value)}
                    placeholder="e.g. Palm Meadows, Varthur Main Road, Whitefield"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Electricity Meter Type</label>
                    <select
                      value={instMeter}
                      onChange={(e) => setInstMeter(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Three Phase (415V)">Three Phase (415V) - Ideal for 7kW+</option>
                      <option value="Single Phase (230V)">Single Phase (230V)</option>
                      <option value="Not Sure">Not Sure (Survey Needed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Expected EV Demand</label>
                    <select
                      value={instVehicles}
                      onChange={(e) => setInstVehicles(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="both">Both 2-Wheelers & Cars</option>
                      <option value="four_wheeler">Primarily Cars</option>
                      <option value="two_wheeler">Primarily Scooters</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Preferred Timeline</label>
                    <select
                      value={instTimeline}
                      onChange={(e) => setInstTimeline(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Immediately">Immediate (Next 7 Days)</option>
                      <option value="Within 2 weeks">Within 2 Weeks</option>
                      <option value="Within 1 month">Within 1 Month</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Free site visit included for residential & business properties.</span>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Request Installation Survey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

        {/* Form C: Property Co-Hosting Partnership */}
        {activeTab === 'partnership' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Handshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1">
                    Zero Upfront Hardware Investment
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Provide Space, Partner Provides the Charger
                  </h2>
                  <p className="text-xs text-slate-500">
                    Have an empty driveway, apartment parking, or commercial lot? Partner with certified EV hardware investors & CPOs who fund the hardware, installation, and maintenance while you share monthly profits.
                  </p>
                </div>
              </div>

              {/* 3 Step Card Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-2">1</span>
                  <h4 className="text-xs font-bold text-slate-900">You Offer Parking & Power</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Specify your available parking bays and electrical supply (e.g. single phase or 3-phase 415V).</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-2">2</span>
                  <h4 className="text-xs font-bold text-slate-900">Partner Supplies Hardware</h4>
                  <p className="text-[11px] text-slate-500 mt-1">EV investors deploy 22kW AC Wallboxes or 50kW DC Fast Chargers and handle 100% of civil/earthing work.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-2">3</span>
                  <h4 className="text-xs font-bold text-slate-900">Automated Monthly Split</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Earn 50/50 net session revenue or guaranteed monthly rental deposited straight to your bank account.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600">
                  <strong>4 active site listings</strong> and <strong>12+ EV hardware investors</strong> currently matching on ChargeCircle.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('site_partnerships')}
                    className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Open Site Co-Hosting Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
