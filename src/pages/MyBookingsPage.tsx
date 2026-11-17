import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Zap, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  MessageSquare, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Booking, User, Charger } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { getBookings, cancelBooking, seedSampleDataForUser } from '../services/storage';

interface MyBookingsPageProps {
  currentUser: User;
  onNavigate: (page: string, params?: any) => void;
  onViewBookingDetails: (booking: Booking) => void;
  onOpenReviewModal: (charger: any) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  currentUser,
  onNavigate,
  onViewBookingDetails,
  onOpenReviewModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const allBookings = getBookings();

  // Filter bookings for current driver (or show all demo bookings for Ananya)
  const userBookings = allBookings.filter(b => b.driverId === currentUser.id || currentUser.role === 'admin' || currentUser.id === 'user_driver_1');

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'upcoming') return b.bookingStatus === 'confirmed' || b.bookingStatus === 'active_charging';
    if (activeTab === 'completed') return b.bookingStatus === 'completed';
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Confirmed
          </span>
        );
      case 'active_charging':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 animate-pulse">
            Charging Active
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Driver Dashboard</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5">My Charging Bookings</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your upcoming station passes and historical receipts</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('find_chargers')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 self-start"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Book New Station</span>
          </button>
        </div>

        {/* Fresh Account Helper Banner */}
        {userBookings.length === 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Welcome, {currentUser.name}! You are in your personal Driver Portal.
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Since this is a fresh account, you have 0 reservations. You can book any station on the live map, or load sample reservations to test the QR pass and charging timers.
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
                Load Sample Bookings
              </button>
              <button
                type="button"
                onClick={() => onNavigate('find_chargers')}
                className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs whitespace-nowrap"
              >
                Find Chargers
              </button>
            </div>
          </div>
        )}

        {/* Tabs Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 mb-6 max-w-md shadow-xs">
          {[
            { id: 'upcoming', label: 'Upcoming Slots' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'all', label: 'All History' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No {activeTab} bookings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reserved any charging slots in this category. Ready to find a convenient charger?
            </p>
            <button
              type="button"
              onClick={() => onNavigate('find_chargers')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              Discover Nearby Chargers
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img 
                    src={booking.chargerImage} 
                    alt="" 
                    className="w-20 h-20 rounded-xl object-cover shrink-0" 
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-400">{booking.bookingCode}</span>
                      {getStatusBadge(booking.bookingStatus)}
                    </div>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">{booking.chargerName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{booking.chargerAddress}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.bookingDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.startTime} - {booking.endTime}</span>
                      </span>
                      <span className="font-semibold text-emerald-700">
                        {BRAND_CONFIG.currency}{booking.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => onViewBookingDetails(booking)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View QR Pass</span>
                  </button>

                  {booking.bookingStatus === 'completed' && (
                    <button
                      type="button"
                      onClick={() => onOpenReviewModal({ id: booking.chargerId, name: booking.chargerName })}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Review Host</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
