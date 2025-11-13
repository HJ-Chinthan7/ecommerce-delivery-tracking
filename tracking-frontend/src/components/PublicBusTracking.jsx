import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socketService from "../services/socket";
import { publicAPI } from "../services/api";

// fix default icons
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
      </svg>
    `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const FlyMarker = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom(), { duration: 0.5 });
  }, [position, map]);

  return (
    <Marker position={position} icon={busIcon}>
      <Popup>Bus is here</Popup>
    </Marker>
  );
};

const PublicBusTracker = () => {
  const { parcelId } = useParams();
  const [busId, setBusId] = useState(parcelId || "");
  const [busLocation, setBusLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");
  const trackingIntervalRef = useRef(null);

  const refreshLocation = async () => {
    if (!busId) {
      alert("Enter a Bus ID first!");
      return;
    }
    try {
      const res = await publicAPI.getBusLocationtracking(busId);
      console.log(" API Response:", res.data);

      if (res?.data?.success && res.data.location) {
        const loc = res.data.location;
        setBusLocation([loc.lat, loc.lon]);
        setLastUpdate(new Date(loc.timestamp).toLocaleTimeString());
        setError("");
      } else {
        setError("Bus not found or no location data.");
      }
    } catch (err) {
      console.error(" Error fetching bus location:", err);
      setError("Failed to fetch location.");
    }
  };

  useEffect(() => {
    if (!tracking || !busId) return;

    console.log(" Tracking started, connecting socket...");
    const socket = socketService.connect();
console.log(" Socket instance:", socket);
    socket.on("connect", () => {
      console.log(" Socket connected:", socket.id);
      socketService.joinBusRoom(busId);

      const handleLocationUpdate = (loc) => {
        console.log(" location update:", loc);
        if (loc?.lat && loc?.lon) {
          setBusLocation([loc.lat, loc.lon]);
          setLastUpdate(new Date(loc.timestamp).toLocaleTimeString());
          setError("");
        }
      };

      socketService.on("bus:location", handleLocationUpdate);

      trackingIntervalRef.current = setInterval(() => {
        console.log(" Re-listening for location updates...");
        socketService.off("bus:location");
        socketService.on("bus:location", handleLocationUpdate);
      }, 10000);
    });

    return () => {
      console.log(" Stopping tracking...");
      clearInterval(trackingIntervalRef.current);
      socketService.leaveBusRoom(busId);
      socketService.off("bus:location");
    };
  }, [tracking, busId]);

  const handleTrackingToggle = () => {
    if (!busId) {
      alert("Enter a Bus ID first!");
      return;
    }
    setTracking((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
     
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Track Your Bus</h2>

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

        <button
          onClick={handleTrackingToggle}
          className={`${
            tracking ? "bg-red-600" : "bg-green-600"
          } text-white py-2 px-4 rounded w-full`}
        >
          {tracking ? "Stop Tracking" : "Start Tracking"}
        </button>

        {busLocation ? (
          <div className="mt-4 space-y-2">
            <p>
              <strong>Latitude:</strong> {busLocation[0].toFixed(5)}
            </p>
            <p>
              <strong>Longitude:</strong> {busLocation[1].toFixed(5)}
            </p>
            <p>
              <strong>Last Update:</strong> {lastUpdate}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No location yet</p>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="flex-1 m-5 rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={busLocation || [12.9716, 77.5946]}
          zoom={15}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {busLocation && <FlyMarker position={busLocation} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default PublicBusTracker;
