import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import { Search, Play, Square, RotateCw, Navigation, Clock, MapPin } from 'lucide-react';
import { clsx } from "clsx";  //eslint-disable-line
import { twMerge } from "tailwind-merge";   //eslint-disable-line
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socketService from "../services/socket";
import { publicAPI } from "../services/api";
import { cn } from "../utils/util";   //eslint-disable-line


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const busIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="24" height="16" rx="2" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
      <circle cx="8" cy="24" r="3" fill="#1E40AF"/>
      <circle cx="24" cy="24" r="3" fill="#1E40AF"/>
      <rect x="6" y="10" width="20" height="8" fill="#EFF6FF"/>
    </svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const FlyMarker = ({ position, children }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 0.5 });
    }
  }, [position, map]);
  return (
    <Marker position={position} icon={busIcon}>
      {children}
    </Marker>
  );
};

const PublicTracking = () => {
  const { parcelId } = useParams();
  const [busId, setBusId] = useState(parcelId || "");
  const [busLocation, setBusLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);
  const [nid, setNid] = useState("");
  const refreshLocation = async (id = busId) => {
    if (!id) return setError("Enter Bus ID first");
    try {
      const res = await publicAPI.getBusLocationtracking(id);
      if (res?.data?.success && res.data.location) {
        const loc = res.data.location;
        setBusLocation([loc.lat, loc.lon]);
        setLastUpdate(new Date(loc.timestamp).toLocaleTimeString());
        setError("");
      } else {
        setError("Bus not found or no live location yet");
      }
    } catch (err) {
      console.error("Error in refreshLocation:", err);
      setError("Failed to get bus location");
    }
  };

  const startTracking = async () => {
    if (!nid&&!busId) return setError("Enter a valid Bus ID first");
    setError("");
    if(nid) setBusId(nid);
    socketService.connect();
    socketService.emit("joinBusRoom", { busId });
    console.log("Joined bus room:", busId);

    const handleLocation = (loc) => {
      if (loc?.lat && loc?.lon) {
        setBusLocation([loc.lat, loc.lon]);
        setLastUpdate(new Date(loc.timestamp).toLocaleTimeString());
      }
    };

    socketService.on("bus:location", handleLocation);

    intervalRef.current = setInterval(() => refreshLocation(busId), 10000);

    await refreshLocation(busId);
    setTracking(true);
  };

  const stopTracking = () => {
    setTracking(false);
    clearInterval(intervalRef.current);
    socketService.emit("leaveBusRoom", { busId });
    socketService.off("bus:location");
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      socketService.off("bus:location");
    };
  }, []);

  const center = busLocation || [12.9716, 77.5946];

return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-white/20 overflow-hidden">
      
      <div className="w-96 shrink-0 flex flex-col border-r border-white/10 bg-black relative z-20">
        
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
              <Navigation size={16} className="text-white" />
            </div>
            <h2 className="text-xl font-medium font-serif text-white tracking-tight">
             Public Bus Tracking
            </h2>
          </div>
          <p className="text-xs text-zinc-500">Monitor public transport in real-time using busId.</p>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-2 block uppercase tracking-wider">Configuration</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Enter Bus ID..."
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {!tracking ? (
              <button
                onClick={startTracking}
                className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <Play size={14} /> Start
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <Square size={14} /> Stop
              </button>
            )}
            
            <button
              onClick={() => refreshLocation()}
              className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/10 text-zinc-200 border border-white/10 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <RotateCw size={14} /> Refresh
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="bg-white/[0.02] px-4 py-2 border-b border-white/10 flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-400">Live Coordinates</span>
              {tracking && (
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
              )}
            </div>
            
            <div className="p-4 space-y-4">
              {busLocation ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <MapPin size={14} />
                      <span className="text-xs">Coordinates</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-white">{busLocation[0].toFixed(6)}</div>
                      <div className="font-mono text-sm text-zinc-500">{busLocation[1].toFixed(6)}</div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-white/5" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock size={14} />
                      <span className="text-xs">Last Update</span>
                    </div>
                    <span className="font-mono text-xs text-zinc-300 bg-white/5 px-2 py-1 rounded">
                      {lastUpdate}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-zinc-600 gap-2">
                  <Navigation size={24} className="opacity-20" />
                  <span className="text-xs">Waiting for data...</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative bg-zinc-900">
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay bg-black/20"></div>
        
        <MapContainer
          center={center}
          zoom={16}
          className="h-full w-full z-10"
          style={{ background: '#242424' }} 
        >
          <TileLayer
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            className="map-tiles" 
          />
          
          {busLocation && (
            <FlyMarker position={busLocation}>
              <Popup className="custom-popup">
                <div className="text-sm">
                  <strong className="block mb-1 text-zinc-900">Bus ID: {busId}</strong>
                  <span className="text-zinc-600 text-xs">Last: {lastUpdate}</span>
                </div>
              </Popup>
            </FlyMarker>
          )}
        </MapContainer>
      </div>

      <style>{`
        .leaflet-layer {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        /* Fix popup close button in dark mode map */
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: white;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default PublicTracking;
