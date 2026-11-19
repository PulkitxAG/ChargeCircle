# ChargeCircle - Peer-to-Peer EV Charging Marketplace ⚡🇮🇳

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-10b981?style=for-the-badge&logo=vercel)](https://chargecircle-zeta.vercel.app/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%203-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, responsive, enterprise-grade peer-to-peer EV charging marketplace designed specifically for India's electric vehicle ecosystem. **ChargeCircle** connects EV drivers (electric 2-wheelers and 4-wheelers) with verified community charging hosts at residential villas, cafes, restaurants, hotels, and commercial hubs.

---

## 🌟 Live Production Deployment

* 🚀 **Official Production URL**: **[https://chargecircle-zeta.vercel.app/](https://chargecircle-zeta.vercel.app/)**
* ⚡ **Continuous Deployment (CI/CD)**: Auto-deployed via GitHub Integration on Vercel.
* 📊 **Live Telemetry & Web Analytics**: Integrated with `@vercel/analytics`.

---

## 💻 Local Quick Start

To run ChargeCircle locally on your computer:

```bash
# 1. Clone repository
git clone https://github.com/PulkitxAG/ChargeCircle.git
cd ChargeCircle

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Launch local development server
npm run dev

# 4. Compile production bundle
npm run build
```

The local development server will spin up at `http://localhost:5173/`.

---

## 🚀 Key Features & Architectural Highlights

### 1. 🎨 Modern Design & Responsive UI/UX
* **Clean Tech Aesthetic**: Minimalist layout featuring crisp typography, signature electric emerald accents (`#10b981`), charcoal slate text, soft shadows, and smooth card rounding.
* **100% SVG Vector Icons**: Powered by `lucide-react` with zero emojis used for interactive UI controls.
* **Fully Responsive**: Optimized for desktop, tablet, and mobile screens with a responsive slide-out drawer and synchronized mobile map/list switcher.
* **Role-Based Views**: Seamless persona switching between **EV Driver**, **Charging Host**, and **Admin**.

### 2. 🗺️ Interactive Geospatial Station Discovery (`/find-chargers`)
* **Split Layout**: Interactive Leaflet + OpenStreetMap canvas synchronized with real-time station cards.
* **Multi-Parameter Search & Filters**:
  * **City**: Bengaluru, Delhi NCR, Mumbai, Hyderabad, Pune, Chennai.
  * **Vehicle Categories**: All EVs, Electric Cars (4W), Electric Two-Wheelers (2W).
  * **Connector Types**: Type-2 AC, CCS2 (DC Fast), 15A 3-Pin Domestic Wall Socket, Ather Dot / Grid, Bharat DC001.
  * **Power Ratings**: Rapid DC ($\ge 50\text{ kW}$), Fast AC ($7.2 - 22\text{ kW}$), Standard Domestic ($3.3\text{ kW}$).
  * **Property Type**: Residential Villa, Café, Restaurant, Hotel, Commercial Hub.
  * **Pricing Filter**: Dynamic slider from ₹10/kWh to ₹35/kWh.
  * **Quick Toggles**: Available Now, Verified Hosts Only.
* **Smart Sorting**: Nearest First, Lowest Price, Highest Rated ($\star$ 4.8+), and Highest Power (kW).
* **Synchronized Map Pins**: Hovering/clicking a card highlights the map pin with dynamic price badges and opens the interactive booking card.

### 3. 🛣️ Interstate Highway Corridor Planner
* **Corridor Route Optimization**: Bengaluru $\leftrightarrow$ Mysuru Expressway ($145\text{ km}$), Delhi NCR $\leftrightarrow$ Jaipur Highway ($270\text{ km}$), Mumbai $\leftrightarrow$ Pune Expressway ($148\text{ km}$), and Hyderabad $\leftrightarrow$ Vijayawada ($275\text{ km}$).
* **Dynamic Energy & Cost Calculation**:
  * Evaluates vehicle battery capacity and real-world efficiency (e.g., Tata Nexon EV Max at $7.2\text{ km/kWh}$).
  * Accurately calculates required pitstops, total energy consumption in kWh, estimated charging cost, and fuel savings compared to petrol (ICE).

### 4. 💰 Host Yield & Passive Income Calculator
* **Transparent Unit Economics**: Interactive earnings slider on the homepage demonstrating host gross revenue, 15% platform commission, and projected net monthly earnings.
* **3 Acquisition Pathways**:
  * **Option A (`List My Charger`)**: For property owners who already own an EV wallbox.
  * **Option B (`Request Installation`)**: Turnkey certified electrical contractor dispatch.
  * **Option C (`Co-Host Space`)**: Capital-free property partnership where investors fund the charger and split profits 50/50.

### 5. 🤝 Property Co-Hosting Marketplace (`/site-partnerships`)
* **First-in-Segment EV Revenue-Sharing Engine**:
  * Solves high CAPEX barrier: Property owners with prime commercial/residential parking pair with EV investors who purchase the charging hardware.
  * **50/50 Transparent Profit Split**: Energy cost and platform fees deducted automatically; net margin split equally between space owner and equipment investor.
* **Site Listing & Proposal Engine**:
  * Property hosts list available bays with daily footfall, electrical sanctioned load (kW), and parking photos.
  * Investors browse listings, analyze ROI projections, and submit formal co-hosting hardware proposals.

### 6. 📅 5-Step Booking State Machine & Digital QR Pass
1. **Date & Slot Selection**: Real-time double-booking lockout prevents overlapping reservations.
2. **Vehicle Details**: Select connector type, vehicle registration plate, and charge duration (1 to 4 hours).
3. **Transparent Billing**: Base Energy Rate + 10% Configurable Platform Fee + 18% GST.
4. **Simulated Payment Gateway**: Instant UPI / Card checkout with celebratory confetti animation.
5. **Digital QR Pass**: Generates unique Booking Code (e.g. `CC-BKG-8492`), SVG QR pass for physical host check-in, Google Maps navigation link, and downloadable tax invoice.
6. **Hardware Telemetry Simulator**: Evaluators can simulate plugging in the EV connector, real-time energy dispensing, and completing the charge session.

### 7. 🧮 Comprehensive EV Cost & Fuel Savings Calculator (`/calculator`)
* Preset specs for popular Indian EVs:
  * **4-Wheelers**: Tata Nexon EV Max ($40.5\text{ kWh}$), Tata Punch EV ($35\text{ kWh}$), MG ZS EV ($50.3\text{ kWh}$), Mahindra XUV400, Hyundai Ioniq 5, BYD Atto 3.
  * **2-Wheelers**: Ather 450X ($3.7\text{ kWh}$), Ola S1 Pro ($4.0\text{ kWh}$), TVS iQube, Bajaj Chetak.
* Real-time sliders for Current Battery %, Target Battery % (recommended 80%), Tariff per kWh, and Charger Power (3.3 kW to 50 kW).
* **Mathematical Modeling**:
  $$\text{Energy Required (kWh)} = \text{Battery Capacity} \times \frac{\text{Target \%} - \text{Current \%}}{100}$$
  $$\text{Charging Cost (₹)} = \text{Energy Required} \times \text{Tariff (₹/kWh)}$$
  $$\text{Session Duration (Hours)} = \frac{\text{Energy Required}}{\text{Charger Power (kW)} \times 0.88}$$
* **Petrol Comparison**: Demonstrates 70% to 80% cost savings over traditional petrol vehicles.

### 8. ☕ Charge + Explore (Destination Charging)
* Destination charging experiences paired with cafes, restaurants, and hotels:
  * **Third Wave Coffee (Indiranagar, Bengaluru)**: Free pour-over coffee with 1-hour charge.
  * **Burma Burma (DLF Cyber Hub, Gurugram)**: 15% dining discount with active reservation.
  * **The Paul Boutique Hotel (Domlur, Bengaluru)**: Sunday brunch & pool lounge access.
  * **Blue Tokai Coffee Roasters (Lower Parel, Mumbai)**: Complimentary beverage pairing.

### 9. 🔐 Authentication & Two-Factor OTP Security
* **Hybrid Storage Architecture**: Powered by **Supabase PostgreSQL** cloud database with offline fallback for zero-latency viva evaluations.
* **OAuth 2.0 & OpenID Connect**: 1-click **Continue with Google** with verified identity claims.
* **Two-Factor OTP Sign-In Confirmation**: Dispatches 6-digit verification code with 30-second resend timer to prevent unauthorized logins.
* **Duplicate Email & Anti-Enumeration Guard**: Prevents account collisions and unconfirmed ghost signups.
* **1-Click Evaluation Profiles**: Instant login as Driver (*Ananya Sen*) or Host (*Rajesh Sharma*) without typing credentials.

### 10. 📊 Host & Admin Dashboards
* **Host Operations Dashboard (`/host-dashboard`)**:
  * Real-time station telemetry: toggle bays Online/Offline, edit per-kWh tariffs, view live sessions.
  * Financial ledger: gross earnings, platform commission deductions, and instant UPI IMPS payout requests.
* **Admin Control Center (`/admin-dashboard`)**:
  * Hardware verification queue: approve safety audit badges, schedule physical contractor inspections, or reject non-compliant sockets.
  * Dynamic platform commission slider ($5\% - 25\%$) that updates marketplace fees globally.
  * **Security Lockout**: Admin panel strictly locked to authorized administrator.

---

## 🔒 Safety & Earthing Philosophy for Indian Grid Conditions

1. **Certified Neutral-to-Earth Potential**: In India, standard 230V residential connections frequently suffer from floating neutral or high earth resistance, causing EV On-Board Chargers (OBC) to throw red safety trip faults. ChargeCircle certifies host bays only when neutral-to-earth voltage measures $< 2.0\text{V}$.
2. **Dedicated Protection Switchgear**: 15A wall sockets without dedicated Miniature Circuit Breakers (MCB) and Residual Current Circuit Breakers (RCCB) are never granted verified badges.
3. **No Automatic Approval**: Newly submitted chargers are placed in **Pending Verification** until approved by platform technicians.

---

## 🛠️ Complete Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19 (TypeScript), Vite 6 |
| **Styling & Design System** | Tailwind CSS v3, PostCSS, Custom Emerald Theme |
| **Database & Auth** | Supabase (PostgreSQL 15+), Row Level Security (RLS), OAuth 2.0 |
| **Geospatial & Maps** | Leaflet, OpenStreetMap, Custom HTML Price Pins |
| **Icons & Media** | Lucide React (100% SVG), Canvas Confetti |
| **State & Persistence** | Reactive LocalStorage State Machine with Auto-Subscriber Pattern |
| **Cloud Hosting & CDN** | Vercel Serverless Edge Platform |
| **Analytics** | Vercel Web Analytics (`@vercel/analytics`) |
| **Code Quality** | Oxlint (Rust-based high-speed linter), Strict TypeScript |

---

## 📁 Repository Directory Structure

```
ChargeCircle/
├── public/                     # Static high-res assets, EV photos, favicon.svg
├── src/
│   ├── config/
│   │   └── brand.ts            # Centralized brand settings & EV vehicle presets
│   ├── types/
│   │   └── index.ts            # Strict TypeScript interfaces (Charger, Booking, User)
│   ├── services/
│   │   ├── mockData.ts         # Realistic Indian EV stations & corridor dataset
│   │   ├── storage.ts          # Reactive LocalStorage state engine & RBAC guards
│   │   ├── supabase.ts         # Supabase client configuration & credentials
│   │   └── authService.ts      # Auth engine, OAuth, 2FA OTP & duplicate prevention
│   ├── components/
│   │   ├── Navbar.tsx          # Adaptive header with role switcher & mobile drawer
│   │   ├── Footer.tsx          # Footer with earthing guidelines & platform links
│   │   ├── MapLeaflet.tsx      # OpenStreetMap canvas with dynamic marker popups
│   │   ├── ChargerCard.tsx     # Station listing card with specs, badges, and actions
│   │   ├── BookingModal.tsx    # 5-step booking state machine & payment simulation
│   │   ├── ReviewModal.tsx     # Star ratings & driver review submission modal
│   │   ├── AuthModal.tsx       # Auth modal with 2FA OTP screen & demo profiles
│   │   └── VerificationBadgePill.tsx # 4-point earthing & identity trust badges
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero, Corridor Planner, Yield Calculator, Fleet
│   │   ├── FindChargersPage.tsx# Split-view interactive discovery with map & filters
│   │   ├── ChargerDetailPage.tsx # Hardware specs, safety audit, photo gallery
│   │   ├── BookingConfirmationPage.tsx # Digital QR pass & live charging simulation
│   │   ├── MyBookingsPage.tsx  # Driver bookings ledger (Upcoming / Completed)
│   │   ├── CalculatorPage.tsx  # Dynamic EV energy, time, and petrol comparison
│   │   ├── SitePartnershipsPage.tsx # 50/50 Co-Hosting matchmaker & proposal modal
│   │   ├── ChargeExplorePage.tsx # Destination dining & shopping EV charging
│   │   ├── BecomeHostPage.tsx  # Option A (Self-List) & Option B (Install) forms
│   │   ├── HostDashboardPage.tsx # Host station management, tariffs & payouts
│   │   ├── AdminDashboardPage.tsx # KYC verification queue, pipeline & commission
│   │   └── HowItWorksPage.tsx  # Comprehensive driver & host guides + FAQs
│   ├── App.tsx                 # Core application shell & OAuth redirect listener
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Tailwind CSS utility layers & custom animations
├── index.html                  # HTML5 canvas entry with Google Fonts & Leaflet CSS
├── supabase_schema.sql         # Relational PostgreSQL DDL schema & RLS policies
├── vercel.json                 # Vercel SPA routing rewrite rules
├── vite.config.ts              # Vite production compiler & bundler configuration
├── tailwind.config.js          # Tailwind theme color matrix & responsive breakpoints
├── tsconfig.json               # Root TypeScript configuration
└── package.json                # Project dependencies and build scripts
```

---

## 👨‍💻 Author & Project Credits

* **Developer & Presenter**: **Pulkit Agrawal**
* **University ID (K ID)**: **K27231**
* **Institution**: **Career Point University, Kota**
* **Project Type**: B.Tech Computer Science & Engineering — Capstone Major Project

---

## 📄 License

This project is developed for educational and academic capstone evaluation purposes. Released under the [MIT License](LICENSE).
