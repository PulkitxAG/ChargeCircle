import React, { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Menu, 
  X, 
  User as UserIcon, 
  ChevronDown, 
  Car, 
  Home, 
  ShieldCheck, 
  Calculator, 
  Coffee, 
  Calendar, 
  Layers, 
  LogOut,
  Sparkles,
  ArrowRight
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
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const isLoggedIn = isUserLoggedIn(currentUser);
  const isCustomUser = isLoggedIn && !['user_driver_1', 'user_host_1', 'user_admin_1'].includes(currentUser.id);
  const canAccessAdmin = isAuthorizedAdmin(currentUser);

  const handleLogout = async () => {
    setIsRoleDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await signOutUser();
    onNavigate('home');
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const updated = switchUserRole(newRole);
    onUserChange(updated);
    setIsRoleDropdownOpen(false);
    
    // Role-specific landing redirect if on dashboards
    if (newRole === 'host') {
      onNavigate('host_dashboard');
    } else if (newRole === 'admin') {
      onNavigate('admin_dashboard');
    } else {
      onNavigate('my_bookings');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'find_chargers', label: 'Find Chargers' },
    { id: 'how_it_works', label: 'How It Works' },
    { id: 'charge_explore', label: 'Charge + Explore' },
    { id: 'calculator', label: 'Cost Calculator' },
    { id: 'site_partnerships', label: 'Co-Host / Partner' },
    { id: 'become_host', label: 'Become a Host' },
    { id: 'install_charger', label: 'Install a Charger' },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* Top Interactive Evaluation Persona Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoggedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            {isLoggedIn ? (
              isCustomUser ? (
                <span className="text-slate-300">
                  Signed In: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email}) · <span className="text-emerald-400 font-bold uppercase">{currentUser.role} Mode</span>
                </span>
              ) : (
                <span className="text-slate-300">
                  Evaluation Demo: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
                </span>
              )
            ) : (
              <span className="text-slate-300">
                Browsing as <strong className="text-white">Guest</strong> · Sign in to manage bookings & host bays
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden sm:inline">
              {isLoggedIn ? (isCustomUser ? 'Switch Mode:' : 'Switch Persona:') : 'Test Personas:'}
            </span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => handleRoleSwitch('driver')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                  currentUser.role === 'driver' && isLoggedIn ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title={isCustomUser ? `Switch ${currentUser.name} to Driver Mode` : 'Switch to Demo Driver Persona (Ananya)'}
              >
                Driver View
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch('host')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                  currentUser.role === 'host' && isLoggedIn ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title={isCustomUser ? `Switch ${currentUser.name} to Host Mode` : 'Switch to Demo Host Persona (Rajesh)'}
              >
                Host View
              </button>
              {canAccessAdmin && (
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('admin')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                    currentUser.role === 'admin' && isLoggedIn ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title={isCustomUser ? `Switch ${currentUser.name} to Admin Mode` : 'Switch to Demo Admin Persona'}
                >
                  Admin View
                </button>
              )}
            </div>

            {/* Top Bar Action: Log Out when logged in, or Sign In when not logged in */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-600/40 flex items-center gap-1 transition-all ml-1 shadow-2xs"
                title="Sign out of current account"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 transition-all ml-1 shadow-xs"
              >
                <UserIcon className="w-3 h-3" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {BRAND_CONFIG.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase block -mt-1">
                EV Marketplace India
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id || (link.id === 'install_charger' && currentPage === 'become_host');
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    if (link.id === 'install_charger') {
                      onNavigate('become_host', { defaultTab: 'install' });
                    } else {
                      onNavigate(link.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden sm:flex items-center gap-2.5">
            
            {/* When Logged In: Show Role Short-cut and Profile Dropdown with Log Out */}
            {isLoggedIn ? (
              <>
                {/* Quick Link to Current Role's Main Area */}
                {currentUser.role === 'driver' && (
                  <button
                    type="button"
                    onClick={() => onNavigate('my_bookings')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      currentPage === 'my_bookings'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>My Bookings</span>
                  </button>
                )}

                {currentUser.role === 'host' && (
                  <button
                    type="button"
                    onClick={() => onNavigate('host_dashboard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      currentPage === 'host_dashboard'
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Host Dashboard</span>
                  </button>
                )}

                {currentUser.role === 'admin' && canAccessAdmin && (
                  <button
                    type="button"
                    onClick={() => onNavigate('admin_dashboard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      currentPage === 'admin_dashboard'
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin Panel</span>
                  </button>
                )}

                {/* User Profile / Role Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50 transition-all text-left shadow-xs"
                    title="Account Settings"
                  >
                    <img 
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                      alt={currentUser.name} 
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div className="hidden md:block">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1 flex items-center gap-1">
                        <span>{currentUser.name.split(' ')[0]}</span>
                        {getRoleBadge(currentUser.role)}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isRoleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {getRoleBadge(currentUser.role)}
                          <span className="text-[10px] text-slate-400">Active</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleDropdownOpen(false);
                            onNavigate('my_bookings');
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>My Bookings</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleDropdownOpen(false);
                            onNavigate('host_dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>Host Dashboard</span>
                        </button>
                        {canAccessAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsRoleDropdownOpen(false);
                              onNavigate('admin_dashboard');
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                      </div>

                      {/* Log Out Option in Dropdown */}
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
              </>
            ) : (
              /* When NOT Logged In: Show Clear Sign In and Register CTAs */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Register
                </button>
              </div>
            )}

            {/* Direct CTA: Find Charger */}
            <button
              type="button"
              onClick={() => onNavigate('find_chargers')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Find Charger</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('find_chargers')}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold"
            >
              <Zap className="w-4 h-4 fill-emerald-600" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-4 duration-200">
          
          {/* User Header in Drawer */}
          {isLoggedIn ? (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                  alt="" 
                  className="w-8 h-8 rounded-lg object-cover" 
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <div className="flex items-center gap-1">
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-bold text-slate-900">Welcome, Guest</p>
              <p className="text-[10px] text-slate-500">Sign in to book chargers or list EV bays</p>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (link.id === 'install_charger') {
                    onNavigate('become_host', { defaultTab: 'install' });
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  currentPage === link.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('my_bookings');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2"
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
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2"
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
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2"
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
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center shadow-xs"
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
        </div>
      )}

    </header>
  );
};
