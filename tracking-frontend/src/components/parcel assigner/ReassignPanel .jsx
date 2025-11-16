import React from "react";

const ReassignPanel = ({
  parcels,
  regions,
  selectedParcels,
  setSelectedParcels,
  selectedRegion,
  setSelectedRegion,
  onClose,
  onReassign,
  loading,
  onRefresh 
}) => {

  const toggleParcel = (id) => {
    setSelectedParcels(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white w-[90%] max-w-[1200px] h-[80%] rounded shadow-lg flex overflow-hidden">

        <div className="flex-1 p-4 overflow-y-auto border-r">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Parcels Needing Reassignment</h2>
            <button
              onClick={onRefresh}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>

          {parcels.map((p, index) => {
            const parcelData = p.parcel || p; 
            const userData = p.order?.user || parcelData.user || {};
            return (
              <div
                key={parcelData._id || index}
                onClick={() => toggleParcel(parcelData._id)}
                className={`border p-3 mb-2 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all ${
                  selectedParcels.includes(parcelData._id) ? "bg-yellow-100" : ""
                }`}
              >
                <p className="font-semibold">Customer Name: {userData.username || "Unknown"}</p>
                <p>Address: {parcelData.shippingAddress?.address}</p>
                <p>District: {parcelData.shippingAddress?.district}</p>
                <p>City: {parcelData.shippingAddress?.city}</p>
                <p>State: {parcelData.shippingAddress?.state}</p>
                <p>Items: {parcelData.items?.map(i => i.name).join(", ")}</p>
              </div>
            );
          })}
        </div>

        <div className="w-64 p-4 flex flex-col gap-3">
          <button
            onClick={onClose}
            className="self-end text-red-500 font-bold hover:text-red-700"
          >
            X
          </button>

          <h2 className="font-bold mb-2 text-center">Regions</h2>
          {regions.map(region => (
            <div
              key={region._id}
              onClick={() => setSelectedRegion(region._id)}
              className={`border-2 border-gray-300 rounded-2xl p-4 text-center cursor-pointer shadow-md hover:shadow-lg transition-all ${
                selectedRegion === region._id ? "bg-green-200 border-green-400" : "bg-white"
              }`}
            >
              {region.name}
            </div>
          ))}

          <button
            onClick={onReassign}
            disabled={loading}
            className={`mt-auto bg-green-600 text-white p-2 rounded hover:bg-green-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Reassigning..." : `Reassign Selected Parcels (${selectedParcels.length})`}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReassignPanel;
