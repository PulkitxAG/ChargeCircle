import React, { useState } from 'react';
import { 
  Layers, 
  Zap, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  ArrowUpRight, 
  Edit3, 
  Power,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Download,
  Handshake,
  Building2,
  Check,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, Charger, Booking, InstallationRequest, SitePartnershipListing, PartnershipProposal } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { 
  getChargers, 
  getBookings, 
  getCommissionRate, 
  updateCharger, 
  updateBookingStatus,
  getInstallationRequests,
  getSitePartnerships,
  getPartnershipProposals,
  updateProposalStatus,
  seedSampleDataForUser
} from '../services/storage';
import { VerificationBadgePill } from '../components/VerificationBadgePill';

interface HostDashboardPageProps {
  currentUser: User;
  onNavigate: (page: string, params?: any) => void;
  onEditCharger?: (charger: Charger) => void;
}

export const HostDashboardPage: React.FC<HostDashboardPageProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'chargers' | 'bookings' | 'earnings' | 'installations' | 'partnerships'>('overview');
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);
  const [proposalStatusMsg, setProposalStatusMsg] = useState<string | null>(null);

  const chargers = getChargers();
  const allBookings = getBookings();
  const installRequests = getInstallationRequests();
  const commissionRate = getCommissionRate();
  const allSiteListings = getSitePartnerships();
  const allProposals = getPartnershipProposals();

  // Host chargers (show user's chargers or first two demo chargers if Rajesh)
  const hostChargers = chargers.filter(c => c.hostId === currentUser.id || currentUser.id === 'user_host_1');
  const hostBookings = allBookings.filter(b => hostChargers.some(c => c.id === b.chargerId));

  // Host site partnerships & proposals
  const mySitePartnerships = allSiteListings.filter(s => s.propertyOwnerId === currentUser.id || currentUser.id === 'user_host_1');
  const myProposals = allProposals.filter(p => p.propertyOwnerId === currentUser.id || currentUser.id === 'user_host_1');

  const handleUpdateProposal = (proposalId: string, status: 'accepted' | 'declined' | 'negotiating') => {
    updateProposalStatus(proposalId, status);
    if (status === 'accepted') {
      setProposalStatusMsg('Partnership offer accepted! Co-hosting agreement generated and charger scheduled for installation.');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else if (status === 'declined') {
      setProposalStatusMsg('Offer declined.');
    } else {
      setProposalStatusMsg('Counter-terms sent to partner.');
    }
  };

  // Metrics
  const totalBookingsCount = hostBookings.length;
  const completedBookings = hostBookings.filter(b => b.bookingStatus === 'completed');
  const upcomingBookings = hostBookings.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'active_charging');

  const totalGrossRevenue = hostBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.baseCost, 0);

  const totalHostPayout = Math.round(totalGrossRevenue * (1 - commissionRate));
  const totalPlatformFees = Math.round(totalGrossRevenue * commissionRate);

  const avgRating = hostChargers.length > 0
    ? (hostChargers.reduce((sum, c) => sum + c.rating, 0) / hostChargers.length).toFixed(1)
    : '5.0';

  const handleToggleChargerStatus = (charger: Charger) => {
    const updated = {
      ...charger,
      isAvailableNow: !charger.isAvailableNow
    };
    updateCharger(updated);
  };

  const handlePriceUpdate = (charger: Charger, newPrice: number) => {
    const updated = {
      ...charger,
      pricingPerKwh: newPrice
    };
    updateCharger(updated);
  };

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
  };

  const handleRejectBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const handleRequestPayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Host Partner Portal
              </span>
              <span className="text-xs text-slate-400">Host ID: {currentUser.id}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Host Operations Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage charging stations, monitor live driver sessions, and track payouts</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('become_host')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Charger</span>
            </button>
          </div>
        </div>

        {/* Sample Data Helper Banner for Custom / Fresh Accounts */}
        {hostChargers.length === 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Welcome, {currentUser.name}! You are viewing your personal Host Portal.
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Since this is a newly registered account, your listed stations and earnings start at zero. You can list your first charger, or load sample host data to test this dashboard with simulated revenue graphs.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  seedSampleDataForUser(currentUser);
                  window.location.reload();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shadow-xs"
              >
                Load Sample Host Data
              </button>
              <button
                type="button"
                onClick={() => onNavigate('become_host')}
                className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs whitespace-nowrap"
              >
                + List My Charger
              </button>
            </div>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Net Host Payouts</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {BRAND_CONFIG.currency}{totalHostPayout.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500 block">Gross Bookings: {BRAND_CONFIG.currency}{totalGrossRevenue.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Sessions</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {completedBookings.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block">{upcomingBookings.length} upcoming reservations</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Stations</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {hostChargers.filter(c => c.isAvailableNow).length} / {hostChargers.length}
            </div>
            <span className="text-[11px] text-slate-500 block">Listed in {currentUser.name.split(' ')[0]}'s portfolio</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Host Rating</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center gap-1">
              <Star className="w-6 h-6 fill-amber-400" />
              <span>{avgRating}</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Based on verified reviews</span>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 mb-6 shadow-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'chargers', label: `My Chargers (${hostChargers.length})` },
            { id: 'partnerships', label: `Site Partnerships (${mySitePartnerships.length})` },
            { id: 'bookings', label: `Bookings (${hostBookings.length})` },
            { id: 'earnings', label: 'Earnings & Commission' },
            { id: 'installations', label: `Installation Requests (${installRequests.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & MY CHARGERS */}
        {(activeTab === 'overview' || activeTab === 'chargers') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Listed Charging Points</h3>
                <p className="text-xs text-slate-500">Toggle station online status, update pricing per kWh, and view electrical inspection status</p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('become_host')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Station</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hostChargers.map((charger) => (
                <div 
                  key={charger.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={charger.images[0]} 
                        alt="" 
                        className="w-16 h-16 rounded-2xl object-cover shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {charger.verificationStatus === 'verified' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Station</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Pending Physical Verification</span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{charger.name}</h4>
                        <p className="text-xs text-slate-500">{charger.landmark}, {charger.city}</p>
                      </div>
                    </div>

                    {/* Toggle Station Online / Offline */}
                    <button
                      type="button"
                      onClick={() => handleToggleChargerStatus(charger)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        charger.isAvailableNow 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{charger.isAvailableNow ? 'Online' : 'Offline'}</span>
                    </button>
                  </div>

                  {/* Verification Badges Display */}
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Safety & Compliance Audit</span>
                    <VerificationBadgePill badges={charger.verificationBadges} />
                  </div>

                  {/* Specs & Pricing Controls */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Power Output</span>
                      <strong className="text-slate-900">{charger.powerRatingKw} kW</strong>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Hours</span>
                      <strong className="text-slate-900">{charger.operatingHours.open} - {charger.operatingHours.close}</strong>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Your Price</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="font-extrabold text-emerald-700">{BRAND_CONFIG.currency}</span>
                        <input
                          type="number"
                          min="10"
                          max="35"
                          value={charger.pricingPerKwh}
                          onChange={(e) => handlePriceUpdate(charger, Number(e.target.value))}
                          className="w-12 px-1.5 py-0.5 text-xs font-bold rounded border border-slate-300 text-slate-900"
                        />
                        <span className="text-[10px] text-slate-400">/kWh</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Incoming & Historical Driver Sessions</h3>

            {hostBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No bookings recorded yet for your chargers.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Booking Ref</th>
                      <th className="pb-3">Driver</th>
                      <th className="pb-3">Vehicle</th>
                      <th className="pb-3">Date & Slot</th>
                      <th className="pb-3">Energy</th>
                      <th className="pb-3">Payout</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hostBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-800">{b.bookingCode}</td>
                        <td className="py-3 font-semibold text-slate-900">
                          {b.driverName}
                          <span className="block text-[10px] text-slate-400">{b.driverPhone}</span>
                        </td>
                        <td className="py-3 text-slate-600">
                          {b.driverVehicleModel}
                          <span className="block text-[10px] uppercase font-mono text-slate-400">{b.driverVehiclePlate}</span>
                        </td>
                        <td className="py-3 text-slate-700">
                          {b.bookingDate}
                          <span className="block text-[10px] text-slate-400">{b.startTime} - {b.endTime}</span>
                        </td>
                        <td className="py-3 text-slate-700">~{b.energyEstimatedKwh} kWh</td>
                        <td className="py-3 font-bold text-emerald-700">{BRAND_CONFIG.currency}{b.hostPayout}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                            b.bookingStatus === 'active_charging' ? 'bg-teal-50 text-teal-700 animate-pulse' :
                            b.bookingStatus === 'completed' ? 'bg-slate-100 text-slate-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {b.bookingStatus === 'active_charging' ? (
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.id, 'completed')}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-[10px]"
                            >
                              End Session
                            </button>
                          ) : b.bookingStatus === 'confirmed' ? (
                            <button
                              type="button"
                              onClick={() => handleRejectBooking(b.id)}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-semibold"
                            >
                              Cancel Slot
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EARNINGS & COMMISSION */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            
            {/* Commission Breakdown Highlight */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Platform Commission & Payout Structure</h3>
                  <p className="text-xs text-slate-500">
                    Transparent {Math.round(commissionRate * 100)}% platform fee covers host property insurance, payment gateway fees, and 24x7 customer support.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRequestPayout}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Request Instant Payout ({BRAND_CONFIG.currency}{totalHostPayout})</span>
                </button>
              </div>

              {payoutSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Payout transfer of {BRAND_CONFIG.currency}{totalHostPayout} has been initiated to your verified bank account (HDFC Bank ending •••• 9842) via UPI IMPS.</span>
                </div>
              )}

              {/* Formula Demonstration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Driver Billing</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">{BRAND_CONFIG.currency}{totalGrossRevenue}</div>
                  <span className="text-[10px] text-slate-500">Total session energy billed</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Platform Fee ({Math.round(commissionRate * 100)}%)</span>
                  <div className="text-xl font-extrabold text-amber-900 mt-0.5">{BRAND_CONFIG.currency}{totalPlatformFees}</div>
                  <span className="text-[10px] text-amber-700">Service & insurance coverage</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Net Host Earnings (90%)</span>
                  <div className="text-xl font-black text-emerald-800 mt-0.5">{BRAND_CONFIG.currency}{totalHostPayout}</div>
                  <span className="text-[10px] text-emerald-700">Deposited directly to your account</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: INSTALLATION REQUESTS */}
        {activeTab === 'installations' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Partner Installation Requests Pipeline</h3>
            <p className="text-xs text-slate-500">Track status of requested site feasibility assessments and partner turnkey charger setups</p>

            <div className="space-y-3 pt-2">
              {installRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-800">{req.requestCode}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Submitted: {req.createdAt}</span>
                  </div>

                  <div className="text-xs text-slate-800">
                    <strong>{req.name}</strong> · {req.propertyType} in {req.city} ({req.address})
                  </div>

                  <div className="text-xs text-slate-500">
                    Meter: {req.meterConnection} · Parking: {req.parkingSpaceType} · Partner: {req.partnerAssigned || 'Assigning partner...'}
                  </div>

                  {req.notes && (
                    <div className="text-[11px] p-2 bg-white rounded-xl border border-slate-200 text-slate-600">
                      <strong>Survey Notes:</strong> {req.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SITE PARTNERSHIPS */}
        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            
            {/* Success notification */}
            {proposalStatusMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{proposalStatusMsg}</span>
                </div>
                <button onClick={() => setProposalStatusMsg(null)} className="text-emerald-700 hover:text-emerald-900">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Top Overview & Action */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1">
                    Co-Hosting & Site Matching
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Property Owner ↔ EV Charger Partnerships
                  </h3>
                  <p className="text-xs text-slate-500">
                    You provide the parking bay & electricity supply; EV investors supply the charger, fund installation, and split charging income with you.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigate('site_partnerships')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>List Another Space</span>
                  </button>
                </div>
              </div>

              {/* Proposals Received */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>Investment Proposals Received from EV Operators ({myProposals.length})</span>
                </h4>

                {myProposals.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    No proposals received yet. Your listed spaces are active on the co-hosting marketplace.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myProposals.map((prop) => (
                      <div 
                        key={prop.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              For: {prop.siteTitle}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900 mt-0.5">
                              {prop.partnerName}
                            </h5>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {prop.partnerCompanyOrType} · {prop.partnerPhone}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              prop.status === 'accepted' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : prop.status === 'declined'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : prop.status === 'negotiating'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                            }`}>
                              {prop.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Hardware & Offer Details Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Hardware Deployed</span>
                            <strong className="text-slate-800 block truncate">{prop.proposedHardware}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Partner Investment</span>
                            <strong className="text-emerald-700 block">₹{prop.hardwareInvestmentValue?.toLocaleString()} (100% Funded)</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Commercial Split</span>
                            <strong className="text-slate-800 block">
                              {prop.proposedSplitModel === 'revenue_share'
                                ? `${prop.ownerSharePercent}% You / ${prop.partnerSharePercent}% Partner`
                                : `₹${prop.fixedRentOfferMonthly?.toLocaleString()} / mo Rent`}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Contract & Maintenance</span>
                            <strong className="text-slate-800 block">{prop.contractTermYears} Years (Free Maint.)</strong>
                          </div>
                        </div>

                        {/* Partner Note */}
                        <div className="p-3 rounded-xl bg-slate-100/80 text-xs text-slate-700">
                          <strong>Partner Note:</strong> "{prop.message}"
                        </div>

                        {/* Interactive Actions */}
                        {prop.status === 'pending' && (
                          <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateProposal(prop.id, 'declined')}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateProposal(prop.id, 'negotiating')}
                              className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-semibold"
                            >
                              Negotiate Terms
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateProposal(prop.id, 'accepted')}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept Partnership Offer</span>
                            </button>
                          </div>
                        )}

                        {prop.status === 'accepted' && (
                          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Partnership Active: Installer has been dispatched for electrical hookup and station deployment.</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Your Listed Spaces */}
              <div className="pt-8 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Your Listed Spaces Available for Co-Hosting ({mySitePartnerships.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mySitePartnerships.map((site) => (
                    <div key={site.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {site.city} · {site.parkingAccessType}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm mt-0.5">{site.title}</h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          site.status === 'partnered' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {site.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500">
                        {site.sanctionedLoadKw} kW ({site.meterConnection}) · {site.parkingBaysAvailable} Bays · {site.proposalsCount} Proposals
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigate('site_partnerships')}
                        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <span>View in Marketplace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
