import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Plus, 
  Minus, 
  Maximize2, 
  Layers, 
  MapPin, 
  Crosshair,
  Sparkles
} from 'lucide-react';
import { Charger } from '../types';
import { BRAND_CONFIG } from '../config/brand';

interface MapLeafletProps {
  chargers: Charger[];
  selectedChargerId?: string;
  onSelectCharger: (charger: Charger) => void;
  onBookCharger?: (charger: Charger) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  showCityJumpBar?: boolean;
  onCitySelect?: (cityName: string) => void;
}

export const MapLeaflet: React.FC<MapLeafletProps> = ({
  chargers,
  selectedChargerId,
  onSelectCharger,
  onBookCharger,
  center = [12.9716, 77.5946], // Default Bengaluru coordinates
  zoom = 12,
  className = "w-full h-full min-h-[500px]",
  showCityJumpBar = true,
  onCitySelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [isLocating, setIsLocating] = useState(false);

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Prevent "Map container is already initialized" error
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false
      });

      // High contrast crisp OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Invalidate map size multiple times to ensure full coverage on all layout changes
    requestAnimationFrame(() => map.invalidateSize());
    const t1 = setTimeout(() => map.invalidateSize(), 60);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Create markers for chargers
    chargers.forEach(charger => {
      const isSelected = charger.id === selectedChargerId;
      const isAvailable = charger.isAvailableNow;

      const iconHtml = `
        <div class="relative group cursor-pointer transform transition-all duration-300 hover:scale-125 ${
          isSelected ? 'scale-125 z-50' : 'z-20'
        }">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xl border-2 font-black text-xs transition-colors ${
            isSelected
              ? 'bg-slate-900 text-white border-emerald-400 ring-4 ring-emerald-400/40'
              : isAvailable
              ? 'bg-white text-emerald-800 border-emerald-600 shadow-emerald-950/20'
              : 'bg-slate-100 text-slate-500 border-slate-300'
          }">
            <svg class="w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span class="tracking-tight">${BRAND_CONFIG.currency}${charger.pricingPerKwh}</span>
          </div>
          <div class="w-2.5 h-2.5 ${isSelected ? 'bg-slate-900 border-b border-r border-emerald-400' : 'bg-white border-b-2 border-r-2 border-emerald-600'} rotate-45 mx-auto -mt-1.5 shadow-sm"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-ev-marker',
        iconSize: [70, 40],
        iconAnchor: [35, 38],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([charger.lat, charger.lng], { icon: customIcon }).addTo(map);

      // Popup content
      const popupHtml = `
        <div class="w-64 p-1">
          <div class="relative h-28 w-full rounded-xl overflow-hidden mb-2">
            <img src="${charger.images[0]}" alt="${charger.name}" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              ${charger.powerRatingKw} kW · ${charger.speedCategory.toUpperCase()}
            </div>
            <div class="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              ★ ${charger.rating > 0 ? charger.rating.toFixed(1) : 'New'}
            </div>
          </div>
          <h4 class="font-bold text-sm text-slate-900 line-clamp-1 mb-0.5">${charger.name}</h4>
          <p class="text-xs text-slate-500 line-clamp-1 mb-2">📍 ${charger.landmark}, ${charger.city}</p>
          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span class="text-[11px] text-slate-400">Rate:</span>
              <span class="text-sm font-extrabold text-emerald-600"> ${BRAND_CONFIG.currency}${charger.pricingPerKwh}</span>
              <span class="text-[10px] text-slate-500">/kWh</span>
            </div>
            <button id="btn-popup-book-${charger.id}" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95">
              Book Slot
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectCharger(charger);
      });

      marker.on('popupopen', () => {
        const bookBtn = document.getElementById(`btn-popup-book-${charger.id}`);
        if (bookBtn && onBookCharger) {
          bookBtn.onclick = (e) => {
            e.stopPropagation();
            onBookCharger(charger);
          };
        }
      });

      markersRef.current[charger.id] = marker;
    });

    // If a charger is selected, pan to it and open its popup
    if (selectedChargerId && markersRef.current[selectedChargerId]) {
      const selectedMarker = markersRef.current[selectedChargerId];
      const targetCharger = chargers.find(c => c.id === selectedChargerId);
      if (targetCharger) {
        map.flyTo([targetCharger.lat, targetCharger.lng], 14, { duration: 0.7 });
        selectedMarker.openPopup();
      }
    } else if (chargers.length > 0 && !selectedChargerId) {
      const group = L.featureGroup(Object.values(markersRef.current));
      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds().pad(0.12));
      }
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [chargers, selectedChargerId, center]);

  // Teardown Leaflet instance completely when unmounting
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle ResizeObserver to keep map crisp whenever layout mode changes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Map Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
          }
        },
        () => {
          // Fallback to Bengaluru center
          setIsLocating(false);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([12.9716, 77.5946], 13);
          }
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleFitAll = () => {
    if (mapInstanceRef.current && Object.values(markersRef.current).length > 0) {
      const group = L.featureGroup(Object.values(markersRef.current));
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
    }
  };

  return (
    <div 
      className={`relative isolate rounded-3xl overflow-hidden border border-slate-200 shadow-md ${className}`}
      style={{ minHeight: '520px', width: '100%', height: '100%' }}
    >
      
      {/* The Leaflet Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full absolute inset-0 z-0" 
        style={{ width: '100%', height: '100%', minHeight: '520px' }}
      />

      {/* Floating Header Badge - Isolated strictly inside map */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-xs font-bold text-slate-800 flex items-center gap-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{chargers.length} Active Stations</span>
        </div>

        {showCityJumpBar && onCitySelect && (
          <div className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 shadow-md pointer-events-auto">
            {['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune'].map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={() => onCitySelect(cityName)}
                className="px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {cityName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Right Controls (Zoom, GPS Locate, Fit Bounds) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
        
        {/* GPS Locate Me */}
        <button
          type="button"
          onClick={handleLocateMe}
          title="Locate My Position"
          className="w-10 h-10 rounded-2xl bg-white shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all active:scale-95"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'text-emerald-600 animate-spin' : 'text-slate-700'}`} />
        </button>

        {/* Fit All Markers */}
        <button
          type="button"
          onClick={handleFitAll}
          title="Fit All Chargers"
          className="w-10 h-10 rounded-2xl bg-white shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Zoom In & Out */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center border-b border-slate-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
