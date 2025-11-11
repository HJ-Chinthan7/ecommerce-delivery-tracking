const  BusesTab=({ createBusForm, setCreateBusForm, handleCreateBus, buses, regions,admins ,loading })=> {
  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Create New Bus</h3>
        <form onSubmit={handleCreateBus} className="space-y-4">
          <input placeholder="Bus Number" value={createBusForm.busId} onChange={(e) => setCreateBusForm({ ...createBusForm, busId: e.target.value })} className="input" />
          <input placeholder="Route Id" value={createBusForm.routeId} onChange={(e) => setCreateBusForm({ ...createBusForm, routeId: e.target.value })} className="input" />
          <select value={createBusForm.regionId} onChange={(e) => setCreateBusForm({ ...createBusForm, regionId: e.target.value })} className="input">
            <option value="">Select Region</option>
            {regions.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
           <select value={createBusForm.adminId} onChange={(e) => setCreateBusForm({ ...createBusForm, adminId: e.target.value })} className="input">
            <option value="">Select Admin</option>
            {admins.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Bus'}</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Buses List</h3>
        <ul className="divide-y divide-gray-200">
          {buses.map((bus) => (
            <li key={bus?._id} className="py-4">
              <p className="font-medium">Bus No: {bus?.busId}</p>
              <p className="text-sm text-gray-500"> Name: {bus?.regionId?.name}</p>
             { bus?.driverId&&<p className="text-sm text-gray-500"> Driver name: {bus?.driverId?.name}</p>}
              <p className="text-sm text-gray-500"> Admin name: {bus?.adminId?.name}</p>           
             </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BusesTab;
