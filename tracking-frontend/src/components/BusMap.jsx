import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../AuthContext/BusAuthContext";
import socketService from "../services/socket";


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
    'data:image/svg+xml;base64,' +
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
    if (position) map.flyTo(position, map.getZoom(), { duration: 0.5 });
  }, [position, map]);

  return <Marker position={position} icon={icon}>{children}</Marker>;
};

const BusMap = ({tracking,setTracking,showAll,setShowAll}) => {
  const { driver, location } = useAuth();
  const [busLocation, setBusLocation] = useState(location || null);
  const [allBuses, setAllBuses] = useState({});
  const mapRef = useRef();

  useEffect(() => {
    if (!tracking || !driver) return;
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setBusLocation(loc);
          socketService.emit("updateBusLocation", {
            busId: driver.busId,
            lat: loc[0],
            lon: loc[1],
          });
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tracking, driver]);


  useEffect(() => {
    if (!driver) return;

  
    socketService.on("bus:location", loc => {
    
      if (!showAll) {
        setBusLocation({lat:loc.lat, lon:loc.lon});
        // mapRef.current?.flyTo([loc.lat, loc.lon], 18, { duration: 0.5 });
      }
    });

    socketService.on("buses:all", buses => {
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
    <div className="h-[100vh] md:h-[76vh] flex flex-col md:flex-row">
      <div className="flex-1 ">
        <MapContainer center={center} zoom={18} className="h-full w-full" ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

     
     {(!showAll ||  Object.entries(allBuses).length==0) &&busLocation && (
            <FlyMarker position={busLocation} icon={busIcon}>
              <Popup>
                My Bus<br/>
                bus id : {driver?.busId}<br/>
              </Popup>
            </FlyMarker>
          )}
          
          {showAll &&
            Object.entries(allBuses).map(([busId, pos]) => (
              <Marker key={busId} position={[pos.lat, pos.lon]} icon={busIcon}>
                <Popup>
                  Bus {busId} <br />
                  Last update: {new Date(pos.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            ))}


            </MapContainer>
      </div>


      <div className="w-full md:w-1/3 bg-white p-4 overflow-y-auto max-h-[90vh]">
     
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Location Status</h2>
          {busLocation ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Location:</span>
                <span className="mr-5">
                  {(busLocation[0]?.toFixed(2)||busLocation?.lat?.toFixed(2))}, {(busLocation[1]?.toFixed(2)||busLocation?.lat?.toFixed(2))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tracking Status:</span>
                <span className={tracking ? "text-green-600 font-medium" : "text-gray-600"}>
                  {tracking ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-2 pt-2">
                {!tracking ? (
                  <button onClick={handleStart} className="bg-green-600 text-white py-2 px-4 rounded-lg w-full">
                    Start Tracking
                  </button>
                ) : (
                  <button onClick={handleStop} className="bg-red-600 text-white py-2 px-4 rounded-lg w-full">
                    Stop Tracking
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Location not available</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Map Options</h2>
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
          >
            {showAll ? "Show My Bus Only" : "Show All Buses"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default BusMap;
