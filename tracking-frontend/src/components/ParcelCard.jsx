const ParcelCard = ({
  parcel = {},
  userInfo = null,
  onDeliver = () => {},
  onRemove = () => {},
}) => {
  const address = parcel?.shippingAddress || {};

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        parcel?.isAddressChanged ? "bg-red-50 border-red-300" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">
          Order #{parcel?.orderId ? parcel.orderId.slice(0, 8) : "—"}
        </h3>

        {parcel?.isAddressChanged && <span className="text-red-600 font-bold text-sm">Address Changed</span>}
      </div>

      <p className="text-sm mt-2 text-gray-600"><strong>Name:</strong> {userInfo?.username || "Unknown"}</p>
      <p className="text-sm text-gray-600"><strong>Email:</strong> {userInfo?.email || "Not Provided"}</p>

      <p className="text-sm text-gray-600 mt-2">
        <strong>Address:</strong> {address?.address || "N/A"}, {address?.city || "N/A"}, {address?.district || "N/A"} (D), {address?.state || "N/A"} - {address?.postalCode || "N/A"}
      </p>

      <p className="text-sm text-gray-600 mt-1"><strong>Product:</strong> {parcel?.items?.[0]?.name || "Unknown Product"}</p>

      <div className="flex gap-3 mt-4">
        <button
          disabled={parcel?.isAddressChanged}
          onClick={(e) => { e.stopPropagation(); onDeliver(); }}
          className={`flex-1 p-2 rounded-lg text-white ${parcel?.isAddressChanged ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}`}
        >
          Deliver
        </button>

        {parcel?.isAddressChanged && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="flex-1 p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default ParcelCard;
