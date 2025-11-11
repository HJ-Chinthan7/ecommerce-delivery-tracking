const OverviewTab=({ drivers, buses, parcels })=> {
  const pendingDrivers = drivers.filter(d => d.status === 'pending');
  const approvedDrivers = drivers.filter(d => d.status === 'approved');

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">DR</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Drivers</dt>
                  <dd className="text-lg font-medium text-gray-900">{drivers.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AP</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approved Drivers</dt>
                  <dd className="text-lg font-medium text-gray-900">{approvedDrivers.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">BU</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Buses</dt>
                  <dd className="text-lg font-medium text-gray-900">{buses.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">PA</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Parcels</dt>
                  <dd className="text-lg font-medium text-gray-900">{parcels.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Driver Approvals</h3>
          {pendingDrivers.length === 0 ? (
            <p className="text-gray-500">No pending approvals</p>
          ) : (
            <div className="space-y-3">
              {pendingDrivers.slice(0, 5).map((driver) => (
                <div key={driver._id} className="p-3 border rounded-lg">
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-gray-500">{driver.email}</p>
                  <p className="text-sm text-gray-500">Driver ID: {driver.driverId}</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Approval</span>
                </div>
              ))}
              {pendingDrivers.length > 5 && (
                <p className="text-sm text-gray-500 text-center">And {pendingDrivers.length - 5} more...</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bus Assignments</h3>
          {buses.length === 0 ? (
            <p className="text-gray-500">No buses in your region</p>
          ) : (
            <div className="space-y-3">
              {buses.slice(0, 5).map((bus) => (
                <div key={bus._id} className="p-3 border rounded-lg">
                  <p className="font-medium">Bus {bus.busId}</p>
                  <p className="text-sm text-gray-500">Driver: {bus.driverId}</p>
                  <p className="text-sm text-gray-500">Route: {bus.routeId}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bus.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {bus.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;