import React, { useState } from 'react';
import { 
  Building2, 
  Zap, 
  ShieldCheck, 
  Handshake, 
  MapPin, 
  DollarSign, 
  Percent, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Send, 
  Filter, 
  Search, 
  Users, 
  FileText, 
  X,
  Car,
  Bike,
  Coffee,
  Check,
  Sliders,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SitePartnershipListing, 
  PartnershipProposal, 
  SitePartnershipModel, 
  PropertyType, 
  VehicleCategory, 
  User 
} from '../types';
import { 
  getSitePartnerships, 
  addSitePartnership, 
  addPartnershipProposal 
} from '../services/storage';

interface SitePartnershipsPageProps {
  currentUser: User;
  onNavigate: (page: string, params?: any) => void;
}

export const SitePartnershipsPage: React.FC<SitePartnershipsPageProps> = ({
  currentUser,
  onNavigate
}) => {
  const [siteListings, setSiteListings] = useState<SitePartnershipListing[]>(getSitePartnerships());
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedSiteForProposal, setSelectedSiteForProposal] = useState<SitePartnershipListing | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form State: List Property Space
  const [ownerName, setOwnerName] = useState(currentUser.name || 'Rajesh Sharma');
  const [ownerPhone, setOwnerPhone] = useState(currentUser.phone || '+91 98201 54321');
  const [ownerEmail, setOwnerEmail] = useState(currentUser.email || 'rajesh.sharma@example.com');
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('home');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');
  const [baysCount, setBaysCount] = useState<number>(2);
  const [accessType, setAccessType] = useState<SitePartnershipListing['parkingAccessType']>('Covered Private Driveway');
  const [sanctionedLoadKw, setSanctionedLoadKw] = useState<number>(25);
  const [meterConnection, setMeterConnection] = useState<SitePartnershipListing['meterConnection']>('Three Phase (415V)');
  const [preferredModel, setPreferredModel] = useState<SitePartnershipModel>('revenue_share');
  const [proposedSplitPercent, setProposedSplitPercent] = useState<number>(50);
  const [expectedRent, setExpectedRent] = useState<number>(8000);
  const [targetVehicles, setTargetVehicles] = useState<VehicleCategory>('both');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([
    '24/7 Gated Security',
    'CCTV Monitored',
    'High-Speed WiFi'
  ]);

  // Form State: Submit Proposal Modal
  const [partnerName, setPartnerName] = useState(currentUser.name);
  const [partnerCompany, setPartnerCompany] = useState<PartnershipProposal['partnerCompanyOrType']>('Commercial CPO / Operator');
  const [partnerPhone, setPartnerPhone] = useState(currentUser.phone);
  const [partnerEmail, setPartnerEmail] = useState(currentUser.email);
  const [proposedHardware, setProposedHardware] = useState('Delta 50 kW CCS2 DC Fast Charger (Dual Gun)');
  const [hardwarePowerKw, setHardwarePowerKw] = useState<number>(50);
  const [hardwareInvestment, setHardwareInvestment] = useState<number>(420000);
  const [proposalModel, setProposalModel] = useState<SitePartnershipModel>('revenue_share');
  const [ownerSharePercent, setOwnerSharePercent] = useState<number>(50);
  const [fixedRentOffer, setFixedRentOffer] = useState<number>(10000);
  const [contractYears, setContractYears] = useState<number>(3);
  const [maintenanceIncluded, setMaintenanceIncluded] = useState(true);
  const [proposalMessage, setProposalMessage] = useState('');

  // Filter listings
  const filteredListings = siteListings.filter((site) => {
    if (selectedCity !== 'all' && site.city !== selectedCity) return false;
    if (selectedModel !== 'all' && site.preferredModel !== selectedModel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = site.title.toLowerCase().includes(q);
      const matchArea = site.area.toLowerCase().includes(q);
      const matchDesc = site.description.toLowerCase().includes(q);
      if (!matchTitle && !matchArea && !matchDesc) return false;
    }
    return true;
  });

  const handleOpenProposalModal = (site: SitePartnershipListing) => {
    setSelectedSiteForProposal(site);
    setProposalModel(site.preferredModel);
    setOwnerSharePercent(site.proposedRevenueSplitPercent || 50);
    setProposalMessage(
      `Hello ${site.propertyOwnerName}, I saw your space listing in ${site.area}. We would love to partner with you to deploy a certified EV charging bay here.`
    );
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    const newListing = addSitePartnership({
      propertyOwnerId: currentUser.id,
      propertyOwnerName: ownerName,
      propertyOwnerPhone: ownerPhone,
      propertyOwnerEmail: ownerEmail,
      title,
      propertyType,
      address,
      area: area || city,
      city,
      pincode,
      parkingBaysAvailable: baysCount,
      parkingAccessType: accessType,
      sanctionedLoadKw,
      meterConnection,
      preferredModel,
      proposedRevenueSplitPercent: proposedSplitPercent,
      expectedMonthlyRent: preferredModel !== 'revenue_share' ? expectedRent : undefined,
      supportedVehicleTarget: targetVehicles,
      description,
      amenities,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
      ]
    });

    setSiteListings(getSitePartnerships());
    setIsListModalOpen(false);
    setSuccessBanner('Your property space has been published! EV investors and operators can now send you partnership proposals.');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Reset fields
    setTitle('');
    setAddress('');
    setDescription('');
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteForProposal) return;

    addPartnershipProposal({
      siteListingId: selectedSiteForProposal.id,
      siteTitle: selectedSiteForProposal.title,
      propertyOwnerId: selectedSiteForProposal.propertyOwnerId,
      partnerId: currentUser.id,
      partnerName,
      partnerEmail,
      partnerPhone,
      partnerCompanyOrType: partnerCompany,
      proposedHardware,
      hardwarePowerKw,
      hardwareInvestmentValue: hardwareInvestment,
      proposedSplitModel: proposalModel,
      ownerSharePercent,
      partnerSharePercent: 100 - ownerSharePercent,
      fixedRentOfferMonthly: proposalModel !== 'revenue_share' ? fixedRentOffer : undefined,
      contractTermYears: contractYears,
      maintenanceIncluded,
      message: proposalMessage
    });

    setSiteListings(getSitePartnerships());
    const targetOwner = selectedSiteForProposal.propertyOwnerName;
    setSelectedSiteForProposal(null);
    setSuccessBanner(`Your partnership proposal has been sent to ${targetOwner}! They can review and accept it from their Host Dashboard.`);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-neutral-900 pb-24 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Top Banner Message */}
      {successBanner && (
        <div className="bg-emerald-600 text-white px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-between shadow-md">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-white hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          1. EDITORIAL HERO SECTION
      ========================================================================= */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-[#FAF8F3] via-[#F6F3EC] to-[#EFECE4] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-4 border border-emerald-200">
              <Handshake className="w-3.5 h-3.5 text-emerald-700" />
              <span>Property Owner ↔ EV Charger Co-Hosting Hub</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.05]">
              Own a Parking Bay? <br className="hidden sm:inline" />
              Partner with an EV Charger Investor.
            </h1>

            <p className="font-display text-base sm:text-lg font-light text-neutral-600 mt-5 leading-relaxed">
              You provide the driveway, commercial parking, or café lot with electrical connection. Hardware investors, CPOs, and certified installers supply the charger, handle civil work, and maintain equipment. Split the charging revenue automatically every month.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="px-6 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>List Your Property Space Free</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('marketplace-listings');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold uppercase tracking-wider border border-neutral-300 transition-all duration-200 flex items-center gap-2"
              >
                <span>Browse Sites Seeking Partners</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/80 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Upfront Hardware Cost
              </span>
              <span className="font-display text-2xl font-semibold text-emerald-700 mt-1 block">
                ₹0 for Owner
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">Partner covers hardware</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/80 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Typical Revenue Split
              </span>
              <span className="font-display text-2xl font-semibold text-neutral-900 mt-1 block">
                50% / 50%
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">Shared net profit</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/80 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Avg. Host Net Yield
              </span>
              <span className="font-display text-2xl font-semibold text-neutral-900 mt-1 block">
                ₹18,500 / mo
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">Per 2-bay station</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/80 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Civil Work & Maintenance
              </span>
              <span className="font-display text-2xl font-semibold text-neutral-900 mt-1 block">
                100% Handled
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">By certified installer partner</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. HOW CO-HOSTING WORKS (3 CLEAR STEPS)
      ========================================================================= */}
      <section className="py-16 bg-[#FAF8F3] border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
              SYNERGY ARCHITECTURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900">
              How the Co-Hosting Partnership Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-display font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                Property Owner Lists Space
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                You specify your available parking bay count, location, and sanctioned electrical connection (single phase or 3-phase 415V). Pick your preferred split model (e.g. 50/50 profit share or fixed monthly rental).
              </p>
              <div className="p-2.5 rounded-xl bg-[#FAF8F3] border border-neutral-200/60 text-[11px] text-neutral-600 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero capital outlay or hardware risk</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-display font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                EV Partner Deploys Charger
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                A verified hardware investor or commercial CPO reviews your site, submits a proposal, and supplies a certified commercial charger (e.g. 22kW AC Wallbox or 50kW DC Fast). They handle all installation and earthing testing.
              </p>
              <div className="p-2.5 rounded-xl bg-[#FAF8F3] border border-neutral-200/60 text-[11px] text-neutral-600 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Equipment fully insured & maintained</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-display font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                Automated Monthly Payouts
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                The charger goes live on ChargeCircle with GPS navigation and digital booking. At the end of every month, charging revenue is automatically split and credited directly to both bank accounts via UPI.
              </p>
              <div className="p-2.5 rounded-xl bg-[#FAF8F3] border border-neutral-200/60 text-[11px] text-neutral-600 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Transparent telemetry & invoice reporting</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. MARKETPLACE OF AVAILABLE PROPERTY SPACES
      ========================================================================= */}
      <section id="marketplace-listings" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                ACTIVE SITE OPPORTUNITIES
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900">
                Properties Seeking EV Charger Partners
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2">
                Browse verified property owners ready to host your charging hardware.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List a New Site</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-400 font-medium px-2">City:</span>
              {['all', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {city === 'all' ? 'All Cities' : city}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium focus:outline-hidden"
              >
                <option value="all">All Partnership Models</option>
                <option value="revenue_share">50/50 Revenue Share</option>
                <option value="fixed_rent">Fixed Monthly Rent</option>
                <option value="hybrid">Hybrid (Rent + Split)</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredListings.map((site) => (
              <div 
                key={site.id}
                className="rounded-3xl bg-white border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badge Overlays */}
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                    <img
                      src={site.images[0]}
                      alt={site.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 backdrop-blur-md shadow-xs border border-neutral-200">
                        {site.city}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                        {site.sanctionedLoadKw} kW Load Available
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-900/90 text-white backdrop-blur-md">
                        {site.parkingBaysAvailable} Dedicated Bay{site.parkingBaysAvailable > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase text-neutral-400">
                          {site.area} • {site.parkingAccessType}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-neutral-900 mt-0.5">
                          {site.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                      {site.description}
                    </p>

                    {/* Specifications Matrix */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FAF8F3] border border-neutral-200/80 text-xs mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                          Preferred Partnership
                        </span>
                        <span className="font-semibold text-emerald-800 mt-0.5 block">
                          {site.preferredModel === 'revenue_share'
                            ? `${site.proposedRevenueSplitPercent}% / ${100 - site.proposedRevenueSplitPercent}% Revenue Split`
                            : site.preferredModel === 'fixed_rent'
                            ? `₹${site.expectedMonthlyRent?.toLocaleString()} / mo Fixed Rent`
                            : `₹${site.expectedMonthlyRent?.toLocaleString()} / mo + ${site.proposedRevenueSplitPercent}% Split`}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                          Power / Grid Hookup
                        </span>
                        <span className="font-semibold text-neutral-900 mt-0.5 block">
                          {site.meterConnection}
                        </span>
                      </div>
                    </div>

                    {/* Amenities Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {site.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-600">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 border-t border-neutral-100 flex items-center justify-between mt-2">
                  <div className="text-xs">
                    <span className="text-neutral-500 block text-[11px]">Property Host:</span>
                    <strong className="text-neutral-900 font-medium">{site.propertyOwnerName}</strong>
                    <span className="text-neutral-400 text-[10px] block">
                      {site.proposalsCount} Proposal{site.proposalsCount !== 1 ? 's' : ''} Received
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenProposalModal(site)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Proposal</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
              <Building2 className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-800">No properties match your filter</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try selecting "All Cities" or list your own property space to find a charging partner.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          MODAL 1: SUBMIT PARTNERSHIP PROPOSAL (FOR EV INVESTORS / CPOS)
      ========================================================================= */}
      {selectedSiteForProposal && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedSiteForProposal(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Pinned Modal Header */}
            <div className="p-5 sm:px-8 sm:pt-6 sm:pb-4 border-b border-neutral-100 flex items-start justify-between shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Partnership Proposal
                  </span>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs font-medium text-neutral-500">{selectedSiteForProposal.city}</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-neutral-900">
                  Propose Charger Partnership
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Sending to property owner <strong className="text-neutral-800">{selectedSiteForProposal.propertyOwnerName}</strong> for "{selectedSiteForProposal.title}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSiteForProposal(null)}
                className="p-2 -mr-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4 text-xs">
              
              {/* Partner Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Name / Organization</label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                    placeholder="e.g. Voltech Mobility / Karan Varma"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Partner Type</label>
                  <select
                    value={partnerCompany}
                    onChange={(e) => setPartnerCompany(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                  >
                    <option value="Commercial CPO / Operator">Commercial CPO / Operator</option>
                    <option value="Individual EV Investor">Individual EV Investor</option>
                    <option value="Certified Hardware Installer">Certified Hardware Installer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                    placeholder="+91 98000 00000"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                    placeholder="partner@example.com"
                  />
                </div>
              </div>

              {/* Hardware Specifications to Deploy */}
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200 space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-500 block">
                  Hardware You Will Deploy & Fund
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">Charger Brand & Model</label>
                    <input
                      type="text"
                      required
                      value={proposedHardware}
                      onChange={(e) => setProposedHardware(e.target.value)}
                      className="w-full p-2 rounded-xl border border-neutral-200 bg-white"
                      placeholder="e.g. Delta 50 kW CCS2 DC Fast Charger"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Power (kW)</label>
                    <input
                      type="number"
                      required
                      value={hardwarePowerKw}
                      onChange={(e) => setHardwarePowerKw(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-xl border border-neutral-200 bg-white"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Estimated Hardware Investment (₹)</label>
                  <input
                    type="number"
                    value={hardwareInvestment}
                    onChange={(e) => setHardwareInvestment(parseInt(e.target.value))}
                    className="w-full p-2 rounded-xl border border-neutral-200 bg-white"
                    placeholder="420000"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    You bear 100% of this hardware cost. Property owner supplies parking space & power connection.
                  </span>
                </div>
              </div>

              {/* Proposed Revenue Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Partnership Model</label>
                  <select
                    value={proposalModel}
                    onChange={(e) => setProposalModel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  >
                    <option value="revenue_share">Revenue Share (% Net Profit)</option>
                    <option value="fixed_rent">Guaranteed Fixed Monthly Rent</option>
                    <option value="hybrid">Hybrid (Fixed Base + % Profit)</option>
                  </select>
                </div>

                {proposalModel === 'revenue_share' ? (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Property Owner's Share: {ownerSharePercent}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="70"
                      step="5"
                      value={ownerSharePercent}
                      onChange={(e) => setOwnerSharePercent(parseInt(e.target.value))}
                      className="w-full accent-neutral-900 mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>Owner: {ownerSharePercent}%</span>
                      <span>You (Partner): {100 - ownerSharePercent}%</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Monthly Rent Offer (₹)</label>
                    <input
                      type="number"
                      value={fixedRentOffer}
                      onChange={(e) => setFixedRentOffer(parseInt(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-neutral-200"
                      placeholder="8000"
                    />
                  </div>
                )}
              </div>

              {/* Contract Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Agreement Duration</label>
                  <select
                    value={contractYears}
                    onChange={(e) => setContractYears(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  >
                    <option value={1}>1 Year Term (Renewable)</option>
                    <option value={2}>2 Years Term</option>
                    <option value={3}>3 Years Term</option>
                    <option value={5}>5 Years Long-term Lease</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="maintenance_check"
                    checked={maintenanceIncluded}
                    onChange={(e) => setMaintenanceIncluded(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-neutral-900"
                  />
                  <label htmlFor="maintenance_check" className="text-neutral-700 font-medium">
                    I will cover 100% of routine maintenance & repairs
                  </label>
                </div>
              </div>

              {/* Message to Owner */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Cover Note to Property Owner</label>
                <textarea
                  rows={3}
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200"
                  placeholder="Explain why your hardware and maintenance track record is a great fit for their space..."
                />
              </div>

              </div>

              {/* Pinned Modal Footer */}
              <div className="p-4 sm:px-8 sm:py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedSiteForProposal(null)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Partnership Proposal</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: LIST PROPERTY SPACE FOR PARTNERSHIP (FOR PROPERTY OWNERS)
      ========================================================================= */}
      {isListModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsListModalOpen(false);
          }}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Pinned Modal Header */}
            <div className="p-5 sm:px-8 sm:pt-6 sm:pb-4 border-b border-neutral-100 flex items-start justify-between shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Property Co-Hosting
                  </span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-semibold text-neutral-900">
                  List Your Space for an EV Charger Partner
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Have driveway space or parking? EV investors will supply the charger, fund installation, and split charging income with you.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsListModalOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4 text-xs">
              
              {/* Title & Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">Listing Headline</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                    placeholder="e.g. Koramangala Villa Driveway with 25 kW 3-Phase Meter"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  >
                    <option value="home">Villa / House</option>
                    <option value="cafe">Café / Restaurant</option>
                    <option value="commercial">Commercial Hub</option>
                    <option value="apartment">Apartment Society</option>
                    <option value="hotel">Boutique Hotel</option>
                  </select>
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Area / Locality</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                    placeholder="e.g. Indiranagar 100ft Road"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                    placeholder="560038"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Complete Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200"
                  placeholder="Plot number, building name, street..."
                />
              </div>

              {/* Parking and Electrical Load */}
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-neutral-200 space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-500 block">
                  Parking Space & Electrical Grid Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Parking Access Type</label>
                    <select
                      value={accessType}
                      onChange={(e) => setAccessType(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-neutral-200 bg-white"
                    >
                      <option value="Covered Private Driveway">Covered Private Driveway</option>
                      <option value="Open Commercial Lot">Open Commercial Lot</option>
                      <option value="Gated Society Parking">Gated Society Parking</option>
                      <option value="Highway Frontage">Highway Frontage</option>
                      <option value="Basement Bay">Basement Bay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Available Bays</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={baysCount}
                      onChange={(e) => setBaysCount(parseInt(e.target.value))}
                      className="w-full p-2 rounded-xl border border-neutral-200 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Meter / Power Hookup</label>
                    <select
                      value={meterConnection}
                      onChange={(e) => setMeterConnection(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-neutral-200 bg-white"
                    >
                      <option value="Three Phase (415V)">Three Phase (415V) — Recommended for Fast AC & DC</option>
                      <option value="Single Phase (230V)">Single Phase (230V) — Suitable for 3.3 kW / 7 kW</option>
                      <option value="Transformer On-Premises">Dedicated Transformer On-Premises</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Sanctioned Electrical Load (kW)</label>
                    <input
                      type="number"
                      value={sanctionedLoadKw}
                      onChange={(e) => setSanctionedLoadKw(parseInt(e.target.value))}
                      className="w-full p-2 rounded-xl border border-neutral-200 bg-white"
                      placeholder="e.g. 25"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Commercial Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Preferred Model</label>
                  <select
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200"
                  >
                    <option value="revenue_share">Revenue Share (% Net Charging Profit)</option>
                    <option value="fixed_rent">Guaranteed Monthly Rent</option>
                    <option value="hybrid">Hybrid (Monthly Rent + Profit Share)</option>
                  </select>
                </div>

                {preferredModel === 'revenue_share' ? (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Your Desired Revenue Share: {proposedSplitPercent}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="70"
                      step="5"
                      value={proposedSplitPercent}
                      onChange={(e) => setProposedSplitPercent(parseInt(e.target.value))}
                      className="w-full accent-neutral-900 mt-2"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      50% to you, 50% to partner is standard in Indian metropolitan areas.
                    </span>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Expected Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={expectedRent}
                      onChange={(e) => setExpectedRent(parseInt(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-neutral-200"
                      placeholder="8000"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Description & Driver Access</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200"
                  placeholder="Describe proximity to main roads, gate access, security, surrounding footfall, or café amenities..."
                />
              </div>

              </div>

              {/* Pinned Modal Footer */}
              <div className="p-4 sm:px-8 sm:py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsListModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Site to Co-Host Marketplace</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
