import React, { useState, useEffect } from 'react';
import { 
  Charger, 
  User, 
  Booking, 
  Review 
} from './types';
import { 
  initializeStorage, 
  subscribeToStorage, 
  getChargers, 
  getCurrentUser, 
  setCurrentUser as setStoredCurrentUser,
  getBookings 
} from './services/storage';
import { supabase, isSupabaseConfigured } from './services/supabase';

// Navigation Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Modals
import { BookingModal } from './components/BookingModal';
import { ReviewModal } from './components/ReviewModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { FindChargersPage } from './pages/FindChargersPage';
import { ChargerDetailPage } from './pages/ChargerDetailPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ChargeExplorePage } from './pages/ChargeExplorePage';
import { BecomeHostPage } from './pages/BecomeHostPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SitePartnershipsPage } from './pages/SitePartnershipsPage';

export function App() {
  // Initialize storage once
  useEffect(() => {
    initializeStorage();
  }, []);

  // Reactive State
  const [chargers, setChargers] = useState<Charger[]>(() => getChargers());
  const [currentUser, setCurrentUser] = useState<User>(() => getCurrentUser());
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      setChargers(getChargers());
      setCurrentUser(getCurrentUser());
      setDataVersion(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Listen to Supabase OAuth (e.g. Google Sign In) redirects
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        const u = session.user;
        const meta = u.user_metadata || {};

        const googleUser: User = {
          id: u.id,
          name: meta.full_name || meta.name || u.email?.split('@')[0] || 'EV Member',
          email: u.email || '',
          phone: meta.phone || '',
          role: (meta.role as any) || 'driver',
          avatar: meta.avatar_url || meta.picture || undefined,
          memberSince: 'Today',
        };

        setStoredCurrentUser(googleUser);
        setCurrentUser(googleUser);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Routing / View State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  // Active Charger & Active Booking
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingTargetCharger, setBookingTargetCharger] = useState<Charger | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewTargetCharger, setReviewTargetCharger] = useState<any>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  // Navigation handler
  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);

    if (params.chargerId) {
      const found = chargers.find(c => c.id === params.chargerId);
      if (found) setSelectedCharger(found);
    }

    if (params.bookingId) {
      const allB = getBookings();
      const foundB = allB.find(b => b.id === params.bookingId);
      if (foundB) setActiveBooking(foundB);
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct Book Handler
  const handleBookCharger = (charger: Charger) => {
    setBookingTargetCharger(charger);
    setIsBookingModalOpen(true);
  };

  // View Details Handler
  const handleViewDetails = (charger: Charger) => {
    setSelectedCharger(charger);
    handleNavigate('charger_detail', { chargerId: charger.id });
  };

  // On Booking Success
  const handleBookingSuccess = (booking: Booking) => {
    setIsBookingModalOpen(false);
    setActiveBooking(booking);
    handleNavigate('booking_confirmation', { bookingId: booking.id });
  };

  // Open Review Modal
  const handleOpenReview = (charger: any) => {
    setReviewTargetCharger(charger);
    setIsReviewModalOpen(true);
  };

  // Open Auth Modal
  const handleOpenAuth = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // Render Page Content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            chargers={chargers}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onSelectCharger={setSelectedCharger}
            onBookCharger={handleBookCharger}
          />
        );

      case 'find_chargers':
        return (
          <FindChargersPage
            chargers={chargers}
            initialFilters={pageParams}
            onSelectCharger={setSelectedCharger}
            onBookCharger={handleBookCharger}
            onViewDetails={handleViewDetails}
          />
        );

      case 'charger_detail':
        if (!selectedCharger) {
          const fallback = chargers[0];
          return fallback ? (
            <ChargerDetailPage
              charger={fallback}
              currentUser={currentUser}
              onBack={() => handleNavigate('find_chargers')}
              onBook={handleBookCharger}
              onOpenReviewModal={handleOpenReview}
            />
          ) : null;
        }
        return (
          <ChargerDetailPage
            charger={selectedCharger}
            currentUser={currentUser}
            onBack={() => handleNavigate('find_chargers')}
            onBook={handleBookCharger}
            onOpenReviewModal={handleOpenReview}
          />
        );

      case 'booking_confirmation':
        if (!activeBooking) {
          const allB = getBookings();
          const fallbackB = allB[0];
          return fallbackB ? (
            <BookingConfirmationPage
              booking={fallbackB}
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onUpdateBooking={() => setDataVersion(v => v + 1)}
            />
          ) : null;
        }
        return (
          <BookingConfirmationPage
            booking={activeBooking}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onUpdateBooking={() => setDataVersion(v => v + 1)}
          />
        );

      case 'my_bookings':
        return (
          <MyBookingsPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onViewBookingDetails={(booking) => {
              setActiveBooking(booking);
              handleNavigate('booking_confirmation', { bookingId: booking.id });
            }}
            onOpenReviewModal={handleOpenReview}
          />
        );

      case 'calculator':
        return <CalculatorPage onNavigate={handleNavigate} />;

      case 'charge_explore':
        return (
          <ChargeExplorePage
            onBookCharger={handleBookCharger}
            onNavigate={handleNavigate}
          />
        );

      case 'become_host':
        return (
          <BecomeHostPage
            defaultTab={pageParams.defaultTab || 'have_charger'}
            onNavigate={handleNavigate}
            onChargerAdded={() => {
              setChargers(getChargers());
              handleNavigate('host_dashboard');
            }}
          />
        );

      case 'host_dashboard':
        return (
          <HostDashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onEditCharger={handleViewDetails}
          />
        );

      case 'admin_dashboard':
        return (
          <AdminDashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onDataRefresh={() => setDataVersion(v => v + 1)}
          />
        );

      case 'how_it_works':
        return <HowItWorksPage onNavigate={handleNavigate} />;

      case 'site_partnerships':
        return (
          <SitePartnershipsPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );

      default:
        return (
          <HomePage
            chargers={chargers}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onSelectCharger={setSelectedCharger}
            onBookCharger={handleBookCharger}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onOpenAuth={handleOpenAuth}
        onUserChange={setCurrentUser}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Booking Modal */}
      {isBookingModalOpen && bookingTargetCharger && (
        <BookingModal
          charger={bookingTargetCharger}
          currentUser={currentUser}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Review Modal */}
      {isReviewModalOpen && reviewTargetCharger && (
        <ReviewModal
          charger={reviewTargetCharger}
          currentUser={currentUser}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            setChargers(getChargers());
          }}
        />
      )}

      {/* Auth / Persona Switcher Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(u) => {
            setCurrentUser(u);
            setIsAuthModalOpen(false);
          }}
          defaultTab={authModalTab}
        />
      )}

    </div>
  );
}

export default App;
