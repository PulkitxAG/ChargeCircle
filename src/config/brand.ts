// Application Branding Configuration
export const BRAND_CONFIG = {
  name: "ChargeCircle",
  tagline: "Your Next Charge Is Closer Than You Think",
  subtitle: "India's premier peer-to-peer EV charging marketplace. Discover, book, and earn with verified community chargers for two-wheelers and cars.",
  supportEmail: "support@chargecircle.in",
  supportPhone: "+91 8000 242 743",
  currency: "₹",
  currencyCode: "INR",
  defaultCommissionRate: 0.10, // 10% platform commission
  gstRate: 0.18, // 18% GST on platform service fee
  cities: [
    "Bengaluru",
    "Delhi NCR",
    "Mumbai",
    "Hyderabad",
    "Pune",
    "Chennai"
  ],
  popularEVs: {
    fourWheeler: [
      { name: "Tata Nexon EV Max", batteryKwh: 40.5, connector: "CCS2 (DC Fast)", defaultPowerKw: 7.2 },
      { name: "Tata Punch EV", batteryKwh: 35.0, connector: "CCS2 (DC Fast)", defaultPowerKw: 7.2 },
      { name: "MG ZS EV", batteryKwh: 50.3, connector: "CCS2 (DC Fast)", defaultPowerKw: 7.4 },
      { name: "Mahindra XUV400", batteryKwh: 39.4, connector: "CCS2 (DC Fast)", defaultPowerKw: 7.2 },
      { name: "Hyundai Ioniq 5", batteryKwh: 72.6, connector: "CCS2 (DC Fast)", defaultPowerKw: 11.0 },
      { name: "BYD Atto 3", batteryKwh: 60.48, connector: "CCS2 (DC Fast)", defaultPowerKw: 7.0 },
      { name: "Tata Tiago EV", batteryKwh: 24.0, connector: "CCS2 (DC Fast)", defaultPowerKw: 3.3 }
    ],
    twoWheeler: [
      { name: "Ather 450X Gen 3", batteryKwh: 3.7, connector: "Ather Dot / Grid", defaultPowerKw: 3.3 },
      { name: "Ola S1 Pro Gen 2", batteryKwh: 4.0, connector: "15A 3-Pin Domestic", defaultPowerKw: 3.3 },
      { name: "TVS iQube ST", batteryKwh: 3.4, connector: "15A 3-Pin Domestic", defaultPowerKw: 3.0 },
      { name: "Bajaj Chetak Premium", batteryKwh: 3.2, connector: "15A 3-Pin Domestic", defaultPowerKw: 3.0 },
      { name: "Simple One", batteryKwh: 5.0, connector: "15A 3-Pin Domestic", defaultPowerKw: 3.3 },
      { name: "Hero Vida V1 Pro", batteryKwh: 3.94, connector: "15A 3-Pin Domestic", defaultPowerKw: 3.3 }
    ]
  }
};
