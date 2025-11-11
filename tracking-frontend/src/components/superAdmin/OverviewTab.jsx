function OverviewTab({ regions, admins, drivers, buses, pendingDrivers, handleApproveDriver }) {
  return (
    <div className="py-8">
    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">Regions: {regions.length}</div>
        <div className="stat-card">Admins: {admins.length}</div>
        <div className="stat-card">Drivers: {drivers.length}</div>
        <div className="stat-card">Buses: {buses.length}</div>
      </div>

      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Pending Driver Approvals</h3>
        {pendingDrivers.length === 0 ? (
          <p className="text-gray-500">No pending drivers</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pendingDrivers.map((driver) => (
              <li key={driver._id} className="py-4 flex items-center justify-between">
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
        <h3 className="text-lg font-medium mb-4">Recent Admins</h3>
        <ul className="divide-y divide-gray-200">
          {admins.slice(0, 5).map((admin) => (
            <li key={admin._id} className="py-4">
              <p className="font-medium">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
              <p className="text-sm text-gray-500">Region: {admin.regionId?.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OverviewTab;
