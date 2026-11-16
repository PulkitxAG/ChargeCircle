import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Car, 
  Home, 
  CheckCircle2, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../services/mockData';
import { setCurrentUser, getUsers } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = 'login'
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [role, setRole] = useState<UserRole>('driver');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState<'two_wheeler' | 'four_wheeler'>('four_wheeler');

  // Quick Persona Login
  const handleQuickLogin = (targetUser: User) => {
    setCurrentUser(targetUser);
    onSuccess(targetUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      // Find matching or create demo session
      const existing = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setCurrentUser(existing);
        onSuccess(existing);
      } else {
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0] || 'EV Driver',
          email,
          phone: phone || '+91 98000 00000',
          role: 'driver',
          memberSince: 'Just now'
        };
        setCurrentUser(newUser);
        onSuccess(newUser);
      }
    } else {
      // Sign Up
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name || 'EV Enthusiast',
        email,
        phone: phone || '+91 98000 00000',
        role,
        vehicleModel: role === 'driver' ? vehicleModel : undefined,
        vehicleType: role === 'driver' ? vehicleType : undefined,
        memberSince: 'Today'
      };
      setCurrentUser(newUser);
      onSuccess(newUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Background Gradient */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white relative">
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">ChargeCircle Auth</span>
          </div>

          <h2 className="text-xl font-bold">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join ChargeCircle'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {activeTab === 'login' 
              ? 'Sign in to manage your charging bookings or host earnings' 
              : 'Create an account to book chargers or list your EV port'}
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-white/10 rounded-xl mt-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              New Account
            </button>
          </div>
        </div>

        {/* Quick Persona Switcher for Evaluation */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100">
          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              1-Click Demo Evaluation Profiles
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin(INITIAL_USERS[0])}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <Car className="w-3 h-3 text-emerald-600" />
                <span>Driver</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">Ananya Sen</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(INITIAL_USERS[1])}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <Home className="w-3 h-3 text-emerald-600" />
                <span>Host</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">Rajesh Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(INITIAL_USERS[2])}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Admin</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">Super Admin</div>
            </button>
          </div>
        </div>

        {/* Regular Credentials Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'signup' && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">I want to join as</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'driver' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>EV Driver</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('host')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'host' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Charging Host</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {role === 'driver' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700">Vehicle Type</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVehicleType('four_wheeler')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                        vehicleType === 'four_wheeler' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Electric Car
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleType('two_wheeler')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                        vehicleType === 'two_wheeler' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Electric 2-Wheeler
                    </button>
                  </div>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="Vehicle model (e.g. Tata Nexon EV / Ather 450X)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{activeTab === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
