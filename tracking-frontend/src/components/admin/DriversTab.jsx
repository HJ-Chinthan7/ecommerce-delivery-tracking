const DriversTab=({
  drivers,
  registerDriverForm,
  setRegisterDriverForm,
  handleRegisterDriver,
  loading,
})=> {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Register New Driver</h3>
          <form onSubmit={handleRegisterDriver} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver ID</label>
              <input
                type="text"
                value={registerDriverForm.driverId}
                onChange={(e) => setRegisterDriverForm({...registerDriverForm, driverId: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={registerDriverForm.name}
                onChange={(e) => setRegisterDriverForm({...registerDriverForm, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={registerDriverForm.email}
                onChange={(e) => setRegisterDriverForm({...registerDriverForm, email: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={registerDriverForm.password}
                onChange={(e) => setRegisterDriverForm({...registerDriverForm, password: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Driver'}
            </button>
          </form>
        </div>

      
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Region Drivers ({drivers.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {drivers.map((driver) => (
              <div key={driver._id} className="p-3 border rounded-lg">
                <p className="font-medium">{driver.name}</p>
                <p className="text-sm text-gray-500">{driver.email}</p>
                <p className="text-sm text-gray-500">Driver ID: {driver.driverId}</p>
                <p className="text-sm text-gray-500">Bus: {driver.busId || 'Not assigned'}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${driver.status==='approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {driver.status==='approved' ? 'Approved' : 'Pending'}
                  </span>
                  {driver.isApproved && driver.approvedAt && (
                    <span className="text-xs text-gray-500">Approved: {new Date(driver.approvedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriversTab;