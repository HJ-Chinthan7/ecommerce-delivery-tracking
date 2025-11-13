import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import socketService from "../services/socket";
import { publicAPI } from "../services/api";

// --- Fix Leaflet icons ---
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

// fly smoothly to new bus location
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
    console.log("Stopping tracking for bus:", busId);
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
    <div className="flex h-screen">
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Public Bus Tracking</h2>

        <input
          type="text"
          placeholder="Enter Bus ID"
          value={nid}
          onChange={(e) => setNid(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <div className="flex gap-2 mb-3">
          {!tracking ? (
            <button
              onClick={startTracking}
              className="bg-green-600 text-white px-3 py-2 rounded w-1/2"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="bg-red-600 text-white px-3 py-2 rounded w-1/2"
            >
              Stop
            </button>
          )}
          <button
            onClick={() => refreshLocation()}
            className="bg-blue-600 text-white px-3 py-2 rounded w-1/2"
          >
            Refresh
          </button>
        </div>

        {busLocation ? (
          <div className="mt-4 space-y-2">
            <p>
              <strong>Latitude:</strong> {busLocation[0].toFixed(6)}
            </p>
            <p>
              <strong>Longitude:</strong> {busLocation[1].toFixed(6)}
            </p>
            <p>
              <strong>Last update:</strong> {lastUpdate}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No live data yet</p>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="flex-1 m-5">
        <MapContainer
          center={center}
          zoom={16}
          className="h-full w-full rounded"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {busLocation && (
            <FlyMarker position={busLocation}>
              <Popup>
                <div>
                  <strong>Bus ID:</strong> {busId}
                  <br />
                  <strong>Last:</strong> {lastUpdate}
                </div>
              </Popup>
            </FlyMarker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default PublicTracking;
