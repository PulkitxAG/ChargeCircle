import {
  Charger,
  User,
  Booking,
  BusinessOffer,
  Review,
  InstallationRequest,
  SitePartnershipListing,
  PartnershipProposal,
  UserRole,
  VerificationStatus
} from '../types';
import {
  INITIAL_CHARGERS,
  INITIAL_USERS,
  INITIAL_BOOKINGS,
  INITIAL_BUSINESS_OFFERS,
  INITIAL_INSTALLATION_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_SITE_PARTNERSHIPS,
  INITIAL_PARTNERSHIP_PROPOSALS
} from './mockData';
import { BRAND_CONFIG } from '../config/brand';

const STORAGE_KEYS = {
  CHARGERS: 'chargecircle_chargers_v1',
  USERS: 'chargecircle_users_v1',
  CURRENT_USER: 'chargecircle_current_user_v1',
  BOOKINGS: 'chargecircle_bookings_v1',
  OFFERS: 'chargecircle_offers_v1',
  INSTALLATIONS: 'chargecircle_installations_v1',
  REVIEWS: 'chargecircle_reviews_v1',
  COMMISSION_RATE: 'chargecircle_commission_rate_v1',
  SITE_PARTNERSHIPS: 'chargecircle_site_partnerships_v1',
  PARTNERSHIP_PROPOSALS: 'chargecircle_partnership_proposals_v1',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToStorage = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => fn());
};

// Safe JSON get/set
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    const parsed = JSON.parse(item);
    // If defaultValue is a non-empty array (e.g. chargers) but parsed array is empty, restore default data
    if (Array.isArray(defaultValue) && defaultValue.length > 0 && Array.isArray(parsed) && parsed.length === 0) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Initialize default storage data if not present
export const initializeStorage = () => {
  getStored(STORAGE_KEYS.CHARGERS, INITIAL_CHARGERS);
  getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  getStored(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // Default to Driver Ananya Sen
  getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  getStored(STORAGE_KEYS.OFFERS, INITIAL_BUSINESS_OFFERS);
  getStored(STORAGE_KEYS.INSTALLATIONS, INITIAL_INSTALLATION_REQUESTS);
  getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  getStored(STORAGE_KEYS.COMMISSION_RATE, BRAND_CONFIG.defaultCommissionRate);
  getStored(STORAGE_KEYS.SITE_PARTNERSHIPS, INITIAL_SITE_PARTNERSHIPS);
  getStored(STORAGE_KEYS.PARTNERSHIP_PROPOSALS, INITIAL_PARTNERSHIP_PROPOSALS);
};

// --- Commission Settings ---
export const getCommissionRate = (): number => {
  return getStored<number>(STORAGE_KEYS.COMMISSION_RATE, BRAND_CONFIG.defaultCommissionRate);
};

export const updateCommissionRate = (rate: number): void => {
  setStored(STORAGE_KEYS.COMMISSION_RATE, rate);
};

// --- Users & Auth ---
export const getUsers = (): User[] => {
  return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
};

export const saveUsers = (users: User[]): void => {
  setStored(STORAGE_KEYS.USERS, users);
};

export const getCurrentUser = (): User => {
  return getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
};

export const setCurrentUser = (user: User): void => {
  setStored(STORAGE_KEYS.CURRENT_USER, user);
};

export const ADMIN_EMAILS = [
  'pulkitagrawal089@gmail.com',
  'admin@chargecircle.in'
];

export const isAuthorizedAdmin = (user?: User | null): boolean => {
  if (!user || !user.email) return false;
  const cleanEmail = user.email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(cleanEmail) || user.id === 'user_admin_1';
};

export const switchUserRole = (role: UserRole): User => {
  const current = getCurrentUser();

  // Security guard: Admin view is strictly restricted to Pulkit / authorized admin emails
  if (role === 'admin' && !isAuthorizedAdmin(current)) {
    return current;
  }

  const demoIds = ['user_driver_1', 'user_host_1', 'user_admin_1'];
  const isCustomUser = !demoIds.includes(current.id);

  if (isCustomUser) {
    // Keep user's email, name, and personal identity intact! Just update their active role
    const updatedUser: User = {
      ...current,
      role,
    };
    setCurrentUser(updatedUser);

    // Persist in users list
    const users = getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      saveUsers(users);
    } else {
      saveUsers([...users, updatedUser]);
    }
    return updatedUser;
  }

  // For evaluation demo personas, switch between the pre-seeded demo accounts
  const users = getUsers();
  let target = users.find(u => u.role === role);
  if (!target) {
    target = INITIAL_USERS.find(u => u.role === role) || {
      id: `user_${role}_${Date.now()}`,
      name: role === 'driver' ? 'Ananya Sen (Driver)' : role === 'host' ? 'Rajesh Kumar (Host)' : 'Priya Sharma (Admin)',
      email: `${role}@chargecircle.in`,
      phone: '+91 98000 00000',
      role,
      memberSince: '2024'
    };
  }
  setCurrentUser(target);
  return target;
};

// --- Chargers ---
export const getChargers = (): Charger[] => {
  return getStored<Charger[]>(STORAGE_KEYS.CHARGERS, INITIAL_CHARGERS);
};

export const getChargerById = (id: string): Charger | undefined => {
  const chargers = getChargers();
  return chargers.find(c => c.id === id);
};

export const addCharger = (chargerData: Omit<Charger, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Charger => {
  const chargers = getChargers();
  const newCharger: Charger = {
    ...chargerData,
    id: `ch_custom_${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewCount: 0,
    // By prompt requirement: Do NOT automatically mark as verified!
    verificationStatus: 'pending',
    verificationBadges: {
      identity: true,
      propertyAuthority: false,
      electricalSafety: false,
      compatibility: false
    }
  };
  setStored(STORAGE_KEYS.CHARGERS, [newCharger, ...chargers]);
  return newCharger;
};

export const updateCharger = (updated: Charger): void => {
  const chargers = getChargers();
  const index = chargers.findIndex(c => c.id === updated.id);
  if (index !== -1) {
    chargers[index] = updated;
    setStored(STORAGE_KEYS.CHARGERS, [...chargers]);
  }
};

export const updateChargerVerification = (
  chargerId: string,
  status: VerificationStatus,
  badges?: Partial<Charger['verificationBadges']>
): void => {
  const chargers = getChargers();
  const index = chargers.findIndex(c => c.id === chargerId);
  if (index !== -1) {
    chargers[index].verificationStatus = status;
    if (badges) {
      chargers[index].verificationBadges = {
        ...chargers[index].verificationBadges,
        ...badges
      };
    }
    if (status === 'verified') {
      chargers[index].verificationBadges = {
        identity: true,
        propertyAuthority: true,
        electricalSafety: true,
        compatibility: true
      };
    }
    setStored(STORAGE_KEYS.CHARGERS, [...chargers]);
  }
};

// --- Bookings ---
export const getBookings = (): Booking[] => {
  return getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
};

export const getBookingById = (id: string): Booking | undefined => {
  const bookings = getBookings();
  return bookings.find(b => b.id === id || b.bookingCode === id);
};

export const createBooking = (
  bookingParams: {
    charger: Charger;
    driver: User;
    bookingDate: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    connectorType: Charger['connectorTypes'][0];
    driverVehicleModel: string;
    driverVehiclePlate: string;
    driverVehicleType: 'two_wheeler' | 'four_wheeler';
    notes?: string;
  }
): Booking => {
  const {
    charger,
    driver,
    bookingDate,
    startTime,
    endTime,
    durationHours,
    connectorType,
    driverVehicleModel,
    driverVehiclePlate,
    driverVehicleType,
    notes
  } = bookingParams;

  const commissionRate = getCommissionRate();
  // Estimated energy = power rating * duration * 0.85 typical duty factor
  const energyEstimatedKwh = Math.round(charger.powerRatingKw * durationHours * 0.85 * 10) / 10;
  const baseCost = Math.round(energyEstimatedKwh * charger.pricingPerKwh);
  const platformFee = Math.round(baseCost * commissionRate * 100) / 100;
  const gstAmount = Math.round(platformFee * BRAND_CONFIG.gstRate * 100) / 100;
  const totalAmount = Math.round((baseCost + platformFee + gstAmount) * 100) / 100;
  const hostPayout = Math.round((baseCost - platformFee) * 100) / 100;

  const newBooking: Booking = {
    id: `bkg_${Date.now()}`,
    bookingCode: `CC-BKG-${Math.floor(1000 + Math.random() * 9000)}`,
    chargerId: charger.id,
    chargerName: charger.name,
    chargerAddress: charger.address,
    chargerImage: charger.images[0] || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    powerRatingKw: charger.powerRatingKw,
    connectorType,
    hostId: charger.hostId,
    hostName: charger.hostName,
    hostPhone: charger.hostPhone,
    driverId: driver.id,
    driverName: driver.name,
    driverPhone: driver.phone,
    driverVehicleModel,
    driverVehiclePlate,
    driverVehicleType,
    bookingDate,
    startTime,
    endTime,
    durationHours,
    energyEstimatedKwh,
    pricePerKwh: charger.pricingPerKwh,
    baseCost,
    platformCommissionRate: commissionRate,
    platformFee,
    gstAmount,
    totalAmount,
    hostPayout,
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    transactionId: `TXN_UPI_${Math.floor(10000000 + Math.random() * 90000000)}`,
    createdAt: new Date().toISOString(),
    notes
  };

  const currentBookings = getBookings();
  setStored(STORAGE_KEYS.BOOKINGS, [newBooking, ...currentBookings]);
  return newBooking;
};

export const cancelBooking = (bookingId: string, reason?: string): boolean => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index].bookingStatus = 'cancelled';
    bookings[index].paymentStatus = 'refunded';
    if (reason) bookings[index].notes = `${bookings[index].notes ? bookings[index].notes + ' | ' : ''}Cancelled: ${reason}`;
    setStored(STORAGE_KEYS.BOOKINGS, [...bookings]);
    return true;
  }
  return false;
};

export const updateBookingStatus = (bookingId: string, status: Booking['bookingStatus']): void => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index].bookingStatus = status;
    setStored(STORAGE_KEYS.BOOKINGS, [...bookings]);
  }
};

// Check if a slot is already booked for this charger
export const isSlotDoubleBooked = (chargerId: string, date: string, startTime: string): boolean => {
  const bookings = getBookings();
  return bookings.some(b => 
    b.chargerId === chargerId &&
    b.bookingDate === date &&
    b.startTime === startTime &&
    b.bookingStatus !== 'cancelled'
  );
};

// --- Installation Requests ---
export const getInstallationRequests = (): InstallationRequest[] => {
  return getStored<InstallationRequest[]>(STORAGE_KEYS.INSTALLATIONS, INITIAL_INSTALLATION_REQUESTS);
};

export const addInstallationRequest = (
  data: Omit<InstallationRequest, 'id' | 'requestCode' | 'status' | 'createdAt'>
): InstallationRequest => {
  const requests = getInstallationRequests();
  const newRequest: InstallationRequest = {
    ...data,
    id: `ins_${Date.now()}`,
    requestCode: `CC-INS-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'submitted',
    createdAt: new Date().toISOString().split('T')[0]
  };
  setStored(STORAGE_KEYS.INSTALLATIONS, [newRequest, ...requests]);
  return newRequest;
};

export const updateInstallationStatus = (
  id: string,
  status: InstallationRequest['status'],
  partnerAssigned?: string,
  notes?: string
): void => {
  const requests = getInstallationRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = status;
    if (partnerAssigned) requests[index].partnerAssigned = partnerAssigned;
    if (notes) requests[index].notes = notes;
    setStored(STORAGE_KEYS.INSTALLATIONS, [...requests]);
  }
};

// --- Business Offers ---
export const getBusinessOffers = (): BusinessOffer[] => {
  return getStored<BusinessOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_BUSINESS_OFFERS);
};

// --- Reviews ---
export const getReviews = (chargerId?: string): Review[] => {
  const all = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  if (chargerId) {
    return all.filter(r => r.chargerId === chargerId);
  }
  return all;
};

export const addReview = (reviewData: Omit<Review, 'id' | 'date'>): Review => {
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const newReview: Review = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };
  const updatedReviews = [newReview, ...reviews];
  setStored(STORAGE_KEYS.REVIEWS, updatedReviews);

  // Recalculate charger rating
  const chargers = getChargers();
  const cIndex = chargers.findIndex(c => c.id === reviewData.chargerId);
  if (cIndex !== -1) {
    const chargerReviews = updatedReviews.filter(r => r.chargerId === reviewData.chargerId);
    const avg = chargerReviews.reduce((sum, r) => sum + r.rating, 0) / chargerReviews.length;
    chargers[cIndex].rating = Math.round(avg * 10) / 10;
    chargers[cIndex].reviewCount = chargerReviews.length;
    setStored(STORAGE_KEYS.CHARGERS, [...chargers]);
  }

  return newReview;
};

// --- Site Partnerships (Property Owners & Hardware Investors) ---
export const getSitePartnerships = (): SitePartnershipListing[] => {
  return getStored<SitePartnershipListing[]>(STORAGE_KEYS.SITE_PARTNERSHIPS, INITIAL_SITE_PARTNERSHIPS);
};

export const addSitePartnership = (
  listingData: Omit<SitePartnershipListing, 'id' | 'createdAt' | 'proposalsCount' | 'status'>
): SitePartnershipListing => {
  const listings = getStored<SitePartnershipListing[]>(STORAGE_KEYS.SITE_PARTNERSHIPS, INITIAL_SITE_PARTNERSHIPS);
  const newListing: SitePartnershipListing = {
    ...listingData,
    id: `site_${Date.now()}`,
    status: 'open_for_partners',
    proposalsCount: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  setStored(STORAGE_KEYS.SITE_PARTNERSHIPS, [newListing, ...listings]);
  return newListing;
};

export const updateSitePartnership = (id: string, updates: Partial<SitePartnershipListing>): void => {
  const listings = getStored<SitePartnershipListing[]>(STORAGE_KEYS.SITE_PARTNERSHIPS, INITIAL_SITE_PARTNERSHIPS);
  const index = listings.findIndex(l => l.id === id);
  if (index !== -1) {
    listings[index] = { ...listings[index], ...updates };
    setStored(STORAGE_KEYS.SITE_PARTNERSHIPS, [...listings]);
  }
};

// --- Partnership Proposals ---
export const getPartnershipProposals = (siteListingId?: string, propertyOwnerId?: string): PartnershipProposal[] => {
  const proposals = getStored<PartnershipProposal[]>(STORAGE_KEYS.PARTNERSHIP_PROPOSALS, INITIAL_PARTNERSHIP_PROPOSALS);
  if (siteListingId) {
    return proposals.filter(p => p.siteListingId === siteListingId);
  }
  if (propertyOwnerId) {
    return proposals.filter(p => p.propertyOwnerId === propertyOwnerId);
  }
  return proposals;
};

export const addPartnershipProposal = (
  proposalData: Omit<PartnershipProposal, 'id' | 'createdAt' | 'status'>
): PartnershipProposal => {
  const proposals = getStored<PartnershipProposal[]>(STORAGE_KEYS.PARTNERSHIP_PROPOSALS, INITIAL_PARTNERSHIP_PROPOSALS);
  const newProposal: PartnershipProposal = {
    ...proposalData,
    id: `prop_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  setStored(STORAGE_KEYS.PARTNERSHIP_PROPOSALS, [newProposal, ...proposals]);

  // Increment proposal count on the site listing
  const listings = getSitePartnerships();
  const sIndex = listings.findIndex(l => l.id === proposalData.siteListingId);
  if (sIndex !== -1) {
    listings[sIndex].proposalsCount = (listings[sIndex].proposalsCount || 0) + 1;
    if (listings[sIndex].status === 'open_for_partners') {
      listings[sIndex].status = 'proposal_received';
    }
    setStored(STORAGE_KEYS.SITE_PARTNERSHIPS, [...listings]);
  }

  return newProposal;
};

export const updateProposalStatus = (
  id: string,
  status: 'pending' | 'accepted' | 'declined' | 'negotiating'
): void => {
  const proposals = getStored<PartnershipProposal[]>(STORAGE_KEYS.PARTNERSHIP_PROPOSALS, INITIAL_PARTNERSHIP_PROPOSALS);
  const index = proposals.findIndex(p => p.id === id);
  if (index !== -1) {
    proposals[index].status = status;
    setStored(STORAGE_KEYS.PARTNERSHIP_PROPOSALS, [...proposals]);

    // If accepted, update the site status to partnered
    if (status === 'accepted') {
      updateSitePartnership(proposals[index].siteListingId, { status: 'partnered' });
    }
  }
};

// Reset demo data helper
export const resetDemoData = () => {
  localStorage.removeItem(STORAGE_KEYS.CHARGERS);
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.INSTALLATIONS);
  localStorage.removeItem(STORAGE_KEYS.REVIEWS);
  localStorage.removeItem(STORAGE_KEYS.OFFERS);
  localStorage.removeItem(STORAGE_KEYS.COMMISSION_RATE);
  localStorage.removeItem(STORAGE_KEYS.SITE_PARTNERSHIPS);
  localStorage.removeItem(STORAGE_KEYS.PARTNERSHIP_PROPOSALS);
  initializeStorage();
  notifyListeners();
};

// Seed sample chargers or bookings for a newly registered account
export const seedSampleDataForUser = (user: User) => {
  if (user.role === 'host') {
    const chargers = getChargers();
    const existingCount = chargers.filter(c => c.hostId === user.id).length;
    if (existingCount === 0) {
      const sample1: Charger = {
        ...INITIAL_CHARGERS[0],
        id: `ch_${user.id}_1`,
        hostId: user.id,
        hostName: user.name,
        name: `${user.name.split(' ')[0]}'s Fast AC Port (Indiranagar)`,
        createdAt: new Date().toISOString(),
      };
      const sample2: Charger = {
        ...INITIAL_CHARGERS[1],
        id: `ch_${user.id}_2`,
        hostId: user.id,
        hostName: user.name,
        name: `${user.name.split(' ')[0]}'s Rapid DC Station`,
        createdAt: new Date().toISOString(),
      };
      setStored(STORAGE_KEYS.CHARGERS, [sample1, sample2, ...chargers]);
    }
  } else {
    const bookings = getBookings();
    const existingCount = bookings.filter(b => b.driverId === user.id).length;
    if (existingCount === 0) {
      const sampleB1: Booking = {
        ...INITIAL_BOOKINGS[0],
        id: `bk_${user.id}_1`,
        driverId: user.id,
        driverName: user.name,
        driverPhone: user.phone || '+91 98000 00000',
        createdAt: new Date().toISOString(),
      };
      const sampleB2: Booking = {
        ...INITIAL_BOOKINGS[1],
        id: `bk_${user.id}_2`,
        driverId: user.id,
        driverName: user.name,
        driverPhone: user.phone || '+91 98000 00000',
        createdAt: new Date().toISOString(),
      };
      setStored(STORAGE_KEYS.BOOKINGS, [sampleB1, sampleB2, ...bookings]);
    }
  }
};
