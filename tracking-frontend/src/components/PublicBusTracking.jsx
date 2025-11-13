import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socketService from "../services/socket";
import { publicAPI } from "../services/api";

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

const FlyMarker = ({ position, children }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 0.5 });
    }
  }, [position, map]);
  return <Marker position={position} icon={busIcon}>{children}</Marker>;
};

const PublicTracking = () => {
  const [busId, setBusId] = useState("");
  const [busLocation, setBusLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);
  const mapRef = useRef(null);

  const startTracking = () => {
    if (!busId.trim()) {
      setError("Please enter a Bus ID to track.");
      return;
    }
    setTracking(true);
    setError("");

    if (!socketService.socket || !socketService.socket.connected) {
      socketService.connect();
    }

    socketService.joinBusRoom(busId);
    console.log(" Joined bus room:", busId);

    socketService.socket.on("bus:location", (loc) => {
      console.log(" live location:", loc);
      if (loc?.lat && loc?.lon) {
        setBusLocation([loc.lat, loc.lon]);
        setLastUpdate(new Date(loc.timestamp).toLocaleTimeString());
      }
    });

    intervalRef.current = setInterval(async () => {
      try {
        const res = await publicAPI.getBusLocation(busId);
        if (res.data.success && res.data.location) {
          const { lat, lon, timestamp } = res.data.location;
          setBusLocation([lat, lon]);
          setLastUpdate(new Date(timestamp).toLocaleTimeString());
        }
      } catch (err) {
        console.error("Polling failed:", err.message);
      }
    }, 10000);
  };

  const stopTracking = () => {
    setTracking(false);
    setBusLocation(null);
    setLastUpdate(null);
    clearInterval(intervalRef.current);

    socketService.leaveBusRoom(busId);
    socketService.socket?.off("bus:location");
    console.log(" Tracking stopped for:", busId);
  };

  const refreshTracking = async () => {
    if (!busId.trim()) return setError("Enter Bus ID first.");
    try {
      const res = await publicAPI.getBusLocation(busId);
      if (res.data.success && res.data.location) {
        const { lat, lon, timestamp } = res.data.location;
        setBusLocation([lat, lon]);
        setLastUpdate(new Date(timestamp).toLocaleTimeString());
        setError("");
        console.log("Refreshed location:", lat, lon);
      } else {
        setError("Bus not found or inactive.");
      }
    } catch {
      setError("Error fetching bus data.");
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      socketService.socket?.off("bus:location");
    };
  }, []);

  const center = busLocation || [12.9716, 77.5946];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto mb-4">
        <h2 className="text-2xl font-bold mb-4">Live Bus Tracking</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            placeholder="Enter Bus ID..."
            className="border px-3 py-2 rounded-md w-full"
          />
          {!tracking ? (
            <button
              onClick={startTracking}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Stop
            </button>
          )}
          <button
            onClick={refreshTracking}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
            {error}
          </div>
        )}

        {lastUpdate && (
          <div className="text-sm text-gray-500 mb-2">
            Last update: {lastUpdate}
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={17}
        ref={mapRef}
        className="h-[75vh] w-full rounded-lg shadow-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {busLocation && (
          <FlyMarker position={busLocation}>
            <Popup>
              <div>
                <p><strong>Bus ID:</strong> {busId}</p>
                <p><strong>Last Updated:</strong> {lastUpdate}</p>
              </div>
            </Popup>
          </FlyMarker>
        )}
      </MapContainer>
    </div>
  );
};

export default PublicTracking;
