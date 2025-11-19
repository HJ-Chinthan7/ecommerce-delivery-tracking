import ParcelCard from "./ParcelCard";

const ParcelList = ({
  parcels = [],
  users = {},
  onDeliver,
  onRemove,
  selectedParcel,
  onSelect,
  loading = false,
  searchQuery = "",
  onSearch = () => {},
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-md h-[80vh] overflow-y-auto">
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search address / city / district / postal code / name / email / product…"
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {loading && <p className="text-gray-500 text-center mt-10">Loading parcels…</p>}

      {!loading && parcels.length === 0 && <p className="text-gray-500 text-center mt-10">No parcels found.</p>}

      <div className="space-y-3">
        {parcels.map((parcel) => {
          const userInfo = users?.[parcel.user] || null;
          return (
            <div
              key={parcel._id}
              onClick={() => onSelect && onSelect(parcel._id)}
              className={`cursor-pointer ${selectedParcel === parcel._id ? "ring-2 ring-blue-400 rounded-lg" : ""}`}
            >
              <ParcelCard
                parcel={parcel}
                userInfo={userInfo}
                onDeliver={() => onDeliver && onDeliver({parcel,userInfo})}
                onRemove={() => onRemove && onRemove(parcel)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParcelList;
