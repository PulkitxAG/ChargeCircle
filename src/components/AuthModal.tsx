import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Car, 
  Home, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  AlertCircle,
  Database,
  Loader2
} from 'lucide-react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../services/mockData';
import { setCurrentUser } from '../services/storage';
import { isSupabaseConfigured } from '../services/supabase';
import { signInUser, signUpUser, signInWithGoogle } from '../services/authService';

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
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Quick Persona Login for Viva / Project Evaluation
  const handleQuickLogin = (targetUser: User) => {
    setCurrentUser(targetUser);
    onSuccess(targetUser);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const { user, error } = await signInUser(email, password);
        if (error) {
          setErrorMessage(error);
          setIsLoading(false);
          return;
        }
        if (user) {
          onSuccess(user);
          onClose();
        }
      } else {
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }

        const { user, error, message } = await signUpUser(email, password, {
          name: name.trim() || 'EV Member',
          email: email.trim(),
          phone: phone.trim() || '+91 98000 00000',
          role,
          vehicleModel: role === 'driver' ? vehicleModel : undefined,
          vehicleType: role === 'driver' ? vehicleType : undefined,
        });

        if (error) {
          setErrorMessage(error);
          setIsLoading(false);
          return;
        }

        if (message) {
          setInfoMessage(message);
          setActiveTab('login');
          setIsLoading(false);
          return;
        }

        if (user) {
          onSuccess(user);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Compact Pinned Header with Background Gradient */}
        <div className="px-5 py-4 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white relative shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">ChargeCircle Auth</span>
            </div>

            {/* Database Status Badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/10 backdrop-blur-xs border border-white/15">
              <Database className="w-2.5 h-2.5 text-emerald-400" />
              <span className={isSupabaseConfigured ? "text-emerald-300" : "text-amber-300"}>
                {isSupabaseConfigured ? "Supabase SQL" : "Local Database"}
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold leading-tight">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join ChargeCircle'}
          </h2>
          <p className="text-[11px] text-slate-300 mt-0.5">
            {activeTab === 'login' 
              ? 'Sign in to access your bookings, earnings, and saved bays' 
              : 'Create an account to book chargers or list your EV port'}
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-0.5 bg-white/10 rounded-lg mt-2.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`py-1 rounded-md transition-all ${
                activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
              }}
              className={`py-1 rounded-md transition-all ${
                activeTab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              New Account
            </button>
          </div>
        </div>

        {/* Form Container with Scrollable Body and Pinned Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-2.5">
            
            {/* Quick Persona Switcher for Evaluation (Shown on Login Tab) */}
            {activeTab === 'login' && (
              <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    1-Click Demo Evaluation Profiles
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(INITIAL_USERS[0])}
                    className="p-1.5 px-2 rounded-lg bg-white border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                      <Car className="w-3 h-3 text-emerald-600" />
                      <span>Driver Demo</span>
                    </div>
                    <div className="text-[9px] text-slate-500 truncate">Ananya Sen (Driver)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin(INITIAL_USERS[1])}
                    className="p-1.5 px-2 rounded-lg bg-white border border-emerald-200 text-left hover:border-emerald-500 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                      <Home className="w-3 h-3 text-emerald-600" />
                      <span>Host Demo</span>
                    </div>
                    <div className="text-[9px] text-slate-500 truncate">Rajesh Sharma (Host)</div>
                  </button>
                </div>
              </div>
            )}

            {/* Success / Verification Info Banner */}
            {infoMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-800 animate-in fade-in duration-150">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  {errorMessage.includes('already registered') && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setErrorMessage(null);
                      }}
                      className="block mt-1 font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer text-[11px]"
                    >
                      Click here to Sign In →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Continue with Google */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.99]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-wider">
                  <span className="bg-white px-2 text-slate-400">or with email</span>
                </div>
              </div>
            </div>

            {/* Regular Credentials Form Fields */}
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('driver')}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Pulkit Agrawal"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {role === 'driver' && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-700">Vehicle Type</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVehicleType('four_wheeler')}
                        className={`py-1 px-2 rounded-md text-xs font-semibold border ${
                          vehicleType === 'four_wheeler' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        Electric Car
                      </button>
                      <button
                        type="button"
                        onClick={() => setVehicleType('two_wheeler')}
                        className={`py-1 px-2 rounded-md text-xs font-semibold border ${
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
                      className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Quick helper link on Signup */}
            {activeTab === 'signup' && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[11px] text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  Already evaluating? <span className="font-semibold text-emerald-700 underline">Switch to 1-Click Demo Profiles</span>
                </button>
              </div>
            )}

          </div>

          {/* Pinned Action Footer (Always Visible & Never Cut Off) */}
          <div className="shrink-0 p-3 sm:p-3.5 px-4 sm:px-5 border-t border-slate-100 bg-slate-50/90 backdrop-blur-xs">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeTab === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
