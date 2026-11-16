# ChargeCircle - Peer-to-Peer EV Charging Marketplace ⚡🇮🇳

A modern, responsive, premium-quality EV charging marketplace website designed specifically for the Indian electric vehicle ecosystem. **ChargeCircle** connects EV owners (two-wheelers and four-wheelers) with verified community hosts at homes, cafes, restaurants, hotels, and commercial hubs.

---

## 🌟 Live Demo & Quick Start

The development server is actively running:
- **Local URL**: [http://localhost:5173/](http://localhost:5173/)
- **Network URL**: Accessible on your local network on port `5173`

### Commands
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Production build
npm run build
```

---

## 🚀 Key Features & Architectural Highlights

### 1. 🎨 Premium Modern Design & UI/UX
- **Design Philosophy**: Minimalist, clean EV-tech aesthetic with crisp Inter typography, electric emerald accent (`#10b981`), navy/charcoal typography (`#0f172a`), soft shadows, and card rounding.
- **Lucide Icons**: 100% SVG Lucide React icons with zero emojis used for UI controls.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile with a dedicated slide-out mobile drawer and mobile list/map switcher.
- **Interactive Evaluation Bar**: A persistent top banner that lets evaluators switch personas with 1-click between **Driver** (Ananya Sen), **Host** (Rajesh Sharma), and **Admin** (Super Admin).

### 2. 🗺️ Find Chargers (Interactive Discovery)
- **Split Layout**: Interactive Leaflet + OpenStreetMap canvas on one side, charger cards and filters on the other side.
- **Functional Filters**:
  - **City Filter**: Bengaluru, Delhi NCR, Mumbai, Hyderabad, Pune, Chennai
  - **Vehicle Category**: All EVs, Electric Cars (4W), Electric Two-Wheelers (2W)
  - **Connector Types**: Type 2 (AC), CCS2 (DC Fast), 15A 3-Pin Domestic Socket, Ather Dot / Grid, Bharat DC001
  - **Power & Speed**: Rapid DC (≥ 50 kW), Fast AC (7.2 - 22 kW), Standard Socket (3.3 kW)
  - **Host Property Type**: Home / Villa, Café, Restaurant, Hotel, Commercial Hub
  - **Pricing Slider**: ₹10/kWh to ₹35/kWh
  - **Toggles**: Only Available Now, Verified Hosts Only
- **Sorting**: Nearest first, Lowest price, Highest rated (★ 4.8+), Fastest power (kW).
- **Synchronized Map & List**: Hovering/clicking a card highlights the map marker pin with custom price badges and opens the interactive popup card with a direct "Book" button.

### 3. 🔍 Charger Details Page
- High-resolution photo gallery with thumbnail selector.
- Complete technical specifications: Power rating (kW), voltage, phase, connector types, operating hours, and parking bay type.
- **4-Point Safety & Trust Verification Panel**:
  1. 🛡️ **Host Identity**: Aadhaar / Government ID verified
  2. 🏠 **Property Authority**: Gated authority / RWA NOC verified
  3. ⚡ **Electrical Safety & Earthing**: Neutral-to-earth voltage certified < 2V with dedicated MCB
  4. 🔌 **Compatibility**: Tested with vehicle BMS handshake
- Host profile card with response time and direct telephone badge.
- Verified driver reviews with star ratings breakdown and review submission modal.

### 4. 📅 Complete Booking System & QR Check-in Pass
- **5-Step Booking Flow**:
  1. Select Date (Today, Tomorrow, Pick date)
  2. Select Time Slot with **Double-Booking Prevention** (already booked slots are locked and disabled)
  3. Select Duration (1 to 4 hours)
  4. Choose Connector & Vehicle Information (Car vs 2-Wheeler, Model, Registration Plate)
  5. Transparent Cost Breakdown: Base Energy Cost + Configurable Platform Service Fee (10%) + 18% GST
- **Payment Gateway Simulation**: Mock Razorpay/UPI QR checkout with celebratory confetti animation (`canvas-confetti`).
- **Booking Confirmation Pass**: Displays unique Booking Code (e.g. `CC-BKG-8492`), digital SVG QR check-in pass, host contact, driving directions via Google Maps, tax receipt download, and instant slot cancellation option.
- **Live Charging Simulation**: Evaluators can simulate hardware plug-in, real-time energy dispensing, and session completion!
- **My Bookings Dashboard**: Filter bookings by Upcoming, Completed, and Cancelled.

### 5. 🧮 Charging Cost & Savings Calculator
- Preset models for popular Indian EVs:
  - **Four-Wheelers**: Tata Nexon EV Max (40.5 kWh), Tata Punch EV (35 kWh), MG ZS EV (50.3 kWh), Mahindra XUV400 (39.4 kWh), Hyundai Ioniq 5 (72.6 kWh), BYD Atto 3 (60.48 kWh)
  - **Two-Wheelers**: Ather 450X (3.7 kWh), Ola S1 Pro (4.0 kWh), TVS iQube (3.4 kWh), Bajaj Chetak (3.2 kWh), Simple One (5.0 kWh)
  - **Custom Pack**: User-entered battery capacity (kWh)
- Dynamic sliders for Current Battery %, Target Battery % (recommended 80-85%), Station Price per kWh, and Charger Power (3.3 kW to 50 kW).
- **Mathematical Formulations**:
  $$\text{Energy Required} = \text{Battery Capacity} \times \frac{\text{Target \%} - \text{Current \%}}{100}$$
  $$\text{Estimated Cost} = \text{Energy Required} \times \text{Price per kWh}$$
  $$\text{Charging Time} = \frac{\text{Energy Required}}{\text{Charger Power} \times 0.88}$$
- **Petrol Comparison**: Demonstrates 70-80% fuel cost savings compared to equivalent petrol mileage.
- **Engineering Disclaimer**: Details battery charging curve taper above 80%, ambient temperature, and Indian grid voltage fluctuations.

### 6. ☕ Charge + Explore (Destination Charging)
- "Charge Your Vehicle. Enjoy Your Time."
- Showcase of partner restaurants, artisan cafes, and hotels offering EV charging alongside perks:
  - Third Wave Coffee (Indiranagar, Bangalore): Free specialty pour-over coffee with 1-hour charge
  - Burma Burma (DLF Cyber Hub, Gurgaon): 15% off total dining bill with active booking
  - The Paul Boutique Hotel (Domlur, Bangalore): 20% off Sunday brunch & pool lounge access
  - Blue Tokai Coffee Roasters (Lower Parel, Mumbai): Complimentary pastry with manual brew
- Direct "Book Charging Slot" integration from venue cards.

### 7. 🤝 Become a Host & Partner Installation
- **Option A: "I Already Have a Charger"**: Full multi-step registration form capturing host contact, property type, charger brand, connector, power, pricing, and operating hours. **Saves to storage with 'Pending Verification' status** (satisfying the safety rule that new submissions are not automatically verified).
- **Option B: "I Need a Charger Installed"**: Turnkey lead capture for partner installation (property type, meter connection Single Phase / Three Phase, expected vehicle demand, and timeline).
- **Host Earnings Potential Estimator**: Interactive slider calculating monthly gross and net host payouts.

### 8. 📊 Host Dashboard
- Key metrics: Net Host Payouts, Completed Sessions, Active Stations, and Average Rating.
- **My Chargers**: Toggle stations Online / Offline, live edit pricing per kWh, and inspect safety audit badges.
- **Bookings Ledger**: Manage incoming bookings, end active charging sessions, and view driver vehicle plate numbers.
- **Earnings & Commission**: Transparent breakdown of Gross Billing vs Platform Fee (10%) vs Host Payout (90%), with an instant payout request action (simulating instant UPI IMPS transfer).
- **Installation Requests**: Track progress of requested chargers.

### 9. 🛡️ Admin Dashboard
- Comprehensive metrics: Gross Booking Value, Platform Revenue, Total Chargers, Pending Reviews, Install Leads, and Registered Users.
- **Charger Verification Queue**: Review submitted chargers and execute actions:
  - **Approve & Grant Badges**: Grants Identity, Property Authority, Certified Earthing, and Compatibility badges.
  - **Schedule On-Site Inspection**: Flags listing for technician dispatch.
  - **Reject / Flag**: Rejects unsafe listings.
- **All Transactions**: Platform-wide transaction ledger.
- **Installation Leads Pipeline**: Assign certified partner engineering teams (Tata Power, Statiq, Exicom) to installation requests.
- **Platform Commission Settings**: Live configurable commission percentage slider (5% to 25%) that immediately recalculates payouts across the platform.

---

## 🛠️ Tech Stack & Directory Structure

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v3 with custom electric green and slate palettes
- **Icons**: Lucide React
- **Maps**: Leaflet + OpenStreetMap (with custom HTML charging pin markers and popups)
- **Effects**: Canvas Confetti for booking confirmations
- **Storage Layer**: Reactive LocalStorage state service with auto-subscriber pattern and mock Indian dataset

```
VoltCircle/
├── src/
│   ├── config/
│   │   └── brand.ts            # Centralized brand configuration & EV presets
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (Charger, Booking, User, etc.)
│   ├── services/
│   │   ├── mockData.ts         # Realistic Indian demo dataset
│   │   └── storage.ts          # Reactive LocalStorage state & business logic
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation bar with role switcher & mobile drawer
│   │   ├── Footer.tsx          # Comprehensive footer with trust & safety guidelines
│   │   ├── MapLeaflet.tsx      # OpenStreetMap component with custom pin markers
│   │   ├── ChargerCard.tsx     # Reusable charger card with badges and actions
│   │   ├── BookingModal.tsx    # Step-by-step booking modal & payment simulation
│   │   ├── ReviewModal.tsx     # Rating & review submission modal
│   │   ├── AuthModal.tsx       # Auth modal with 1-click evaluation personas
│   │   └── VerificationBadgePill.tsx # 4-point verification badge pill
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero search, how it works, featured listings
│   │   ├── FindChargersPage.tsx# Interactive discovery with split map & filters
│   │   ├── ChargerDetailPage.tsx # Dedicated station page with specs & booking
│   │   ├── BookingConfirmationPage.tsx # Digital QR pass & session simulation
│   │   ├── MyBookingsPage.tsx  # Driver bookings dashboard (Upcoming/Completed)
│   │   ├── CalculatorPage.tsx  # Interactive EV cost & time calculator
│   │   ├── ChargeExplorePage.tsx # Destination dining & shopping charging
│   │   ├── BecomeHostPage.tsx  # Option A (List) & Option B (Install) forms
│   │   ├── HostDashboardPage.tsx # Host station management & payouts
│   │   ├── AdminDashboardPage.tsx # Verification queue, pipeline & commission
│   │   └── HowItWorksPage.tsx  # Dual driver/host journey & safety FAQs
│   ├── App.tsx                 # Main application shell with routing & modals
│   ├── main.tsx                # Entry point
│   └── index.css               # Tailwind CSS & custom animations
├── index.html                  # HTML entry with Inter font & Leaflet CSS
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json
```

---

## 🔒 Safety & Trust Philosophy for Indian Conditions

1. **Certified Neutral-to-Earth Grounding**: In India, standard 230V residential connections frequently suffer from floating neutral or weak earthing, causing EV on-board chargers (OBC) to throw red safety trip errors. ChargeCircle requires that every host station test neutral-to-earth potential under 2.0V before certification.
2. **Dedicated Circuit Breaker**: Standard 15A wall sockets without dedicated MCBs and Residual Current Circuit Breakers (RCCB) are never granted the Verified status.
3. **No Automatic Approval**: Submitting a host form registers the charger in **Pending Verification** status until reviewed by platform technicians.
