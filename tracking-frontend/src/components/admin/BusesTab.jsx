
const BusesTab=({
  buses,
  drivers, // eslint-disable-line no-unused-vars
  assignBusForm,
  setAssignBusForm,
  handleAssignBus,
  loading,
  approvedDrivers
}) =>{
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
     
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Bus to Driver</h3>
          <form onSubmit={handleAssignBus} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver ID</label>
              <select
                value={assignBusForm.driverId}
                onChange={(e) => setAssignBusForm({...assignBusForm, driverId: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Driver</option>
                {approvedDrivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name} ({driver.driverId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bus ID</label>
              <select
                value={assignBusForm.busId}
                onChange={(e) => setAssignBusForm({...assignBusForm, busId: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Bus</option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>
                    Bus {bus.busId} (Route: {bus.routeId?._id })
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Bus'}
            </button>
          </form>
        </div>

      
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Region Buses ({buses.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {buses.map((bus) => (
              <div key={bus._id} className="p-3 border rounded-lg">
                <p className="font-medium">Bus {bus.busId}</p>
                <p className="text-sm text-gray-500">Driver: {bus?.driverId?.name}</p>
                <p className="text-sm text-gray-500">Driver: {bus?.driverId?._id}</p>
                <p className="text-sm text-gray-500">Route: {bus?.routeId?._id}</p>
                <p className="text-sm text-gray-500">
                  Location: {bus.currentLocation?.lat}, {bus.currentLocation?.lon}
                </p>
                <p className="text-sm text-gray-500">Parcels: {bus.parcels?.length || 0}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bus.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {bus.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">Created: {bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BusesTab;