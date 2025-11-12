import React, { useState, useEffect } from "react";
import CurrentStatusCard from "./CurrentStatusCard";
import RouteStops from "./RouteStops";
import dayjs from "dayjs";
import { driverAPI } from "../services/api";
import '../styles/loader.css';

const RouteInfoPage = ({ busId,selectedEnd,selectedStart,setSelectedEnd,setSelectedStart }) => {
  const [route, setRoute] = useState(null);
  const [bus, setBus] = useState(null);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [withinTime, setWithinTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingNotification, setSendingNotification] = useState(false);

  useEffect(() => {
    fetchBusData();
    const interval = setInterval(() => setCurrentTime(dayjs()), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedStart && selectedEnd) checkTimeWindow();
  }, [currentTime, selectedStart, selectedEnd]);

  const fetchBusData = async () => {
    try {
      setLoading(true);
      const res = await driverAPI.getBusRouteDetails(busId);
      setBus(res.data.bus);
      setRoute(res.data.route);
    } catch (err) {
      console.error("Failed fetching bus route details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChange = (e) => {
    const val = e.target.value;
    setSelectedStart(val);
    const endTime = route.endTimes[route.startTimes.indexOf(val)];
    setSelectedEnd(endTime || "");
  };

  const checkTimeWindow = () => {
    if (!selectedStart || !selectedEnd) return setWithinTime(false);

    const now = dayjs();
    const nowMinutes = now.hour() * 60 + now.minute();

    const [startH, startM] = selectedStart.split(":").map(Number);
    const [endH, endM] = selectedEnd.split(":").map(Number);

    const startMinutes = startH * 60 + startM - 5; 
    const endMinutes = endH * 60 + endM + 5;      

    const inWindow = nowMinutes >= startMinutes && nowMinutes <= endMinutes;
    setWithinTime(inWindow);
  };

  const updateStop = async (stopId) => {
    try {
      const res = await driverAPI.updateBusStop(bus._id, { stopId });
      setBus(res.data.bus);
      setRoute(res.data.route);
    } catch (err) {
      console.error("Stop update failed", err);
    }
  };

  const sendNotification = async () => {
    if (!withinTime) return;
    try {
      setSendingNotification(true);
      await driverAPI.sendBusNotification(bus._id, {
        startTime: selectedStart,
        endTime: selectedEnd,
        routeName: route.name
      });
      alert("Notification sent to all parcel recipients!");
    } catch (err) {
      console.error("Failed sending notification", err);
      alert("Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="dot"></div>
          ))}
        </div>
      </div>
    );

  if (!route || !bus) return <div>Route data not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Driver Route Info</h1>

      <div>
        <label className="font-medium">Select Start Time:</label>
        <select className="ml-2 border p-2 rounded" value={selectedStart} onChange={handleStartChange}>
          <option value="">-- Select --</option>
          {route.startTimes.map((time, idx) => (
            <option key={idx} value={time}>
              {time} - {route.endTimes[idx]}
            </option>
          ))}
        </select>
        {selectedEnd && <span className="ml-3 text-gray-700">End Time: {selectedEnd}</span>}
      </div>

      <p className="text-sm text-gray-700">Current time: {currentTime.format("HH:mm:ss")}</p>
      <p className={withinTime ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
        {withinTime ? "Within time window" : "Not within active time window"}
      </p>

      <CurrentStatusCard bus={bus} />

      <button
        onClick={sendNotification}
        disabled={!withinTime || sendingNotification}
        className={`px-4 py-2 rounded text-white ${withinTime ? "bg-blue-600" : "bg-gray-400"} ${sendingNotification ? "opacity-50" : ""}`}
      >
        {sendingNotification ? "Sending..." : "  Send Notification"}
      </button>

      {withinTime ? (
        <RouteStops route={route} bus={bus} updateStop={updateStop} />
      ) : (
        <div className="p-4 bg-yellow-100 rounded">
          Routes can be viewed during active time window.
        </div>
      )}
    </div>
  );
};

export default RouteInfoPage;
