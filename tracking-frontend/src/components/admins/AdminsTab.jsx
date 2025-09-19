function AdminsTab({ createAdminForm, setCreateAdminForm, handleCreateAdmin, admins, regions, loading }) {
  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Create New Admin</h3>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <input placeholder="Name" value={createAdminForm.name} onChange={(e) => setCreateAdminForm({ ...createAdminForm, name: e.target.value })} className="input" />
          <input type="email" placeholder="Email" value={createAdminForm.email} onChange={(e) => setCreateAdminForm({ ...createAdminForm, email: e.target.value })} className="input" />
          <input type="password" placeholder="Password" value={createAdminForm.password} onChange={(e) => setCreateAdminForm({ ...createAdminForm, password: e.target.value })} className="input" />
          <select value={createAdminForm.regionId} onChange={(e) => setCreateAdminForm({ ...createAdminForm, regionId: e.target.value })} className="input">
            <option value="">Select Region</option>
            {regions.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Admin'}</button>
        </form>
      </div>

   
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Admins List</h3>
        <ul className="divide-y divide-gray-200">
          {admins.map((admin) => (
            <li key={admin._id} className="py-4">
              <p className="font-medium">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
              <p className="text-sm text-gray-500">Region: {admin.region?.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminsTab;
