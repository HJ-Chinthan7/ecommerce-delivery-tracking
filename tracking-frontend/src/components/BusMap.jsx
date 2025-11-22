import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../AuthContext/BusAuthContext";
import socketService from "../services/socket";
import { MapPin, Navigation, Activity, Play, Square, Eye, EyeOff, RefreshCw, LocateFixed } from 'lucide-react';
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
    btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="16" rx="2" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
        <circle cx="8" cy="24" r="3" fill="#1E40AF"/>
        <circle cx="24" cy="24" r="3" fill="#1E40AF"/>
        <rect x="6" y="10" width="20" height="8" fill="#EFF6FF"/>
        <rect x="8" y="12" width="4" height="4" fill="#3B82F6"/>
        <rect x="14" y="12" width="4" height="4" fill="#3B82F6"/>
        <rect x="20" y="12" width="4" height="4" fill="#3B82F6"/>
      </svg>
    `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const FlyMarker = ({ position, icon, children }) => {
  const map = useMap();
  useEffect(() => {
    if (position)
      map.flyTo(position, map.getZoom(), { duration: 1, easeLinearity: 0.1 });
  }, [position, map]);

  return (
    <Marker position={position} icon={icon}>
      {children}
    </Marker>
  );
};

const BusMap = ({ tracking, setTracking, showAll, setShowAll, bus, route }) => {//eslint-disable-line
  
  const { driver, location } = useAuth();
  const [busLocation, setBusLocation] = useState(location || null);
  const [allBuses, setAllBuses] = useState({});
  const mapRef = useRef();

  useEffect(() => {
    if (!tracking || !driver) return;
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = [pos.coords.latitude, pos.coords.longitude];
            setBusLocation(loc);
            if (socketService.socket && driver?.bus?.busId)
              socketService.emit("updateBusLocation", {
                busId: driver?.bus?._id,
                lat: loc[0],
                lon: loc[1],
              });
          },
          (err) => {
            console.error("Error getting location:", err);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [tracking, driver]);

  useEffect(() => {
    if (!driver) return;

    socketService.on("bus:location", (loc) => {
      if (!showAll) {
        setBusLocation({ lat: loc.lat, lon: loc.lon });
        mapRef.current?.flyTo([loc.lat, loc.lon], 18, { duration: 0.5 });
      }
    });

    socketService.on("buses:all", (buses) => {
      if (showAll) {
        setAllBuses(buses);
      }
    });

    return () => {
      socketService.off("bus:location");
      socketService.off("buses:all");
    };
  }, [driver, showAll]);

  useEffect(() => {
    if (showAll) {
      socketService.joinAllBuses();
    } else {
      socketService.leaveAllBuses();
    }
    return () => socketService.leaveAllBuses();
  }, [showAll]);

  const handleStart = () => setTracking(true);
  const handleStop = () => setTracking(false);

  const center = busLocation || [12.9716, 77.5946];

return (
    <div className="flex flex-col lg:flex-row h-full gap-6 w-full">
      
  
      <div className="relative w-full h-[50vh] lg:h-auto lg:flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 order-1 [&_.leaflet-tile-pane]:filter [&_.leaflet-tile-pane]:invert-[1] [&_.leaflet-tile-pane]:brightness-[0.6] [&_.leaflet-tile-pane]:hue-rotate-[180deg] [&_.leaflet-tile-pane]:grayscale-[0.8]">
        <MapContainer
          center={center}
          zoom={18}
          className="h-full w-full z-0 bg-zinc-900" 
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {(!showAll || Object.entries(allBuses).length === 0) &&
            busLocation && (
              <FlyMarker position={busLocation} icon={busIcon}>
                <Popup className="custom-popup-dark">
                  <div className="text-sm font-sans min-w-[150px]">
                    <p className="font-bold text-zinc-900 mb-1">Bus: {bus?.busId || "N/A"}</p>
                    <div className="text-xs text-zinc-600 space-y-0.5">
                      <p>Route: {bus?.RouteName || "N/A"}</p>
                      <p>Stop: {bus?.currentBusStop?.name || "N/A"}</p>
                      <p>Next: {bus?.nextBusStop?.name || "N/A"}</p>
                    </div>
                  </div>
                </Popup>
              </FlyMarker>
            )}
            
          {showAll &&
            Object.entries(allBuses).map(([busId, pos]) => (
              <Marker key={busId} position={[pos.lat, pos.lon]} icon={busIcon}>
                <Popup className="custom-popup-dark">
                   <div className="text-sm font-sans">
                      <p className="font-bold text-zinc-900">Bus Network</p>
                      <p className="text-xs text-zinc-600 mt-1">
                        Updated: {new Date(pos.timestamp).toLocaleTimeString()}
                      </p>
                   </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        <div className="absolute top-4 right-4 z-[400] pointer-events-none">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-lg ${
            tracking 
              ? "bg-green-500/90 border-green-400 text-white" 
              : "bg-black/70 border-white/10 text-zinc-400"
          }`}>
            <div className={`w-2 h-2 rounded-full ${tracking ? 'bg-white animate-pulse' : 'bg-zinc-500'}`} />
            <span className="text-xs font-medium font-mono">
              {tracking ? "LIVE TRACKING" : "OFFLINE"}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 order-2 pb-20 lg:pb-0">
        
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
            <Activity className={tracking ? "text-green-400" : "text-zinc-500"} size={18} />
            <h2 className="text-base font-medium text-white">System Status</h2>
          </div>
          
          {busLocation || location ? (
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                  <span className="flex items-center gap-1"><LocateFixed size={12}/> Coordinates</span>
                  <span className="font-mono text-zinc-300">
                    {busLocation 
                      ? `${busLocation[0]?.toFixed(4)}, ${busLocation[1]?.toFixed(4)}` 
                      : (busLocation?.lat ? `${busLocation.lat.toFixed(4)}, ...` : "Waiting...")}
                  </span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mt-2">
                   <div className={`h-full w-full rounded-full ${tracking ? 'bg-green-500 animate-[shimmer_2s_infinite]' : 'bg-zinc-700'}`} />
                </div>
              </div>

              <div className="pt-2">
                {!tracking ? (
                  <button
                    onClick={handleStart}
                    className="w-full group relative overflow-hidden bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Start Journey</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="w-full group bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 hover:text-red-300 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Square size={18} fill="currentColor" />
                    <span>Stop Tracking</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Navigation className="mx-auto text-zinc-600 mb-2 animate-bounce" size={24} />
              <p className="text-zinc-500 text-sm mb-4">GPS Signal Lost</p>
              <button
                onClick={handleStart}
                className="w-full bg-white text-black font-medium py-2.5 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                <span>Reconnect GPS</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-lg flex-1 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-blue-400" size={18} />
            <h2 className="text-base font-medium text-white">View Options</h2>
          </div>
          
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all border flex items-center justify-between group ${
              showAll 
                ? "bg-blue-500/10 border-blue-500/50 text-blue-300" 
                : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              {showAll ? <Eye size={18} /> : <EyeOff size={18} />}
              {showAll ? "All Bus View" : " My Bus"}
            </span>
            <div className={`w-2 h-2 rounded-full ${showAll ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "bg-zinc-600"}`} />
          </button>
          
          <p className="text-[10px] text-zinc-600 mt-4 text-center leading-relaxed">
            Toggle to see other buses on the route network or focus solely on your current path.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusMap;
