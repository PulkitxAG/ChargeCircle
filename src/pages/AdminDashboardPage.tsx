import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Percent, 
  Settings, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { User, Charger, Booking, InstallationRequest } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { 
  getChargers, 
  getBookings, 
  getUsers, 
  getInstallationRequests, 
  getCommissionRate, 
  updateCommissionRate,
  updateChargerVerification,
  updateInstallationStatus,
  resetDemoData,
  isAuthorizedAdmin
} from '../services/storage';

interface AdminDashboardPageProps {
  currentUser: User;
  onNavigate: (page: string, params?: any) => void;
  onDataRefresh?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  onNavigate,
  onDataRefresh
}) => {
  // Security Guard: Admin View is strictly restricted to Pulkit / authorized admin
  if (!isAuthorizedAdmin(currentUser)) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Restricted Admin Portal</h2>
          <p className="text-xs text-slate-500">
            Admin access is strictly restricted to the platform administrator (<strong className="text-slate-800">pulkitagrawal089@gmail.com</strong>). Your current account ({currentUser.email}) does not have administrative privileges.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'bookings' | 'installations' | 'settings'>('overview');
  
  // Data layers
  const chargers = getChargers();
  const bookings = getBookings();
  const users = getUsers();
  const installations = getInstallationRequests();
  const currentCommission = getCommissionRate();

  // Settings State
  const [tempCommission, setTempCommission] = useState<number>(Math.round(currentCommission * 100));
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState<boolean>(false);
  const [selectedPartner, setSelectedPartner] = useState<string>('Tata Power Certified Engineering');

  // Metrics
  const totalUsersCount = users.length + 42; // Demo display
  const totalHostsCount = chargers.map(c => c.hostId).filter((v, i, a) => a.indexOf(v) === i).length;
  const totalChargersCount = chargers.length;
  const totalBookingsCount = bookings.length;
  
  const grossBookingValue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformRevenue = Math.round(bookings.reduce((sum, b) => sum + b.platformFee, 0));
  const pendingVerifications = chargers.filter(c => c.verificationStatus === 'pending' || c.verificationStatus === 'inspection_required');

  // Handlers for Verification
  const handleApproveCharger = (chargerId: string) => {
    updateChargerVerification(chargerId, 'verified', {
      identity: true,
      propertyAuthority: true,
      electricalSafety: true,
      compatibility: true
    });
    if (onDataRefresh) onDataRefresh();
  };

  const handleRejectCharger = (chargerId: string) => {
    updateChargerVerification(chargerId, 'rejected');
    if (onDataRefresh) onDataRefresh();
  };

  const handleRequestInspection = (chargerId: string) => {
    updateChargerVerification(chargerId, 'inspection_required');
    if (onDataRefresh) onDataRefresh();
  };

  const handleAssignPartner = (requestId: string) => {
    updateInstallationStatus(requestId, 'partner_assigned', selectedPartner, `Assigned to ${selectedPartner} for technical survey.`);
    if (onDataRefresh) onDataRefresh();
  };

  const handleUpdateCommission = (e: React.FormEvent) => {
    e.preventDefault();
    updateCommissionRate(tempCommission / 100);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2500);
    if (onDataRefresh) onDataRefresh();
  };

  const handleResetEverything = () => {
    if (window.confirm("Reset all prototype demo listings, bookings, and installations to clean default state?")) {
      resetDemoData();
      if (onDataRefresh) onDataRefresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-400">Strictly Internal Access</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Platform Operations & Compliance</h1>
            <p className="text-xs text-slate-500 mt-0.5">Approve host stations, verify electrical earthing tests, and configure platform revenue parameters</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetEverything}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>

        {/* Analytics Grid (6 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Booking Value</span>
            <div className="text-xl font-black text-slate-900 mt-1">{BRAND_CONFIG.currency}{grossBookingValue.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">Total driver volume</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Platform Revenue</span>
            <div className="text-xl font-black text-emerald-600 mt-1">{BRAND_CONFIG.currency}{platformRevenue.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-500">From {Math.round(currentCommission * 100)}% fee</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Chargers</span>
            <div className="text-xl font-black text-slate-900 mt-1">{totalChargersCount}</div>
            <span className="text-[10px] text-slate-500">Across 5 cities</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Review</span>
            <div className="text-xl font-black text-amber-600 mt-1">{pendingVerifications.length}</div>
            <span className="text-[10px] text-amber-700 font-semibold">Awaiting site check</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Install Leads</span>
            <div className="text-xl font-black text-slate-900 mt-1">{installations.length}</div>
            <span className="text-[10px] text-slate-500">Turnkey requests</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Drivers</span>
            <div className="text-xl font-black text-slate-900 mt-1">{totalUsersCount}</div>
            <span className="text-[10px] text-slate-500">Active community</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 mb-6 shadow-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Overview' },
            { id: 'verifications', label: `Charger Verification Queue (${pendingVerifications.length})` },
            { id: 'bookings', label: `All Transactions (${bookings.length})` },
            { id: 'installations', label: `Installation Pipeline (${installations.length})` },
            { id: 'settings', label: 'Commission & Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Locations Breakdown */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Regional City Distribution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { city: 'Bengaluru', count: chargers.filter(c => c.city === 'Bengaluru').length, pct: 45 },
                  { city: 'Delhi NCR', count: chargers.filter(c => c.city === 'Delhi NCR').length, pct: 25 },
                  { city: 'Mumbai', count: chargers.filter(c => c.city === 'Mumbai').length, pct: 20 },
                ].map((loc) => (
                  <div key={loc.city} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-slate-800">{loc.city}</strong>
                      <span className="text-emerald-700 font-bold">{loc.count} Stations</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${loc.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Queue Banner */}
            {pendingVerifications.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      {pendingVerifications.length} Stations Waiting for Electrical Grounding & ID Verification
                    </h4>
                    <p className="text-[11px] text-amber-800">Review submitted charger specs to ensure zero electrocution risk for EV drivers.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('verifications')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Review Queue
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: CHARGER VERIFICATION QUEUE */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Host Charger Verification Queue</h3>
                <p className="text-xs text-slate-500">Every community charger must satisfy Identity, Property Authority, and Certified Earthing checks</p>
              </div>
            </div>

            {chargers.map((charger) => {
              const isPending = charger.verificationStatus === 'pending' || charger.verificationStatus === 'inspection_required';

              return (
                <div 
                  key={charger.id}
                  className={`p-6 bg-white rounded-3xl border shadow-xs space-y-4 ${
                    isPending ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={charger.images[0]} 
                        alt="" 
                        className="w-20 h-20 rounded-2xl object-cover shrink-0" 
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{charger.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            charger.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                            charger.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-800' :
                            charger.verificationStatus === 'inspection_required' ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {charger.verificationStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900">{charger.name}</h4>
                        <p className="text-xs text-slate-500">{charger.address}, {charger.city}</p>
                        <p className="text-xs text-slate-600">
                          Host: <strong>{charger.hostName}</strong> ({charger.hostPhone}) · Property: <span className="capitalize">{charger.hostType}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {charger.verificationStatus !== 'verified' && (
                        <button
                          type="button"
                          onClick={() => handleApproveCharger(charger.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Grant Badges</span>
                        </button>
                      )}

                      {charger.verificationStatus === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleRequestInspection(charger.id)}
                          className="px-3.5 py-2 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold"
                        >
                          Schedule On-Site Inspection
                        </button>
                      )}

                      {charger.verificationStatus !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleRejectCharger(charger.id)}
                          className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                        >
                          Reject / Flag
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Safety Audit Checklist */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">1. Host Identity</span>
                      <strong className={charger.verificationBadges.identity ? 'text-emerald-700' : 'text-slate-400'}>
                        {charger.verificationBadges.identity ? '✓ Aadhaar / Pan Verified' : 'Pending Verification'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">2. Property Authority</span>
                      <strong className={charger.verificationBadges.propertyAuthority ? 'text-emerald-700' : 'text-slate-400'}>
                        {charger.verificationBadges.propertyAuthority ? '✓ Ownership / RWA NOC' : 'Pending Upload'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">3. Electrical Earthing</span>
                      <strong className={charger.verificationBadges.electricalSafety ? 'text-emerald-700' : 'text-amber-700 font-bold'}>
                        {charger.verificationBadges.electricalSafety ? '✓ < 2V Tested & Passed' : 'Inspection Required'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">4. EV Compatibility</span>
                      <strong className={charger.verificationBadges.compatibility ? 'text-emerald-700' : 'text-slate-400'}>
                        {charger.verificationBadges.compatibility ? '✓ BMS Handshake Tested' : 'Standard 15A Socket'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: ALL TRANSACTIONS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Platform Bookings & Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Station</th>
                    <th className="pb-3">Driver</th>
                    <th className="pb-3">Host</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Gross</th>
                    <th className="pb-3">Commission</th>
                    <th className="pb-3">Host Net</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-3 font-mono font-bold text-slate-800">{b.bookingCode}</td>
                      <td className="py-3 font-medium text-slate-900 truncate max-w-[160px]">{b.chargerName}</td>
                      <td className="py-3 text-slate-600">{b.driverName}</td>
                      <td className="py-3 text-slate-600">{b.hostName}</td>
                      <td className="py-3 text-slate-500">{b.bookingDate}</td>
                      <td className="py-3 font-bold text-slate-900">{BRAND_CONFIG.currency}{b.totalAmount}</td>
                      <td className="py-3 font-bold text-purple-700">{BRAND_CONFIG.currency}{b.platformFee}</td>
                      <td className="py-3 font-bold text-emerald-700">{BRAND_CONFIG.currency}{b.hostPayout}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: INSTALLATION PIPELINE */}
        {activeTab === 'installations' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Partner Turnkey Installation Requests</h3>
            
            <div className="space-y-4">
              {installations.map((inst) => (
                <div key={inst.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{inst.requestCode}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                        {inst.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Created: {inst.createdAt}</span>
                  </div>

                  <div className="text-xs text-slate-800">
                    <strong>{inst.name}</strong> · {inst.phone} · {inst.email}
                  </div>

                  <div className="text-xs text-slate-600">
                    Location: {inst.address}, {inst.city} ({inst.propertyType})
                  </div>

                  <div className="text-xs text-slate-500">
                    Meter: {inst.meterConnection} · Parking: {inst.parkingSpaceType} · Timeline: {inst.preferredTimeline}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-600">Partner Assigned:</span>
                      <select
                        value={inst.partnerAssigned || selectedPartner}
                        onChange={(e) => setSelectedPartner(e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Tata Power Certified Engineering">Tata Power Certified Engineering</option>
                        <option value="Statiq Network Installers">Statiq Network Installers</option>
                        <option value="Exicom Power Systems Team">Exicom Power Systems Team</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAssignPartner(inst.id)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                    >
                      Confirm Partner Assignment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMMISSION & REVENUE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Commission Configuration</h3>
              <p className="text-xs text-slate-500">
                Adjust platform commission rate dynamically. This immediately recalculates driver platform fees and host payouts across the entire system.
              </p>
            </div>

            {saveSettingsSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Commission settings updated successfully across the marketplace!</span>
              </div>
            )}

            <form onSubmit={handleUpdateCommission} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Platform Commission Percentage:</span>
                  <span className="text-purple-700 text-base font-extrabold">{tempCommission}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={tempCommission}
                  onChange={(e) => setTempCommission(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Current host payout: {100 - tempCommission}% · Platform Gross Margin: {tempCommission}%
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800">Sample Revenue Simulation:</div>
                <div className="flex justify-between text-slate-600">
                  <span>Booking Amount:</span>
                  <strong>{BRAND_CONFIG.currency}200.00</strong>
                </div>
                <div className="flex justify-between text-purple-700">
                  <span>Platform Commission ({tempCommission}%):</span>
                  <strong>{BRAND_CONFIG.currency}{(200 * tempCommission / 100).toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Host Payout ({100 - tempCommission}%):</span>
                  <strong>{BRAND_CONFIG.currency}{(200 * (100 - tempCommission) / 100).toFixed(2)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md"
              >
                Save Commission Rate
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
