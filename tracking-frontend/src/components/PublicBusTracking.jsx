
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socketService from "../services/socket";
import { publicAPI } from "../services/api";

// 🧭 Fix Leaflet default marker paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🚌 Custom bus icon
const busIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="24" height="16" rx="2" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
      <circle cx="8" cy="24" r="3" fill="#1E40AF"/>
      <circle cx="24" cy="24" r="3" fill="#1E40AF"/>
      <rect x="6" y="10" width="20" height="8" fill="#EFF6FF"/>
    </svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// 🚀 Component that moves the map smoothly when location updates
const FlyMarker = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      console.log("[FlyMarker] Moving map to:", position);
      map.flyTo(position, map.getZoom(), { duration: 0.5 });
    }
  }, [position, map]);
  return <Marker position={position} icon={busIcon}>
    <Popup>Bus is here 🚌</Popup>
  </Marker>;
};

const PublicBusTracker = () => {
  const { busId: paramBusId } = useParams(); // 🧩 from URL
  const [busId, setBusId] = useState(paramBusId || "");
  const [busLocation, setBusLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState("");

  // 🧠 SOCKET JOIN EFFECT
  useEffect(() => {
    console.log("[useEffect] Current busId:", busId);

    if (!busId) {
      console.warn("[useEffect] busId missing — skipping socket join");
      return;
    }

    if (!socketService.socket || !socketService.socket.connected) {
      console.warn("[useEffect] Socket not connected yet!");
      return;
    }

    console.log("[Socket] Joining bus room:", busId);
    socketService.socket.emit("joinBusRoom", { busId });

    const handleLocation = (loc) => {
      console.log("[Socket] Received bus:location event:", loc);
      if (loc && loc.lat && loc.lon) {
        setBusLocation([loc.lat, loc.lon]);
        setLastUpdate(new Date(loc.timestamp).toLocaleTimeString());
      }
    };

    socketService.socket.on("bus:location", handleLocation);

    return () => {
      console.log("[Socket] Leaving bus room:", busId);
      socketService.socket.emit("leaveBusRoom", { busId });
      socketService.socket.off("bus:location", handleLocation);
    };
  }, [busId]);

  // 🔁 Manual refresh button — uses HTTP API
  const refreshLocation = async () => {
    if (!busId) return alert("Enter a Bus ID first!");
    console.log("[HTTP] Refresh clicked for busId:", busId);
    try {
      const res = await publicAPI.getBusLocationtracking(busId);
      console.log("[HTTP] API response:", res.data);

      if (res?.data?.success && res.data.location) {
        const loc = res.data.location;
        setBusLocation([loc.lat, loc.lon]);
        setLastUpdate(new Date(loc.timestamp).toLocaleTimeString());
        setError("");
      } else {
        setError("Bus not found or no location data");
      }
    } catch (err) {
      console.error("[HTTP] Failed to fetch bus location:", err);
      setError("Failed to fetch bus location");
    }
  };

  console.log("[Render] Map rendering with location:", busLocation);

  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Track Your Bus 🚌</h2>
        <input
          type="text"
          placeholder="Enter Bus ID"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={refreshLocation}
          className="bg-blue-600 text-white py-2 px-4 rounded w-full mb-2"
        >
          Refresh Location
        </button>

        {busLocation ? (
          <div className="mt-4 space-y-2">
            <p><strong>Latitude:</strong> {busLocation[0].toFixed(5)}</p>
            <p><strong>Longitude:</strong> {busLocation[1].toFixed(5)}</p>
            <p><strong>Last Update:</strong> {lastUpdate}</p>
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No location yet...</p>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* MAP VIEW */}
      <div className="flex-1 m-5 rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={busLocation || [12.9716, 77.5946]}
          zoom={16}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {busLocation && <FlyMarker position={busLocation} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default PublicBusTracker;
