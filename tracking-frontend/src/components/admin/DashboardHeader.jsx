 const  DashboardHeader=({ admin, onRefresh, onLogout })=> {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {admin?.name} - {admin?.region}</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={onRefresh} className="btn-secondary">
              Refresh
            </button>
            <button onClick={onLogout} className="btn-primary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;