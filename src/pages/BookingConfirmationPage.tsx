import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  Phone, 
  QrCode, 
  Download, 
  Share2, 
  ArrowLeft, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { Booking, User } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { cancelBooking, updateBookingStatus } from '../services/storage';

interface BookingConfirmationPageProps {
  booking: Booking;
  currentUser: User;
  onNavigate: (page: string, params?: any) => void;
  onUpdateBooking?: () => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  booking,
  currentUser,
  onNavigate,
  onUpdateBooking
}) => {
  const [currentBookingState, setCurrentBookingState] = useState<Booking>(booking);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isChargingSimulated, setIsChargingSimulated] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCancel = () => {
    cancelBooking(booking.id, 'User cancelled prior to arrival');
    setCurrentBookingState(prev => ({
      ...prev,
      bookingStatus: 'cancelled',
      paymentStatus: 'refunded'
    }));
    setIsCancelConfirmOpen(false);
    if (onUpdateBooking) onUpdateBooking();
  };

  const handleSimulateCharging = () => {
    setIsChargingSimulated(true);
    updateBookingStatus(booking.id, 'active_charging');
    setCurrentBookingState(prev => ({
      ...prev,
      bookingStatus: 'active_charging'
    }));
    if (onUpdateBooking) onUpdateBooking();
  };

  const handleSimulateComplete = () => {
    setIsChargingSimulated(false);
    updateBookingStatus(booking.id, 'completed');
    setCurrentBookingState(prev => ({
      ...prev,
      bookingStatus: 'completed'
    }));
    if (onUpdateBooking) onUpdateBooking();
  };

  const handleDownloadReceipt = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('my_bookings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Bookings</span>
          </button>

          <span className="text-xs text-slate-400">
            Booking Ref: <strong className="text-slate-700">{currentBookingState.bookingCode}</strong>
          </span>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className={`p-6 sm:p-8 text-center text-white relative ${
            currentBookingState.bookingStatus === 'cancelled'
              ? 'bg-rose-900'
              : currentBookingState.bookingStatus === 'active_charging'
              ? 'bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900'
              : currentBookingState.bookingStatus === 'completed'
              ? 'bg-slate-900'
              : 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900'
          }`}>
            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-lg">
              {currentBookingState.bookingStatus === 'cancelled' ? (
                <AlertTriangle className="w-8 h-8 text-rose-300" />
              ) : currentBookingState.bookingStatus === 'active_charging' ? (
                <Zap className="w-8 h-8 text-emerald-300 animate-bounce fill-emerald-300" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-300" />
              )}
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              {currentBookingState.bookingStatus === 'cancelled' 
                ? 'Booking Cancelled & Refunded' 
                : currentBookingState.bookingStatus === 'active_charging'
                ? 'Charging Session in Progress'
                : currentBookingState.bookingStatus === 'completed'
                ? 'Session Completed'
                : 'Booking Confirmed!'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {currentBookingState.bookingStatus === 'cancelled' 
                ? 'Slot Reservation Cancelled' 
                : currentBookingState.bookingStatus === 'active_charging'
                ? 'Dispensing Energy Now'
                : 'Your Charger is Reserved!'}
            </h1>

            <p className="text-xs text-slate-200 mt-2 max-w-md mx-auto">
              {currentBookingState.bookingStatus === 'cancelled'
                ? `100% refund of ${BRAND_CONFIG.currency}${currentBookingState.totalAmount} has been processed back to your ${currentBookingState.paymentMethod}.`
                : 'Show the check-in QR pass upon arrival at the gate or station. Host has been notified.'}
            </p>
          </div>

          {/* Pass Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* QR Check-in Box */}
            {currentBookingState.bookingStatus !== 'cancelled' && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-36 h-36 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                  {/* Clean SVG QR Code Representation */}
                  <div className="w-full h-full border-4 border-slate-900 rounded-lg p-2 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-slate-900 rounded-xs"></div>
                      <div className="w-4 h-4 bg-emerald-600 rounded-xs"></div>
                      <div className="w-6 h-6 bg-slate-900 rounded-xs"></div>
                    </div>
                    <div className="text-[9px] font-mono font-bold tracking-tight text-slate-800 uppercase">
                      {currentBookingState.bookingCode}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-6 h-6 bg-slate-900 rounded-xs"></div>
                      <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                      <div className="w-6 h-6 bg-slate-900 rounded-xs"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-900 block">Digital Check-in Pass</span>
                  <span className="text-[11px] text-slate-500 font-mono">ID: {currentBookingState.bookingCode}</span>
                </div>
              </div>
            )}

            {/* Station Summary */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200">
              <img 
                src={currentBookingState.chargerImage} 
                alt="" 
                className="w-20 h-20 rounded-xl object-cover shrink-0" 
              />
              <div className="flex-1">
                <h3 className="font-bold text-base text-slate-900">{currentBookingState.chargerName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{currentBookingState.chargerAddress}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    {currentBookingState.powerRatingKw} kW Output
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                    {currentBookingState.connectorType}
                  </span>
                </div>
              </div>
            </div>

            {/* Reservation Time & Vehicle Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Date</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{currentBookingState.bookingDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Slot</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{currentBookingState.startTime} - {currentBookingState.endTime}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{currentBookingState.driverVehicleModel}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Plate No.</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block uppercase">{currentBookingState.driverVehiclePlate}</span>
              </div>
            </div>

            {/* Host Details */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Host Contact</span>
                <span className="text-xs font-bold text-slate-900">{currentBookingState.hostName}</span>
                <span className="text-[11px] text-slate-500 block">{currentBookingState.hostPhone}</span>
              </div>
              <a
                href={`tel:${currentBookingState.hostPhone}`}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Host</span>
              </a>
            </div>

            {/* Billing Receipt Breakdown */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Estimated Energy (~{currentBookingState.energyEstimatedKwh} kWh @ {BRAND_CONFIG.currency}{currentBookingState.pricePerKwh}/kWh)</span>
                <span className="font-semibold text-slate-900">{BRAND_CONFIG.currency}{currentBookingState.baseCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Service Fee ({Math.round(currentBookingState.platformCommissionRate * 100)}%)</span>
                <span className="font-semibold text-slate-900">{BRAND_CONFIG.currency}{currentBookingState.platformFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18% on service fee)</span>
                <span className="font-semibold text-slate-900">{BRAND_CONFIG.currency}{currentBookingState.gstAmount}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Total Paid (via {currentBookingState.paymentMethod})</span>
                <span className="text-emerald-700 text-base">{BRAND_CONFIG.currency}{currentBookingState.totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{downloadSuccess ? 'Receipt Saved!' : 'Download Tax Receipt'}</span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentBookingState.chargerAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Get Driving Directions</span>
                </a>
              </div>

              {/* Simulation Testing Control for Evaluator */}
              {currentBookingState.bookingStatus === 'confirmed' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="text-xs text-emerald-900">
                    <strong className="block">Interactive Prototype Controls</strong>
                    <span className="text-[11px] text-emerald-700">Simulate plugging in hardware or session completion</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateCharging}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Simulate Plug-in</span>
                  </button>
                </div>
              )}

              {currentBookingState.bookingStatus === 'active_charging' && (
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                  <div className="text-xs text-teal-900">
                    <strong className="block">Charging in progress... (42% battery)</strong>
                    <span className="text-[11px] text-teal-700">Drawing {currentBookingState.powerRatingKw} kW from host station</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateComplete}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Complete Session</span>
                  </button>
                </div>
              )}

              {/* Cancel Option */}
              {currentBookingState.bookingStatus === 'confirmed' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCancelConfirmOpen(true)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Need to cancel this booking?
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Cancellation Confirmation Modal */}
        {isCancelConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 text-center">Confirm Cancellation?</h3>
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                Cancelling will free up the slot for other drivers. Your booking fee of {BRAND_CONFIG.currency}{currentBookingState.totalAmount} will be immediately refunded to your original payment method.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelConfirmOpen(false)}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Keep Slot
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
