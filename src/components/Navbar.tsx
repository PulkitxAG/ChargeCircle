import React, { useState } from 'react';
import { 
  Zap, 
  Menu, 
  X, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  Calendar,
  Layers,
  ChevronDown,
  ArrowRightLeft
} from 'lucide-react';
import { User, UserRole } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { switchUserRole, isAuthorizedAdmin, isUserLoggedIn } from '../services/storage';
import { signOutUser } from '../services/authService';

interface NavbarProps {
  currentUser: User;
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  onOpenAuth: (tab?: 'login' | 'signup') => void;
  onUserChange: (user: User) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onNavigate,
  currentPage,
  onOpenAuth,
  onUserChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isLoggedIn = isUserLoggedIn(currentUser);
  const canAccessAdmin = isAuthorizedAdmin(currentUser);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await signOutUser();
    onNavigate('home');
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const updated = switchUserRole(newRole);
    onUserChange(updated);
    setIsProfileDropdownOpen(false);
    
    if (newRole === 'host') {
      onNavigate('host_dashboard');
    } else if (newRole === 'admin') {
      onNavigate('admin_dashboard');
    } else {
      onNavigate('my_bookings');
    }
  };

  const navLinks = [
    { id: 'find_chargers', label: 'Find Chargers' },
    { id: 'site_partnerships', label: 'Co-Host / Partner' },
    { id: 'become_host', label: 'Become a Host' },
    { id: 'calculator', label: 'Cost Calculator' },
    { id: 'how_it_works', label: 'How It Works' },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
            Admin
          </span>
        );
      case 'host':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Host
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Driver
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      
      {/* Main Navbar Container — w-full with generous side padding to position logo on the left */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo — Shifted clean to the Left */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {BRAND_CONFIG.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                EV Network India
              </span>
            </div>
          </div>

          {/* Desktop Nav Links — Centered and spacious */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 font-bold shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            
            {/* When Logged In */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                
                {/* Admin Panel Button (ONLY for Pulkit) */}
                {canAccessAdmin && (
                  <button
                    type="button"
                    onClick={() => onNavigate('admin_dashboard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs ${
                      currentPage === 'admin_dashboard'
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-purple-200 bg-purple-50/50 text-purple-700 hover:bg-purple-100/70'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin Panel</span>
                  </button>
                )}

                {/* Role Switcher Pill: Driver vs Host */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('driver')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      currentUser.role === 'driver'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Driver
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('host')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      currentUser.role === 'host'
                        ? 'bg-white text-amber-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Host
                  </button>
                </div>

                {/* Profile Avatar & Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-xs"
                  >
                    <img 
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                      alt={currentUser.name} 
                      className="w-7 h-7 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {getRoleBadge(currentUser.role)}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onNavigate('my_bookings');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>My Bookings</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onNavigate('host_dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>Host Dashboard</span>
                        </button>

                        {canAccessAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              onNavigate('admin_dashboard');
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Admin Command Center</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* When NOT Logged In: Clean Sign In & Register Buttons */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
                >
                  Register
                </button>
              </div>
            )}

            {/* Direct CTA Button: Find Charger */}
            <button
              type="button"
              onClick={() => onNavigate('find_chargers')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Find Charger</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('find_chargers')}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold"
              title="Find Chargers"
            >
              <Zap className="w-4 h-4 fill-emerald-600" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Clean Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-4 duration-200">
          
          {/* User Status in Drawer */}
          {isLoggedIn ? (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                  alt="" 
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200" 
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{currentUser.email}</p>
                </div>
              </div>
              <div>{getRoleBadge(currentUser.role)}</div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Welcome to ChargeCircle</p>
                <p className="text-[10px] text-slate-500">Sign in to book or host bays</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mode Switcher in Mobile Drawer if logged in */}
          {isLoggedIn && (
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleSwitch('driver')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                  currentUser.role === 'driver' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Driver Mode
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch('host')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                  currentUser.role === 'host' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Host Mode
              </button>
            </div>
          )}

          {/* Nav Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate(link.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  currentPage === link.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Dashboard links in Mobile Drawer */}
          {isLoggedIn && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('my_bookings');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>My Bookings</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('host_dashboard');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50"
              >
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Host Dashboard</span>
              </button>
              {canAccessAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('admin_dashboard');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 flex items-center gap-2 hover:bg-purple-50"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs text-center shadow-xs"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs text-center"
              >
                Register
              </button>
            </div>
          )}

        </div>
      )}

    </header>
  );
};
