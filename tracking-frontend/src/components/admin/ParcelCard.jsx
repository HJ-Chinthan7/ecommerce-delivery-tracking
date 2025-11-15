import React from "react";

const ParcelCard = ({ parcel, selected, onSelect, type }) => {
  const { shippingAddress } = parcel;

  return (
    <div
      className={`p-3 rounded-lg bg-white flex flex-col cursor-pointer space-y-1 ${
        selected ? "border-2 border-blue-500" : "border border-gray-200"
      }`}
      onClick={() => onSelect(parcel._id, type)}
    >
      <div className="flex justify-between items-center">
        {type === "region" && (
          <span className="text-red-500 font-bold mr-2">Remove Region</span>
        )}
        <span className="font-medium text-gray-800">Parcel ID: {parcel._id}</span>
        {parcel.busId && (
          <span className="font-medium text-gray-800">
            Bus ID: {parcel.busId || "N/A"}
          </span>
        )}
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            parcel.status === "assigned"
              ? "bg-blue-100 text-blue-800"
              : parcel.status === "in_transit"
              ? "bg-yellow-100 text-yellow-800"
              : parcel.status === "delivered"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {parcel.status}
        </span>
      </div>

      <div className="text-sm text-gray-700">
        <div>
          <span className="font-semibold">Address:</span> {shippingAddress.address}
        </div>
        <div>
          <span className="font-semibold">City:</span> {shippingAddress.city}
        </div>
        <div>
          <span className="font-semibold">District:</span> {shippingAddress.district}
        </div>
        <div>
          <span className="font-semibold">State:</span> {shippingAddress.state}
        </div>
        <div>
          <span className="font-semibold">Postal Code:</span> {shippingAddress.postalCode}
        </div>
        <div>
          <span className="font-semibold">Country:</span> {shippingAddress.country}
        </div>
      </div>
    </div>
  );
};

export default ParcelCard;
