function RegionsTab({ createRegionForm, setCreateRegionForm, handleCreateRegion, regions, loading }) {
  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Create New Region</h3>
        <form onSubmit={handleCreateRegion} className="space-y-4">
          <input placeholder="Region Name" value={createRegionForm.name} onChange={(e) => setCreateRegionForm({ ...createRegionForm, name: e.target.value })} className="input" />
          <input placeholder="Region Code" value={createRegionForm.code} onChange={(e) => setCreateRegionForm({ ...createRegionForm, code: e.target.value })} className="input" />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Region'}</button>
        </form>
      </div>


      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Regions List</h3>
        <ul className="divide-y divide-gray-200">
          {regions.map((region) => (
            <li key={region._id} className="py-4">
              <p className="font-medium">{region.name}</p>
              <p className="text-sm text-gray-500">{region.code}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RegionsTab;
