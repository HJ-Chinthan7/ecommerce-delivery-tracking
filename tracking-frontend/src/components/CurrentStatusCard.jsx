import React from "react";

const CurrentStatusCard = ({ bus }) => {
  if (!bus) return null;
  return (
    <div className="p-4 bg-white shadow-md rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">Current Bus Status</h3>

      <p>
        <strong>Bus Driver Name:</strong>{" "}
        {bus.driver ? bus.driver.name : "Not assigned"}
      </p>

      <p>
        <strong>Bus ID:</strong> {bus.busId}
      </p>

      <p>
        <strong>Route:</strong> {bus.RouteName || "Not assigned"}
      </p>

      <p>
        <strong>Direction:</strong> {bus.direction || "forward"}
      </p>

      <p>
        <strong>Current Stop:</strong>{" "}
        {bus.currentBusStop.name
          ? `${bus.currentBusStop.name} left`
          : "Not started yet"}
      </p>

      <p>
        <strong>Next Stop:</strong> {bus.nextBusStop?.name || "No next stop"}
      </p>

      <p>
        <strong>Stop Number :</strong> {bus.RouteOrderNo ?? 0}
      </p>

      <p>
        <strong>Status:</strong> {bus.status || "Inactive"}
      </p>

      <p>
        <strong>Active:</strong> {bus.isActive ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default CurrentStatusCard;
