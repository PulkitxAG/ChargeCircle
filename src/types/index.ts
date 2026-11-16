export type UserRole = 'driver' | 'host' | 'admin';

export type VehicleCategory = 'two_wheeler' | 'four_wheeler' | 'both';

export type ConnectorType =
  | 'Type 2 (AC)'
  | 'CCS2 (DC Fast)'
  | 'Bharat AC001'
  | 'Bharat DC001'
  | '15A 3-Pin Domestic'
  | 'Ather Dot / Grid'
  | 'CHAdeMO';

export type PropertyType =
  | 'home'
  | 'apartment'
  | 'restaurant'
  | 'cafe'
  | 'hotel'
  | 'office'
  | 'commercial';

export type VerificationStatus = 'verified' | 'pending' | 'inspection_required' | 'rejected';

export interface VerificationBadges {
  identity: boolean;
  propertyAuthority: boolean;
  electricalSafety: boolean; // Verified grounding/earthing and dedicated MCB
  compatibility: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  vehicleModel?: string;
  vehicleType?: 'two_wheeler' | 'four_wheeler';
  vehiclePlateNumber?: string;
  memberSince: string;
}

export interface Charger {
  id: string;
  hostId: string;
  hostName: string;
  hostPhone: string;
  hostAvatar?: string;
  hostType: PropertyType;
  name: string;
  description: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  connectorTypes: ConnectorType[];
  powerRatingKw: number;
  pricingPerKwh: number;
  supportedVehicles: VehicleCategory;
  speedCategory: 'slow' | 'fast' | 'rapid';
  operatingHours: {
    open: string;
    close: string;
    days: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  };
  amenities: string[];
  parkingType: 'Covered' | 'Open' | 'Basement' | 'Drive-in';
  accessInstructions: string;
  images: string[];
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  verificationBadges: VerificationBadges;
  isAvailableNow: boolean;
  autoApproval: boolean;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  chargerId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
}

export type BookingStatus = 'confirmed' | 'active_charging' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'refunded' | 'pending';

export interface Booking {
  id: string;
  bookingCode: string;
  chargerId: string;
  chargerName: string;
  chargerAddress: string;
  chargerImage: string;
  powerRatingKw: number;
  connectorType: ConnectorType;
  hostId: string;
  hostName: string;
  hostPhone: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverVehicleModel: string;
  driverVehiclePlate: string;
  driverVehicleType: 'two_wheeler' | 'four_wheeler';
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  energyEstimatedKwh: number;
  pricePerKwh: number;
  baseCost: number;
  platformCommissionRate: number;
  platformFee: number;
  gstAmount: number;
  totalAmount: number;
  hostPayout: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  transactionId: string;
  createdAt: string;
  notes?: string;
  chargingProgressPercent?: number;
}

export type InstallationRequestStatus =
  | 'submitted'
  | 'under_review'
  | 'partner_assigned'
  | 'installation_in_progress'
  | 'completed';

export interface InstallationRequest {
  id: string;
  requestCode: string;
  name: string;
  email: string;
  phone: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  pincode: string;
  parkingSpaceType: string;
  meterConnection: 'Single Phase (230V)' | 'Three Phase (415V)' | 'Not Sure';
  expectedVehicles: VehicleCategory;
  preferredTimeline: string;
  status: InstallationRequestStatus;
  partnerAssigned?: string;
  notes?: string;
  createdAt: string;
}

export interface BusinessOffer {
  id: string;
  chargerId: string;
  businessName: string;
  businessType: 'Restaurant' | 'Café' | 'Hotel' | 'Entertainment';
  city: string;
  area: string;
  title: string;
  discountText: string;
  description: string;
  perks: string[];
  validity: string;
  image: string;
  rating: number;
  foodType: string;
  priceForTwo: string;
}

export interface Review {
  id: string;
  chargerId: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverVehicle: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SearchFilters {
  query: string;
  city: string;
  vehicleCategory: 'all' | 'two_wheeler' | 'four_wheeler';
  connectorTypes: ConnectorType[];
  speedCategories: ('slow' | 'fast' | 'rapid')[];
  propertyTypes: PropertyType[];
  maxPrice: number;
  minRating: number;
  onlyAvailableNow: boolean;
  onlyVerified: boolean;
  sortBy: 'nearest' | 'price_low' | 'rating_high' | 'power_high';
}

export type SitePartnershipModel = 'revenue_share' | 'fixed_rent' | 'hybrid';

export interface SitePartnershipListing {
  id: string;
  propertyOwnerId: string;
  propertyOwnerName: string;
  propertyOwnerPhone: string;
  propertyOwnerEmail: string;
  title: string;
  propertyType: PropertyType;
  address: string;
  area: string;
  city: string;
  pincode: string;
  parkingBaysAvailable: number;
  parkingAccessType: 'Covered Private Driveway' | 'Gated Society Parking' | 'Open Commercial Lot' | 'Highway Frontage' | 'Basement Bay';
  sanctionedLoadKw: number;
  meterConnection: 'Single Phase (230V)' | 'Three Phase (415V)' | 'Transformer On-Premises';
  preferredModel: SitePartnershipModel;
  proposedRevenueSplitPercent: number; // e.g. 50% to property owner, 50% to hardware partner
  expectedMonthlyRent?: number; // e.g. ₹6,000 / month
  supportedVehicleTarget: VehicleCategory;
  description: string;
  amenities: string[];
  images: string[];
  status: 'open_for_partners' | 'proposal_received' | 'partnered' | 'inactive';
  proposalsCount: number;
  createdAt: string;
}

export interface PartnershipProposal {
  id: string;
  siteListingId: string;
  siteTitle: string;
  propertyOwnerId: string;
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  partnerCompanyOrType: 'Individual EV Investor' | 'Commercial CPO / Operator' | 'Certified Hardware Installer';
  proposedHardware: string; // e.g. "Exicom 22 kW Dual Type 2 AC Fast Wallbox" or "Delta 50 kW CCS2 DC Fast"
  hardwarePowerKw: number;
  hardwareInvestmentValue: number; // e.g. ₹1,20,000
  proposedSplitModel: SitePartnershipModel;
  ownerSharePercent: number; // e.g. 50%
  partnerSharePercent: number; // e.g. 50%
  fixedRentOfferMonthly?: number;
  contractTermYears: number; // e.g. 2 or 3
  maintenanceIncluded: boolean;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'negotiating';
  createdAt: string;
}
