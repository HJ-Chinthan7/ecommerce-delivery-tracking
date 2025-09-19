function DriversTab({ pendingDrivers, approvedDrivers, handleApproveDriver }) {
  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
     
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Pending Drivers</h3>
        {pendingDrivers.length === 0 ? (
          <p className="text-gray-500">No pending drivers</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pendingDrivers.map((driver) => (
              <li key={driver._id} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-gray-500">License: {driver.licenseNumber}</p>
                </div>
                <button onClick={() => handleApproveDriver(driver._id)} className="btn-primary">Approve</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Approved Drivers</h3>
        {approvedDrivers.length === 0 ? (
          <p className="text-gray-500">No approved drivers</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {approvedDrivers.map((driver) => (
              <li key={driver._id} className="py-4">
                <p className="font-medium">{driver?.name}</p>
                <p className="text-sm text-gray-500">Region name: {driver?.regionId?.name}</p>
                <p className="text-sm text-gray-500">Bus id: {driver?.busId?.busId}</p>
                <p className="text-sm text-gray-500">Region code: {driver?.regionId?.code}</p>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DriversTab;
