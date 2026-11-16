import React, { useState, useId } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Zap, 
  Car, 
  Bike, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Charger, User, Booking } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { createBooking, isSlotDoubleBooked, getCommissionRate } from '../services/storage';

interface BookingModalProps {
  charger: Charger;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  charger,
  currentUser,
  isOpen,
  onClose,
  onBookingSuccess
}) => {
  if (!isOpen) return null;

  // Dates: Today, Tomorrow, Day after
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterStr = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('14:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [selectedConnector, setSelectedConnector] = useState<string>(charger.connectorTypes[0]);
  
  // Vehicle Details
  const [vehicleType, setVehicleType] = useState<'two_wheeler' | 'four_wheeler'>(
    currentUser.vehicleType || (charger.supportedVehicles === 'two_wheeler' ? 'two_wheeler' : 'four_wheeler')
  );
  const [vehicleModel, setVehicleModel] = useState<string>(
    currentUser.vehicleModel || (vehicleType === 'two_wheeler' ? 'Ather 450X' : 'Tata Nexon EV Max')
  );
  const [vehiclePlate, setVehiclePlate] = useState<string>(currentUser.vehiclePlateNumber || 'KA 03 EV 2024');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Time Slots definition
  const timeSlots = [
    { start: '08:00', end: '10:00', label: '08:00 AM' },
    { start: '10:00', end: '12:00', label: '10:00 AM' },
    { start: '12:00', end: '14:00', label: '12:00 PM' },
    { start: '14:00', end: '16:00', label: '02:00 PM' },
    { start: '16:00', end: '18:00', label: '04:00 PM' },
    { start: '18:00', end: '20:00', label: '06:00 PM' },
    { start: '20:00', end: '22:00', label: '08:00 PM' },
  ];

  // Pricing calculations
  const commissionRate = getCommissionRate();
  const estimatedEnergyKwh = Math.round(charger.powerRatingKw * durationHours * 0.85 * 10) / 10;
  const baseCost = Math.round(estimatedEnergyKwh * charger.pricingPerKwh);
  const platformFee = Math.round(baseCost * commissionRate * 100) / 100;
  const gstAmount = Math.round(platformFee * BRAND_CONFIG.gstRate * 100) / 100;
  const totalAmount = Math.round((baseCost + platformFee + gstAmount) * 100) / 100;

  // Handle Form Submission
  const handleConfirmBooking = () => {
    setErrorMessage(null);

    // Validation
    if (!vehicleModel.trim()) {
      setErrorMessage('Please specify your vehicle model.');
      return;
    }
    if (!vehiclePlate.trim()) {
      setErrorMessage('Please enter your vehicle registration plate number.');
      return;
    }

    // Double Booking Check
    if (isSlotDoubleBooked(charger.id, selectedDate, selectedTimeSlot)) {
      setErrorMessage(`The ${selectedTimeSlot} slot on ${selectedDate} has already been reserved. Please select another slot.`);
      return;
    }

    setIsProcessing(true);

    // Simulate 1.2s realistic gateway processing
    setTimeout(() => {
      // Calculate end time
      const [startHour, startMin] = selectedTimeSlot.split(':').map(Number);
      const endHour = Math.min(23, startHour + Math.ceil(durationHours));
      const endTimeStr = `${endHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`;

      const newBooking = createBooking({
        charger,
        driver: currentUser,
        bookingDate: selectedDate,
        startTime: selectedTimeSlot,
        endTime: endTimeStr,
        durationHours,
        connectorType: selectedConnector as any,
        driverVehicleModel: vehicleModel,
        driverVehiclePlate: vehiclePlate,
        driverVehicleType: vehicleType,
        notes: `Reserved via ChargeCircle Instant Booking. Connector: ${selectedConnector}.`
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }

      setIsProcessing(false);
      onBookingSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Book Charging Slot</h2>
              <p className="text-xs text-slate-300 line-clamp-1">{charger.name}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Select Date */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              1. Select Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Today', val: todayStr },
                { label: 'Tomorrow', val: tomorrowStr },
                { label: 'Day After', val: dayAfterStr }
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => setSelectedDate(d.val)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedDate === d.val
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                  }`}
                >
                  <div className="text-xs font-semibold">{d.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{d.val}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Time Slot */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                2. Select Available Time Slot
              </label>
              <span className="text-[11px] text-slate-500">Host Hours: {charger.operatingHours.open} - {charger.operatingHours.close}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const isBooked = isSlotDoubleBooked(charger.id, selectedDate, slot.start);
                const isSelected = selectedTimeSlot === slot.start;

                return (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTimeSlot(slot.start)}
                    className={`p-2.5 rounded-xl border text-center transition-all relative ${
                      isBooked
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-sm'
                        : 'border-slate-200 hover:border-emerald-300 text-slate-700 font-medium hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-semibold">{slot.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : isBooked ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isBooked ? 'Booked' : 'Available'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Estimated Duration & Connector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
                3. Estimated Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      durationHours === hrs
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
                4. Select Connector
              </label>
              <select
                value={selectedConnector}
                onChange={(e) => setSelectedConnector(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {charger.connectorTypes.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 4: Vehicle Information */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5. Vehicle Details
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleType('four_wheeler')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
                    vehicleType === 'four_wheeler'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <Car className="w-3 h-3" />
                  <span>Car</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('two_wheeler')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
                    vehicleType === 'two_wheeler'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <Bike className="w-3 h-3" />
                  <span>Two-Wheeler</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Tata Nexon EV / Ather 450X"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Registration Plate</label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="e.g. KA 03 MX 9482"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Step 5: Price Breakdown */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Estimated Energy ({charger.powerRatingKw} kW × {durationHours}h)</span>
              <span className="font-semibold text-slate-800">~{estimatedEnergyKwh} kWh</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Energy Charge ({BRAND_CONFIG.currency}{charger.pricingPerKwh} / kWh)</span>
              <span className="font-semibold text-slate-800">{BRAND_CONFIG.currency}{baseCost}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                Platform Service Fee ({Math.round(commissionRate * 100)}%)
                <span title="Covers 24x7 verified host protection, dispute resolution and payment processing" className="cursor-help">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </span>
              </span>
              <span className="font-semibold text-slate-800">{BRAND_CONFIG.currency}{platformFee}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>GST on Service Fee (18%)</span>
              <span className="font-semibold text-slate-800">{BRAND_CONFIG.currency}{gstAmount}</span>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-[11px] text-slate-500 block">Host earnings: {BRAND_CONFIG.currency}{Math.round(baseCost - platformFee)}</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-700">
                {BRAND_CONFIG.currency}{totalAmount}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
              6. Payment Method (Demo Gateway)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs">UPI (GPay / PhonePe)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs">Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'NetBanking'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <Zap className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated demo checkout. No real money will be charged.</span>
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmBooking}
            className="flex-1 max-w-xs px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Pay {BRAND_CONFIG.currency}{totalAmount}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
