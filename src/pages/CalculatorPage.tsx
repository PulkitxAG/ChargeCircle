import React, { useState } from 'react';
import { 
  Calculator, 
  Zap, 
  Car, 
  Bike, 
  Clock, 
  TrendingUp, 
  Percent, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Fuel
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

interface CalculatorPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onNavigate }) => {
  const [vehicleCategory, setVehicleCategory] = useState<'four_wheeler' | 'two_wheeler'>('four_wheeler');
  
  // Selected EV Preset or Custom
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isCustomVehicle, setIsCustomVehicle] = useState<boolean>(false);

  // Core Inputs
  const currentPresets = vehicleCategory === 'four_wheeler' 
    ? BRAND_CONFIG.popularEVs.fourWheeler 
    : BRAND_CONFIG.popularEVs.twoWheeler;

  const activePreset = currentPresets[selectedPresetIndex] || currentPresets[0];

  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState<number>(activePreset.batteryKwh);
  const [currentPercent, setCurrentPercent] = useState<number>(20);
  const [targetPercent, setTargetPercent] = useState<number>(85);
  const [pricePerKwh, setPricePerKwh] = useState<number>(15);
  const [chargerPowerKw, setChargerPowerKw] = useState<number>(activePreset.defaultPowerKw);

  // Sync preset change
  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setIsCustomVehicle(false);
    const p = currentPresets[index];
    setBatteryCapacityKwh(p.batteryKwh);
    setChargerPowerKw(p.defaultPowerKw);
  };

  const handleCategorySwitch = (cat: 'four_wheeler' | 'two_wheeler') => {
    setVehicleCategory(cat);
    setSelectedPresetIndex(0);
    setIsCustomVehicle(false);
    const presets = cat === 'four_wheeler' ? BRAND_CONFIG.popularEVs.fourWheeler : BRAND_CONFIG.popularEVs.twoWheeler;
    setBatteryCapacityKwh(presets[0].batteryKwh);
    setChargerPowerKw(presets[0].defaultPowerKw);
  };

  // Safe percentages
  const safeCurrent = Math.min(currentPercent, targetPercent - 1);
  const deltaPercent = Math.max(1, targetPercent - safeCurrent);

  // Formulas specified by prompt:
  // Energy required = Battery capacity × (Target % - Current %) / 100
  const energyRequiredKwh = Math.round((batteryCapacityKwh * deltaPercent / 100) * 10) / 10;
  
  // Estimated charging cost = Energy required × Price per kWh
  const estimatedCost = Math.round(energyRequiredKwh * pricePerKwh);

  // Estimated charging time based on charger power with 88% realistic AC/DC efficiency
  const effectivePowerKw = Math.max(1.0, chargerPowerKw * 0.88);
  const chargingTimeHoursTotal = energyRequiredKwh / effectivePowerKw;
  const hours = Math.floor(chargingTimeHoursTotal);
  const minutes = Math.round((chargingTimeHoursTotal - hours) * 60);

  // Comparison: Petrol cost for equivalent range
  // Avg EV efficiency: 4-wheeler = 7.5 km/kWh, 2-wheeler = 30 km/kWh
  const avgKmPerKwh = vehicleCategory === 'four_wheeler' ? 7.5 : 30;
  const rangeAddedKm = Math.round(energyRequiredKwh * avgKmPerKwh);
  // Petrol 4W avg: 14 km/L @ ₹102/L -> ₹7.3/km. Petrol 2W avg: 45 km/L @ ₹102/L -> ₹2.3/km
  const petrolCostPerKm = vehicleCategory === 'four_wheeler' ? 7.3 : 2.26;
  const equivalentPetrolCost = Math.round(rangeAddedKm * petrolCostPerKm);
  const savingsAmount = Math.max(0, equivalentPetrolCost - estimatedCost);
  const savingsPercent = equivalentPetrolCost > 0 ? Math.round((savingsAmount / equivalentPetrolCost) * 100) : 75;

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive EV Math Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Charging Cost & Time Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Estimate required energy, session cost, and charging duration for any electric vehicle in India.
          </p>
        </div>

        {/* Main 2-Column Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Step 1: Vehicle Category Switcher */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
                1. Select Vehicle Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('four_wheeler')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    vehicleCategory === 'four_wheeler'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>Electric Car (4W)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('two_wheeler')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    vehicleCategory === 'two_wheeler'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bike className="w-4 h-4 text-emerald-600" />
                  <span>Electric 2-Wheeler</span>
                </button>
              </div>
            </div>

            {/* Step 2: Presets Pills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Choose Vehicle Model
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomVehicle(!isCustomVehicle)}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  {isCustomVehicle ? 'Choose Preset' : '+ Custom Battery'}
                </button>
              </div>

              {!isCustomVehicle ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentPresets.map((preset, idx) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedPresetIndex === idx && !isCustomVehicle
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500/30'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{preset.batteryKwh} kWh Battery</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Custom Battery Pack Size (kWh)</label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    step="0.5"
                    value={batteryCapacityKwh}
                    onChange={(e) => setBatteryCapacityKwh(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold text-slate-900 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Step 3: Battery Sliders */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Current Battery Level</span>
                  <span className="text-slate-900 text-sm font-extrabold">{safeCurrent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="95"
                  value={safeCurrent}
                  onChange={(e) => setCurrentPercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Target Battery Level (Recommended 80-85% for battery life)</span>
                  <span className="text-emerald-700 text-sm font-extrabold">{targetPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={targetPercent}
                  onChange={(e) => setTargetPercent(Math.max(safeCurrent + 5, Number(e.target.value)))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Step 4: Charger Power & Price Slider */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 block">
                  Charger Power Output (kW)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { power: 3.3, label: '3.3 kW (15A)' },
                    { power: 7.2, label: '7.2 kW Wallbox' },
                    { power: 22.0, label: '22 kW AC Fast' },
                    { power: 50.0, label: '50 kW DC Rapid' },
                  ].map((p) => (
                    <button
                      key={p.power}
                      type="button"
                      onClick={() => setChargerPowerKw(p.power)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        chargerPowerKw === p.power
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.power} kW</div>
                      <div className="text-[10px] text-slate-500 truncate">{p.label.split('(')[1]?.replace(')', '') || 'AC'}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Station Price per kWh</span>
                  <span className="text-emerald-700 text-sm font-extrabold">{BRAND_CONFIG.currency}{pricePerKwh}/kWh</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="30"
                  step="1"
                  value={pricePerKwh}
                  onChange={(e) => setPricePerKwh(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Right Results Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-slate-800">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Estimated Summary
                </span>
                <span className="text-xs text-slate-300">
                  +{deltaPercent}% Battery Charge
                </span>
              </div>

              {/* Estimated Cost */}
              <div>
                <span className="text-xs text-slate-400 block font-medium">Estimated Charging Cost</span>
                <div className="text-4xl font-black text-emerald-400 tracking-tight mt-0.5">
                  {BRAND_CONFIG.currency}{estimatedCost.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-slate-400 block mt-1">
                  for {energyRequiredKwh} kWh at {BRAND_CONFIG.currency}{pricePerKwh}/kWh
                </span>
              </div>

              {/* Energy & Time Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 block font-medium">Energy Needed</span>
                  <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <span>{energyRequiredKwh} kWh</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 block font-medium">Est. Charging Time</span>
                  <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>
                      {hours > 0 ? `${hours}h ` : ''}{minutes}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Petrol Savings Comparison */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Equivalent Petrol Cost:</span>
                  </span>
                  <span className="line-through text-slate-400">{BRAND_CONFIG.currency}{equivalentPetrolCost}</span>
                </div>
                <div className="flex items-center justify-between text-white font-bold text-sm">
                  <span>Your Net Fuel Savings:</span>
                  <span className="text-emerald-400 font-extrabold">{BRAND_CONFIG.currency}{savingsAmount} ({savingsPercent}%)</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
                  Adds approximately ~{rangeAddedKm} km driving range.
                </div>
              </div>

              {/* Direct Link to Find Chargers */}
              <button
                type="button"
                onClick={() => onNavigate('find_chargers', { vehicleType: vehicleCategory })}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Find Chargers Matching This Spec</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

            {/* Realistic Engineering Disclaimer Note */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Technical Charging Note</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Actual charging time and speed may vary based on Battery Management System (BMS) thermal throttling, voltage fluctuations on local Indian power grids, and charging taper above 80% state-of-charge.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
