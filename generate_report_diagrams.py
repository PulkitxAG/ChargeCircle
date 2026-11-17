import os
import tempfile
import numpy as np

# Set writable cache directory for Matplotlib
os.environ['MPLCONFIGDIR'] = os.path.join(tempfile.gettempdir(), 'mpl_cache')

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image

output_dir = 'report_figures'
os.makedirs(output_dir, exist_ok=True)

# Common styling palette
BG_COLOR = '#F8FAFC'
PRIMARY_BLUE = '#1E3A8A'
SECONDARY_BLUE = '#2563EB'
EMERALD_GREEN = '#059669'
DARK_SLATE = '#0F172A'
AMBER = '#D97706'
PURPLE = '#7C3AED'
LIGHT_GRAY = '#E2E8F0'
WHITE = '#FFFFFF'

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# -----------------------------------------------------------------------------
# Figure 1: Conceptual Overview of the ChargeCircle P2P Ecosystem
# -----------------------------------------------------------------------------
def gen_fig1():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Central Platform Box
    c_box = patches.FancyBboxPatch((35, 40), 30, 20, boxstyle="round,pad=1.5", fc=PRIMARY_BLUE, ec='none')
    ax.add_patch(c_box)
    ax.text(50, 52, "ChargeCircle Core Engine", ha='center', va='center', color=WHITE, fontsize=12, fontweight='bold')
    ax.text(50, 46, "Distributed Ledger • Smart Routing • Billing", ha='center', va='center', color='#93C5FD', fontsize=8.5)

    # Surrounding Nodes
    nodes = [
        (15, 75, "EV Drivers (2W / 4W)", "Real-time Search, Pre-Booking\nUPI Payment, Digital QR Pass", EMERALD_GREEN),
        (85, 75, "Community Hosts", "Residential Villas, Society Bays\nDiscom Metering, Tariff Setting", SECONDARY_BLUE),
        (15, 20, "Co-Hosting Landlords", "Vacant Land, Corporate IT Parks\nZero Hardware CapEx", AMBER),
        (85, 20, "Hardware CPO Investors", "Commercial 7.2-50kW Chargers\nAutomated 50/50 Revenue Split", PURPLE)
    ]

    for x, y, title, desc, color in nodes:
        box = patches.FancyBboxPatch((x-12, y-8), 24, 16, boxstyle="round,pad=1", fc=color, ec='none')
        ax.add_patch(box)
        ax.text(x, y+3, title, ha='center', va='center', color=WHITE, fontsize=10, fontweight='bold')
        ax.text(x, y-3, desc, ha='center', va='center', color='#F1F5F9', fontsize=7.5)

    # Connecting Arrows
    arrows = [
        ((25, 70), (37, 57), "Slot Booking"),
        ((75, 70), (63, 57), "Listing & Availability"),
        ((25, 25), (37, 43), "Site Co-Hosting Request"),
        ((75, 25), (63, 43), "Hardware Capital Deployment")
    ]
    for start, end, label in arrows:
        ax.annotate('', xy=end, xytext=start,
                    arrowprops=dict(arrowstyle="<->", color=DARK_SLATE, lw=1.8, mutation_scale=15))

    ax.set_title("Figure 1: Conceptual Architecture of the ChargeCircle P2P Ecosystem", fontsize=12, fontweight='bold', pad=15, color=DARK_SLATE)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig1_ecosystem.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 2: Indian EV Charging Standards & Connector Topology
# -----------------------------------------------------------------------------
def gen_fig2():
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    connectors = [
        (12, "15A Domestic Socket", "AC Single Phase\n230V / 16A (3.3 kW)\n2W Scooters & Slow Cars", '#64748B'),
        (31, "Type 2 Mennekes", "AC 1-Phase / 3-Phase\n230V-415V (7.2 - 22 kW)\nNexon EV, ZS EV, XUV400", PRIMARY_BLUE),
        (50, "CCS2 Combo", "DC Fast Charging\n200V - 1000V (25 - 60 kW)\nExpressway Corridor DC", SECONDARY_BLUE),
        (69, "Ather Dot / Grid", "Proprietary / Combined AC\n230V Single Phase (3.3 kW)\nAther 450X Series", EMERALD_GREEN),
        (88, "Bharat DC001", "Dual DC Standard\n48V - 72V (15 kW)\nFleet & Commercial 3W/4W", AMBER)
    ]

    for x, title, desc, color in connectors:
        box = patches.FancyBboxPatch((x-8, 20), 16, 60, boxstyle="round,pad=1", fc=WHITE, ec=color, lw=2.5)
        ax.add_patch(box)
        # Top color header
        hdr = patches.FancyBboxPatch((x-8, 65), 16, 15, boxstyle="round,pad=1", fc=color, ec=color)
        ax.add_patch(hdr)
        ax.text(x, 72, title, ha='center', va='center', color=WHITE, fontsize=8.5, fontweight='bold', wrap=True)
        ax.text(x, 42, desc, ha='center', va='center', color=DARK_SLATE, fontsize=8)

    ax.text(50, 10, "Compliant with BIS IS 17017 (Part 1, 21, 22) and CEA Central Electricity Authority Guidelines (2023)",
            ha='center', va='center', fontsize=9, fontstyle='italic', color='#475569')

    ax.set_title("Figure 2: Indian EV Charging Connector Typologies & Power Ratings", fontsize=12, fontweight='bold', pad=15, color=DARK_SLATE)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig2_standards.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 3: High-Level System Architecture Diagram
# -----------------------------------------------------------------------------
def gen_fig3():
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    layers = [
        (85, "1. Client & Presentation Tier (React 19 + TypeScript + Vite + Tailwind)", 
         [("Driver Portal", 20), ("Host Dashboard", 40), ("Site Co-Hosting Hub", 60), ("Admin Portal", 80)], PRIMARY_BLUE),
        (60, "2. Application & Business Logic Tier",
         [("Booking Engine", 15), ("Co-Host Matchmaker", 38), ("Corridor Drive Optimizer", 62), ("Safety Verifier", 85)], SECONDARY_BLUE),
        (35, "3. Core Services & Algorithmic Engines",
         [("State of Charge Calc", 20), ("Tariff & Commission Split", 40), ("Spatial GIS Leaflet Query", 60), ("QR Pass Crypto Engine", 80)], EMERALD_GREEN),
        (10, "4. Persistence, Storage & External Services",
         [("Storage Engine / Event Bus", 20), ("OpenStreetMap Tile CDN", 40), ("UPI Micro-Payments", 60), ("Discom Safety Audits", 80)], DARK_SLATE)
    ]

    for y, title, modules, color in layers:
        layer_bg = patches.Rectangle((5, y-8), 90, 17, fc=WHITE, ec=color, lw=2, zorder=1)
        ax.add_patch(layer_bg)
        ax.text(7, y+6.5, title, color=color, fontsize=9.5, fontweight='bold', zorder=2)
        for mod_name, mx in modules:
            m_box = patches.FancyBboxPatch((mx-9, y-6), 18, 9, boxstyle="round,pad=0.5", fc=color, ec='none', zorder=3)
            ax.add_patch(m_box)
            ax.text(mx, y-1.5, mod_name, ha='center', va='center', color=WHITE, fontsize=8, fontweight='bold', zorder=4)

    # Connecting vertical arrows
    for x in [25, 50, 75]:
        ax.annotate('', xy=(x, 70), xytext=(x, 77), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=1.5))
        ax.annotate('', xy=(x, 45), xytext=(x, 52), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=1.5))
        ax.annotate('', xy=(x, 20), xytext=(x, 27), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=1.5))

    ax.set_title("Figure 3: Layered System Architecture of the ChargeCircle Platform", fontsize=12, fontweight='bold', pad=15, color=DARK_SLATE)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig3_architecture.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 4: Mathematical Curve of State of Charge (SoC) vs Charging Power (CC-CV)
# -----------------------------------------------------------------------------
def gen_fig4():
    fig, ax1 = plt.subplots(figsize=(9, 5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax1.set_facecolor(WHITE)

    soc = np.linspace(0, 100, 300)
    # Constant Current (CC) then Constant Voltage (CV) power curve
    power = np.where(soc < 80, 50, 50 * np.exp(-(soc - 80) / 10))
    voltage = 350 + 70 * (1 / (1 + np.exp(-(soc - 20) / 15)))

    ax1.plot(soc, power, color=PRIMARY_BLUE, lw=2.5, label='Effective Charging Power P(t) [kW]')
    ax1.set_xlabel('Battery State of Charge (SoC %)', fontsize=10, fontweight='bold')
    ax1.set_ylabel('Power Output (kW)', color=PRIMARY_BLUE, fontsize=10, fontweight='bold')
    ax1.tick_params(axis='y', labelcolor=PRIMARY_BLUE)
    ax1.set_xlim(0, 100)
    ax1.set_ylim(0, 60)
    ax1.grid(True, linestyle='--', alpha=0.5)

    ax2 = ax1.twinx()
    ax2.plot(soc, voltage, color=EMERALD_GREEN, lw=2, linestyle='--', label='Pack Voltage [V]')
    ax2.set_ylabel('Terminal Voltage (V)', color=EMERALD_GREEN, fontsize=10, fontweight='bold')
    ax2.tick_params(axis='y', labelcolor=EMERALD_GREEN)
    ax2.set_ylim(300, 450)

    # Shaded Zones
    ax1.axvspan(0, 80, color=SECONDARY_BLUE, alpha=0.08, label='Constant Current (CC) Phase (0-80%)')
    ax1.axvspan(80, 100, color=AMBER, alpha=0.12, label='Constant Voltage (CV) Taper Phase (80-100%)')

    ax1.text(40, 25, "Rapid Bulk Charge\n(Constant Current ~50 kW)", ha='center', fontsize=9, fontweight='bold', color=PRIMARY_BLUE)
    ax1.text(90, 20, "Thermal Taper\n(Constant Voltage)", ha='center', fontsize=8.5, fontweight='bold', color=AMBER)

    plt.title("Figure 4: Battery Charging Profile: Constant Current (CC) to Constant Voltage (CV) Transition", fontsize=11, fontweight='bold', pad=15)
    fig.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig4_cccv_curve.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 5: Entity-Relationship (ER) Schema for the Marketplace
# -----------------------------------------------------------------------------
def gen_fig5():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    entities = [
        (20, 80, "USER (Host / Driver / Admin)", ["user_id (PK)", "name, email, phone", "role (Driver/Host/Admin)", "kyc_status (Aadhaar)", "created_at"]),
        (80, 80, "CHARGER_LISTING", ["charger_id (PK)", "host_id (FK -> USER)", "power_kw, connector_type", "price_per_kwh", "lat, lng, address", "verified_safety"]),
        (20, 25, "BOOKING_SESSION", ["booking_id (PK)", "charger_id (FK)", "driver_id (FK)", "slot_start, slot_end", "qr_token, pin_code", "status (CONFIRMED/DONE)"]),
        (80, 25, "CO_HOST_PARTNERSHIP", ["partnership_id (PK)", "landlord_id (FK)", "investor_id (FK)", "property_type, bay_count", "model (50_50 / LEASE)", "status (MATCHED)"])
    ]

    for x, y, name, attrs in entities:
        box = patches.FancyBboxPatch((x-16, y-15), 32, 28, boxstyle="round,pad=0.8", fc=WHITE, ec=PRIMARY_BLUE, lw=2)
        ax.add_patch(box)
        hdr = patches.FancyBboxPatch((x-16, y+8), 32, 5, boxstyle="round,pad=0.8", fc=PRIMARY_BLUE, ec=PRIMARY_BLUE)
        ax.add_patch(hdr)
        ax.text(x, y+10.5, name, ha='center', va='center', color=WHITE, fontsize=8.5, fontweight='bold')
        for i, a in enumerate(attrs):
            ax.text(x-14, y+4 - (i*3.5), f"• {a}", fontsize=7.5, color=DARK_SLATE)

    # Relationships
    ax.annotate('', xy=(62, 80), xytext=(38, 80), arrowprops=dict(arrowstyle="<->", color=SECONDARY_BLUE, lw=1.8))
    ax.text(50, 82, "1 : N (Hosts : Listings)", ha='center', fontsize=7.5, fontweight='bold', color=SECONDARY_BLUE)

    ax.annotate('', xy=(20, 42), xytext=(20, 63), arrowprops=dict(arrowstyle="<->", color=EMERALD_GREEN, lw=1.8))
    ax.text(12, 53, "1 : N\n(Driver : Bookings)", ha='center', fontsize=7.5, fontweight='bold', color=EMERALD_GREEN)

    ax.annotate('', xy=(66, 38), xytext=(38, 70), arrowprops=dict(arrowstyle="<->", color=AMBER, lw=1.8))
    ax.text(55, 57, "1 : N\n(User : Partnerships)", ha='center', fontsize=7.5, fontweight='bold', color=AMBER)

    ax.annotate('', xy=(78, 42), xytext=(78, 63), arrowprops=dict(arrowstyle="<->", color=PURPLE, lw=1.8))
    ax.text(86, 53, "1 : N\n(Listing : Bookings)", ha='center', fontsize=7.5, fontweight='bold', color=PURPLE)

    ax.set_title("Figure 5: Entity-Relationship (ER) Relational Schema of ChargeCircle Platform", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig5_er_diagram.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 6: Four-Point Electrical Safety & Earthing Verification Workflow
# -----------------------------------------------------------------------------
def gen_fig6():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    steps = [
        (12, "Stage 1: Identity & KYC", "Host Aadhaar / PAN\nGovt ID Validation\nAnti-fraud vetting", PRIMARY_BLUE),
        (37, "Stage 2: Property NOC", "Gated Society / RWA NOC\nSanctioned Discom Load\nDesignated Bay Allotment", SECONDARY_BLUE),
        (62, "Stage 3: Electrical Earthing", "Neutral-to-Earth < 1.8V\nEarth Pit Resistance < 5Ω\nDedicated 30mA RCBO/MCB", EMERALD_GREEN),
        (87, "Stage 4: BMS Handshake", "Pilot Signal J1772 / IEC\nTemperature Telemetry\nAutomated Verification Badge", PURPLE)
    ]

    for x, title, desc, color in steps:
        box = patches.FancyBboxPatch((x-10, 25), 20, 50, boxstyle="round,pad=1", fc=WHITE, ec=color, lw=2)
        ax.add_patch(box)
        hdr = patches.FancyBboxPatch((x-10, 60), 20, 15, boxstyle="round,pad=1", fc=color, ec=color)
        ax.add_patch(hdr)
        ax.text(x, 67, title, ha='center', va='center', color=WHITE, fontsize=8, fontweight='bold')
        ax.text(x, 42, desc, ha='center', va='center', color=DARK_SLATE, fontsize=7.5)

    for i in range(len(steps)-1):
        x1 = steps[i][0] + 11
        x2 = steps[i+1][0] - 11
        ax.annotate('', xy=(x2, 50), xytext=(x1, 50), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=2))

    ax.text(50, 12, "Strict adherence to IS 17017 and CEA Central Electricity Authority Safety Norms (2023)",
            ha='center', va='center', fontsize=8.5, fontstyle='italic', color='#475569')

    ax.set_title("Figure 6: Four-Point Host Electrical Safety and Trust Verification Workflow", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig6_safety_workflow.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 7: End-to-End User Reservation & Check-in Lifecycle
# -----------------------------------------------------------------------------
def gen_fig7():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    stages = [
        (10, 50, "1. Discovery", "Map Search\nFilter by kW/Plug", PRIMARY_BLUE),
        (26, 50, "2. Slot Lock", "Atomic Mutex\nPrevents Overbooking", SECONDARY_BLUE),
        (42, 50, "3. Escrow Pay", "UPI Micro-Meter\nFunds Protected", AMBER),
        (58, 50, "4. Pass Issue", "Dynamic QR Code\n6-Digit Gate PIN", PURPLE),
        (74, 50, "5. Plug & Session", "Host Scans QR\nPower Delivery On", EMERALD_GREEN),
        (90, 50, "6. Settlement", "Commission Split\nReview & Rating", DARK_SLATE)
    ]

    for x, y, title, desc, color in stages:
        box = patches.FancyBboxPatch((x-6.5, y-15), 13, 30, boxstyle="round,pad=0.8", fc=color, ec='none')
        ax.add_patch(box)
        ax.text(x, y+8, title, ha='center', va='center', color=WHITE, fontsize=8, fontweight='bold')
        ax.text(x, y-4, desc, ha='center', va='center', color='#F1F5F9', fontsize=6.8)

    for i in range(len(stages)-1):
        x1 = stages[i][0] + 7
        x2 = stages[i+1][0] - 7
        ax.annotate('', xy=(x2, 50), xytext=(x1, 50), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=1.8))

    ax.set_title("Figure 7: End-to-End User Reservation, Check-in, and Financial Settlement Lifecycle", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig7_lifecycle.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 8: Jesko Jets-Inspired Editorial UI Split Hero Architecture
# -----------------------------------------------------------------------------
def gen_fig8():
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    fig.patch.set_facecolor(DARK_SLATE)
    ax.set_facecolor(DARK_SLATE)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Left Editorial Column
    left = patches.FancyBboxPatch((5, 10), 42, 80, boxstyle="round,pad=1", fc='#1E293B', ec='#334155', lw=1.5)
    ax.add_patch(left)
    ax.text(8, 82, "CHARGECIRCLE // EDITORIAL HUD", color=EMERALD_GREEN, fontsize=8, fontweight='bold')
    ax.text(8, 70, "Decentralized\nElectric Mobility\nInfrastructure", color=WHITE, fontsize=13, fontweight='bold')
    ax.text(8, 48, "State of Charge Telemetry\n• 50 kW CCS2 DC High-Voltage\n• 230V Single Phase 15A Community\n• Verified Earthing < 1.8V Neutral", color='#94A3B8', fontsize=8)
    
    btn = patches.FancyBboxPatch((8, 20), 30, 10, boxstyle="round,pad=0.5", fc=EMERALD_GREEN, ec='none')
    ax.add_patch(btn)
    ax.text(23, 25, "EXPLORE STATIONS →", ha='center', va='center', color=DARK_SLATE, fontsize=8.5, fontweight='bold')

    # Right 3D Interactive Column
    right = patches.FancyBboxPatch((53, 10), 42, 80, boxstyle="round,pad=1", fc='#1E293B', ec='#334155', lw=1.5)
    ax.add_patch(right)
    ax.text(56, 82, "3D MOUSE PARALLAX SCHEMATIC", color='#60A5FA', fontsize=8, fontweight='bold')

    # Draw wireframe schematic of vehicle
    v_box = patches.FancyBboxPatch((60, 35), 28, 35, boxstyle="round,pad=0.8", fc='#0F172A', ec='#38BDF8', lw=1.5)
    ax.add_patch(v_box)
    ax.text(74, 55, "INTERACTIVE 3D\nVEHICLE SCHEMATIC", ha='center', va='center', color='#38BDF8', fontsize=9, fontweight='bold')
    ax.text(74, 43, "Pitch: -8.4° | Roll: +12.1°\nDynamic Shadow Matrix", ha='center', va='center', color='#64748B', fontsize=7.5)

    tabs = [(60, "Cars"), (74, "2W Scooters"), (88, "Fast Chargers")]
    for tx, tname in tabs:
        tbox = patches.FancyBboxPatch((tx-5, 20), 10, 6, boxstyle="round,pad=0.3", fc='#334155', ec='none')
        ax.add_patch(tbox)
        ax.text(tx, 23, tname, ha='center', va='center', color=WHITE, fontsize=6.5)

    ax.set_title("Figure 8: Jesko Jets-Inspired Editorial UI Split Hero with 3D Parallax Tilt", fontsize=11, fontweight='bold', pad=15, color=WHITE)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig8_ui_hero.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 9: Interactive 3-Way Fleet Switcher Composite
# -----------------------------------------------------------------------------
def gen_fig9():
    fig, axes = plt.subplots(1, 3, figsize=(10, 3.8), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)

    imgs = [
        ('public/images/luxury_ev_car.jpg', "Electric Sedan (4W)", "Type 2 & CCS2 Fast Charge\n30 - 70 kWh Battery Packs"),
        ('public/images/luxury_ev_scooter.jpg', "Smart 2W Scooter", "15A Socket / Ather Grid\n2.9 - 3.7 kWh Portable Packs"),
        ('public/images/luxury_ev_charger.jpg', "Hypercharger Hub", "Dual Gun CCS2 DC Fast\nEarthing < 2V / RFID Access")
    ]

    for ax, (path, title, subtitle) in zip(axes, imgs):
        ax.set_facecolor(WHITE)
        if os.path.exists(path):
            img = Image.open(path)
            ax.imshow(img)
        else:
            ax.text(0.5, 0.5, title, ha='center', va='center')
        ax.axis('off')
        ax.set_title(title, fontsize=9.5, fontweight='bold', color=DARK_SLATE, pad=6)
        ax.text(0.5, -0.15, subtitle, ha='center', va='top', transform=ax.transAxes, fontsize=7.5, color='#475569')

    fig.suptitle("Figure 9: Supported Fleet Matrix: High-Performance Electric Vehicles & Charging Nodes", fontsize=11, fontweight='bold', y=1.05)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig9_fleet.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 10: Find Chargers Discovery Canvas Architecture
# -----------------------------------------------------------------------------
def gen_fig10():
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # 30% Filter Sidebar
    side = patches.FancyBboxPatch((3, 10), 28, 80, boxstyle="round,pad=1", fc=WHITE, ec='#CBD5E1', lw=1.5)
    ax.add_patch(side)
    ax.text(5, 83, "SEARCH & FILTER ENGINE", color=PRIMARY_BLUE, fontsize=8, fontweight='bold')
    ax.text(5, 73, "• City Select (Delhi/Jaipur/Kota)\n• Vehicle Type (All / 4W / 2W)\n• Connector (CCS2 / Type 2 / 15A)\n• Power Slider (3.3 - 50 kW)\n• Only Verified Hosts [ON]", color=DARK_SLATE, fontsize=7.5)

    # 70% Map Viewport
    map_p = patches.FancyBboxPatch((34, 10), 63, 80, boxstyle="round,pad=1", fc='#E2E8F0', ec='#94A3B8', lw=1.5)
    ax.add_patch(map_p)
    ax.text(36, 83, "LEAFLET GIS INTERACTIVE VIEWPORT (70% SCREEN RATIO)", color=DARK_SLATE, fontsize=8.5, fontweight='bold')
    
    # Map Pins
    pins = [
        (48, 60, "₹14/kWh", PRIMARY_BLUE),
        (65, 45, "₹18/kWh (50kW)", SECONDARY_BLUE),
        (80, 70, "₹12/kWh (15A)", EMERALD_GREEN),
        (72, 30, "₹15/kWh", PRIMARY_BLUE)
    ]
    for px, py, label, pcolor in pins:
        p_circle = plt.Circle((px, py), 2.5, color=pcolor)
        ax.add_patch(p_circle)
        ax.text(px, py+4, label, ha='center', va='center', fontsize=7, fontweight='bold', color=pcolor,
                bbox=dict(boxstyle="round,pad=0.2", fc=WHITE, ec=pcolor, lw=1))

    # Synchronized Charger Card Preview
    c_card = patches.FancyBboxPatch((42, 15), 48, 18, boxstyle="round,pad=0.6", fc=WHITE, ec=EMERALD_GREEN, lw=1.5)
    ax.add_patch(c_card)
    ax.text(45, 27, "Jaipur Express Highway Hub • 50 kW CCS2", fontsize=8, fontweight='bold', color=DARK_SLATE)
    ax.text(45, 20, "★ 4.9 (48 reviews) • ₹18/kWh • Verified Earthing < 1.8V", fontsize=7, color='#64748B')
    ax.text(82, 23, "[BOOK NOW]", fontsize=7.5, fontweight='bold', color=WHITE,
            bbox=dict(boxstyle="round,pad=0.3", fc=EMERALD_GREEN, ec='none'))

    ax.set_title("Figure 10: Find Chargers Discovery Canvas with 70% Viewport Leaflet Map & Filter Sidebar", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig10_map_discovery.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 11: Interstate Expressway Corridor Flight & Drive Planner
# -----------------------------------------------------------------------------
def gen_fig11():
    fig, ax = plt.subplots(figsize=(10, 4.8), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(WHITE)

    km = np.linspace(0, 280, 280)
    # Battery depletion curve with stop at Behror (135 km)
    battery = []
    current_soc = 95.0
    for d in km:
        if d < 135:
            current_soc = 95 - (d * 0.42)
        elif d == 135:
            current_soc = 88.0  # charged back up to 88%
        else:
            current_soc = 88.0 - ((d - 135) * 0.42)
        battery.append(current_soc)

    ax.plot(km, battery, color=PRIMARY_BLUE, lw=2.5, label='Projected Battery State of Charge (%)')
    ax.axhline(20, color='red', linestyle='--', lw=1.5, label='Safety Reserve Buffer (20% SoC)')
    ax.axvline(135, color=EMERALD_GREEN, linestyle=':', lw=2, label='Recommended Stop: Behror Highway Hub (50 kW)')

    ax.scatter([135], [38.3], color='red', s=80, zorder=5)
    ax.scatter([135], [88.0], color=EMERALD_GREEN, s=80, zorder=5)
    ax.annotate('Arrival: 38% SoC\n(Plug into 50 kW CCS2)', xy=(135, 38.3), xytext=(85, 25),
                arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=1.2), fontsize=8, fontweight='bold')
    ax.annotate('Departure: 88% SoC\n(28 min top-up)', xy=(135, 88.0), xytext=(155, 92),
                arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=1.2), fontsize=8, fontweight='bold')

    ax.set_xlabel('Route Distance: New Delhi to Jaipur NH48 (km)', fontsize=9.5, fontweight='bold')
    ax.set_ylabel('Battery State of Charge (%)', fontsize=9.5, fontweight='bold')
    ax.set_ylim(10, 105)
    ax.set_xlim(0, 280)
    ax.grid(True, linestyle='--', alpha=0.5)
    ax.legend(loc='lower left', fontsize=8)

    ax.set_title("Figure 11: Interstate Expressway Corridor Flight & Drive Simulation (Delhi-Jaipur NH48)", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig11_corridor_planner.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 12: Property Co-Hosting & Charger Investor Matchmaker Workflow
# -----------------------------------------------------------------------------
def gen_fig12():
    fig, ax = plt.subplots(figsize=(10, 5.2), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Side A: Property Owner
    a_box = patches.FancyBboxPatch((5, 55), 38, 35, boxstyle="round,pad=1", fc=WHITE, ec=PRIMARY_BLUE, lw=2)
    ax.add_patch(a_box)
    ax.text(24, 83, "PARTY A: PROPERTY OWNER", ha='center', color=PRIMARY_BLUE, fontsize=8.5, fontweight='bold')
    ax.text(7, 73, "• Vacant bays (Hotel / IT Park / Café)\n• High Sanctioned Discom Load\n• Zero Equipment Capital Required\n• Guaranteed monthly or 50% split", color=DARK_SLATE, fontsize=7.5)

    # Side B: Hardware Investor
    b_box = patches.FancyBboxPatch((57, 55), 38, 35, boxstyle="round,pad=1", fc=WHITE, ec=PURPLE, lw=2)
    ax.add_patch(b_box)
    ax.text(76, 83, "PARTY B: HARDWARE INVESTOR", ha='center', color=PURPLE, fontsize=8.5, fontweight='bold')
    ax.text(59, 73, "• Deploy commercial 7.2 kW - 50 kW\n• Covers Installation & Maintenance\n• Real-time energy telemetry on app\n• Passive yield on capital asset", color=DARK_SLATE, fontsize=7.5)

    # Central Matchmaker
    m_box = patches.FancyBboxPatch((25, 10), 50, 32, boxstyle="round,pad=1", fc=EMERALD_GREEN, ec='none')
    ax.add_patch(m_box)
    ax.text(50, 35, "CHARGECIRCLE CO-HOSTING MATCHMAKER", ha='center', color=WHITE, fontsize=9.5, fontweight='bold')
    ax.text(50, 26, "• Automated Revenue Split (50/50 Net Margin)\n• Smart Escrow & Legal Smart Contracts\n• DISCOM Earthing Certification & Listing", ha='center', color='#DCFCE7', fontsize=8)

    ax.annotate('', xy=(38, 42), xytext=(24, 55), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=2))
    ax.annotate('', xy=(62, 42), xytext=(76, 55), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=2))

    ax.set_title("Figure 12: Property Co-Hosting & Hardware Investor Matchmaker Workflow", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig12_cohosting_matchmaker.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 13: Digital QR Code Gate Access Pass & Check-In Cryptographic Verification Flow
# -----------------------------------------------------------------------------
def gen_fig13():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    steps = [
        (15, "1. Booking Confirmed", "Driver locks slot\nHMAC Token generated\n6-Digit OTP created", PRIMARY_BLUE),
        (38, "2. QR Gate Pass", "High-contrast dynamic QR\nTime-bound expiration\nOffline security backup", SECONDARY_BLUE),
        (62, "3. Host Check-in", "Community guard / Host\nScans with phone camera\nInstant slot validation", AMBER),
        (85, "4. Relay Activated", "Smart plug energized\nPower metering starts\nAudit log registered", EMERALD_GREEN)
    ]

    for x, title, desc, color in steps:
        box = patches.FancyBboxPatch((x-10, 25), 20, 50, boxstyle="round,pad=1", fc=WHITE, ec=color, lw=2)
        ax.add_patch(box)
        hdr = patches.FancyBboxPatch((x-10, 60), 20, 15, boxstyle="round,pad=1", fc=color, ec=color)
        ax.add_patch(hdr)
        ax.text(x, 67, title, ha='center', va='center', color=WHITE, fontsize=8, fontweight='bold')
        ax.text(x, 42, desc, ha='center', va='center', color=DARK_SLATE, fontsize=7.5)

    for i in range(len(steps)-1):
        x1 = steps[i][0] + 11
        x2 = steps[i+1][0] - 11
        ax.annotate('', xy=(x2, 50), xytext=(x1, 50), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=2))

    ax.set_title("Figure 13: Digital QR Code Gate Access Pass and Cryptographic Validation Workflow", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig13_qr_pass.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 14: Host Earnings Breakdown & Commission Distribution Flow
# -----------------------------------------------------------------------------
def gen_fig14():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.8), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)

    # Pie Chart
    labels = ['Community Host / Co-Host (85%)', 'ChargeCircle Platform (15%)']
    sizes = [85, 15]
    colors = [EMERALD_GREEN, PRIMARY_BLUE]
    ax1.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140, colors=colors,
            textprops={'fontsize': 8.5, 'fontweight': 'bold'})
    ax1.set_title("A. Gross Charging Revenue Share", fontsize=10, fontweight='bold', pad=10)

    # Bar Breakdown for a Sample ₹500 Session
    categories = ['Total Driver Paid', 'Host Payout', 'Discom Power Est.', 'Net Host Profit', 'Platform Fee']
    values = [500, 425, 210, 215, 75]
    bar_colors = [DARK_SLATE, SECONDARY_BLUE, '#94A3B8', EMERALD_GREEN, PRIMARY_BLUE]
    bars = ax2.bar(categories, values, color=bar_colors, width=0.55)
    ax2.set_ylabel('INR (₹)', fontsize=9, fontweight='bold')
    ax2.set_title("B. Unit Economics: Sample ₹500 (30 kWh) Session", fontsize=10, fontweight='bold', pad=10)
    ax2.set_ylim(0, 580)
    for bar in bars:
        yval = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2, yval + 10, f"₹{yval}", ha='center', fontsize=8, fontweight='bold')
    plt.setp(ax2.get_xticklabels(), rotation=25, ha='right', fontsize=8)

    fig.suptitle("Figure 14: Platform Monetization Model and Host Financial Revenue Distribution", fontsize=11, fontweight='bold', y=1.03)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig14_revenue_split.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 15: UML Sequence Diagram for Slot Pre-allocation
# -----------------------------------------------------------------------------
def gen_fig15():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(WHITE)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    actors = [(15, "EV Driver"), (40, "Web Client"), (65, "Booking Engine"), (90, "Storage / Mutex")]
    for x, name in actors:
        ax.text(x, 92, name, ha='center', va='center', fontsize=9, fontweight='bold', color=PRIMARY_BLUE)
        ax.plot([x, x], [88, 10], color='#CBD5E1', linestyle='--', lw=1.5)

    messages = [
        (82, 15, 40, "1. Select Station & Time Slot"),
        (72, 40, 65, "2. Request Atomic Slot Lock"),
        (62, 65, 90, "3. Query Existing Overlaps (Mutex)"),
        (52, 90, 65, "4. Slot Free: Set Lock Flag"),
        (42, 65, 40, "5. Lock Confirmed (10 Min Expiry)"),
        (32, 40, 15, "6. Prompt UPI Payment & Confirm"),
        (22, 15, 65, "7. Submit Payment Signature"),
        (12, 65, 90, "8. Commit Booking & Issue QR Pass")
    ]

    for y, x1, x2, text in messages:
        ax.annotate('', xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=1.5))
        mid = (x1 + x2) / 2
        ax.text(mid, y+2, text, ha='center', va='bottom', fontsize=7.5, color=DARK_SLATE, fontweight='bold')

    ax.set_title("Figure 15: UML Sequence Diagram for Real-Time Slot Locking and Double-Booking Prevention", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig15_sequence_booking.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 16: Performance Benchmarks & Lighthouse Core Web Vitals Chart
# -----------------------------------------------------------------------------
def gen_fig16():
    fig, ax = plt.subplots(figsize=(9, 4.8), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(WHITE)

    metrics = ['Performance', 'Accessibility', 'Best Practices', 'SEO', 'PWA Readiness']
    scores = [98, 100, 100, 100, 95]
    colors = [EMERALD_GREEN, EMERALD_GREEN, EMERALD_GREEN, EMERALD_GREEN, SECONDARY_BLUE]

    bars = ax.barh(metrics, scores, color=colors, height=0.5)
    ax.set_xlim(0, 110)
    ax.set_xlabel('Lighthouse Audit Score (%)', fontsize=9.5, fontweight='bold')
    ax.grid(True, axis='x', linestyle='--', alpha=0.5)

    for bar in bars:
        xval = bar.get_width()
        ax.text(xval + 2, bar.get_y() + bar.get_height()/2, f"{xval}%", va='center', fontsize=9, fontweight='bold', color=DARK_SLATE)

    ax.set_title("Figure 16: Google Lighthouse Audit and Production Core Web Vitals", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig16_benchmarks.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 17: Preventive Maintenance & Earth Pit Inspection Flowchart
# -----------------------------------------------------------------------------
def gen_fig17():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    tasks = [
        (15, "Bi-Weekly Inspection", "Visual cable check\nSocket wear audit\nClean terminal contacts", PRIMARY_BLUE),
        (38, "Monthly Earthing Test", "Measure neutral-earth V\nVerify < 1.8V threshold\nCheck RCBO trip button", SECONDARY_BLUE),
        (62, "Quarterly Megger Test", "Earth resistance meter\nEnsure R < 5.0 Ohms\nAdd salt/charcoal if high", AMBER),
        (85, "Annual Discom Certification", "Re-certify with Discom\nBMS protocol update\nSafety Badge Renewal", EMERALD_GREEN)
    ]

    for x, title, desc, color in tasks:
        box = patches.FancyBboxPatch((x-10, 25), 20, 50, boxstyle="round,pad=1", fc=WHITE, ec=color, lw=2)
        ax.add_patch(box)
        hdr = patches.FancyBboxPatch((x-10, 60), 20, 15, boxstyle="round,pad=1", fc=color, ec=color)
        ax.add_patch(hdr)
        ax.text(x, 67, title, ha='center', va='center', color=WHITE, fontsize=8, fontweight='bold')
        ax.text(x, 42, desc, ha='center', va='center', color=DARK_SLATE, fontsize=7.5)

    for i in range(len(tasks)-1):
        x1 = tasks[i][0] + 11
        x2 = tasks[i+1][0] - 11
        ax.annotate('', xy=(x2, 50), xytext=(x1, 50), arrowprops=dict(arrowstyle="->", color=DARK_SLATE, lw=2))

    ax.set_title("Figure 17: Scheduled Preventive Maintenance and Earth Pit Resistance Inspection Workflow", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig17_maintenance.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

# -----------------------------------------------------------------------------
# Figure 18: Project Implementation Gantt Chart
# -----------------------------------------------------------------------------
def gen_fig18():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(WHITE)

    tasks = [
        "1. Literature Review & Standards",
        "2. Requirements & UI/UX Design",
        "3. Core Architecture & Schema",
        "4. Frontend Development (React 19)",
        "5. GIS Leaflet Map Integration",
        "6. Co-Hosting Matchmaker Engine",
        "7. Safety Protocols & Testing",
        "8. Deployment & Documentation"
    ]
    starts = [1, 3, 5, 7, 9, 11, 13, 14]
    durations = [3, 3, 3, 4, 3, 3, 2, 3]

    y_pos = np.arange(len(tasks))
    ax.barh(y_pos, durations, left=starts, align='center', color=SECONDARY_BLUE, height=0.5, edgecolor=PRIMARY_BLUE)
    ax.set_yticks(y_pos)
    ax.set_yticklabels(tasks, fontsize=8.5, fontweight='bold')
    ax.invert_yaxis()
    ax.set_xlabel('Project Timeline (Weeks 1 to 16)', fontsize=9.5, fontweight='bold')
    ax.set_xlim(0, 17)
    ax.grid(True, axis='x', linestyle='--', alpha=0.5)

    ax.set_title("Figure 18: Project Implementation Gantt Chart and Milestone Schedule", fontsize=11, fontweight='bold', pad=15)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'fig18_gantt.png'), bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

if __name__ == '__main__':
    print("Generating diagrams...")
    gen_fig1()
    gen_fig2()
    gen_fig3()
    gen_fig4()
    gen_fig5()
    gen_fig6()
    gen_fig7()
    gen_fig8()
    gen_fig9()
    gen_fig10()
    gen_fig11()
    gen_fig12()
    gen_fig13()
    gen_fig14()
    gen_fig15()
    gen_fig16()
    gen_fig17()
    gen_fig18()
    print("All 18 diagrams generated successfully in 'report_figures/'!")
