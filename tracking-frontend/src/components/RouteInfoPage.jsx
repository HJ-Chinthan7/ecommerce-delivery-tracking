import React, { useState, useEffect } from "react";
import CurrentStatusCard from "./CurrentStatusCard";
import RouteStops from "./RouteStops";
import dayjs from "dayjs";
import { driverAPI } from "../services/api";
import { 
  Clock, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
const RouteInfoPage = ({
  busId,
  selectedEnd,
  selectedStart,
  setSelectedEnd,
  setSelectedStart,
  bus,
  setBus,
  route,
  setRoute,
}) => {
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
      await driverAPI.sendNotification(bus._id, {
        startTime: selectedStart,
        endTime: selectedEnd,
        routeName: route.name,
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
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-zinc-500 text-sm font-mono">Loading route data...</p>
        </div>
      </div>
    );

  if (!route || !bus) 
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        <AlertCircle size={32} className="mb-2 opacity-50" />
        <p>Route data not found.</p>
      </div>
    );

  return (
    <div className="space-y-6 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-medium text-white">Driver Route Info</h1>
           <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
             <Clock size={14} />
             <span>Current Time: <span className="text-zinc-200 font-mono">{currentTime.format("HH:mm:ss")}</span></span>
           </div>
        </div>
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 p-2 rounded-xl">
           <div className="relative group">
             <select
                className="bg-transparent border border-white/10 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 [&>option]:bg-zinc-900"
                value={selectedStart}
                onChange={handleStartChange}
             >
                <option value="">-- Select Shift --</option>
                {route.startTimes.map((time, idx) => (
                  <option key={idx} value={time}>
                    {time} - {route.endTimes[idx]}
                  </option>
                ))}
             </select>
           </div>
           {selectedEnd && (
              <span className="text-xs font-mono text-zinc-500 border-l border-white/10 pl-3">
                End: <span className="text-zinc-300">{selectedEnd}</span>
              </span>
           )}
        </div>
      </div>

      <div className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-sm font-medium ${
        withinTime 
          ? "bg-green-500/10 border-green-500/20 text-green-400" 
          : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}>
        {withinTime ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        {withinTime ? "Active Time Window" : "Outside Active Time Window"}
      </div>

      <CurrentStatusCard bus={bus} />

      <div className="flex flex-col gap-4">
        <button
          onClick={sendNotification}
          disabled={!withinTime || sendingNotification}
          className={`w-full md:w-auto self-start px-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
            withinTime 
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20" 
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          } ${sendingNotification ? "opacity-70 cursor-wait" : ""}`}
        >
          <Bell size={16} />
          {sendingNotification ? "Sending Alert..." : "Send Passenger Notification"}
        </button>

        {withinTime ? (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
             <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-sm font-medium text-zinc-300">Route Stops</h3>
             </div>
             <RouteStops route={route} bus={bus} updateStop={updateStop} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white/[0.02] border border-white/10 rounded-2xl text-zinc-500">
             <Clock size={32} strokeWidth={1} className="mb-2 opacity-50" />
             <p className="text-sm">Route details are hidden outside active hours.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInfoPage;
