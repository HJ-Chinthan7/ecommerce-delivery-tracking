import React from "react";

const ParcelCard = ({ parcel, selected, onSelect, type, toast }) => {
  const { shippingAddress } = parcel;

  const handleClick = () => {
    if (parcel.isAddressChanged && parcel.isDispatched) {
      toast?.error("Bruh, you can't select this. Update the dispatch status first.");
      return;
    }

    onSelect(parcel._id, type);
  };

  return (
    <div
      className={`
        p-3 rounded-lg flex flex-col cursor-pointer space-y-1 
        transition-all duration-150

        ${selected ? "border-2 border-blue-500" : "border border-gray-200"}

        ${parcel.isAddressChanged 
          ? "bg-yellow-50"              
          : "bg-white"
        }

        ${parcel.isAddressChanged && parcel.isDispatched
          ? "opacity-50 cursor-not-allowed" 
          : ""
        }
      `}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        {type === "region" && (
          <span className="text-red-500 font-bold mr-2">Remove Region</span>
        )}

        <span className="font-medium text-gray-800">
          Parcel ID: {parcel._id}
        </span>

        {parcel.busId && (
          <span className="font-medium text-gray-800">
            Bus ID: {parcel.busId}
          </span>
        )}

        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full
            ${
              parcel.status === "assigned"
                ? "bg-blue-100 text-blue-700"
                : parcel.status === "in_transit"
                ? "bg-yellow-100 text-yellow-700"
                : parcel.status === "delivered"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >
          {parcel.status}
        </span>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
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
