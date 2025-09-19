const TABS = [
  { id: 'overview', name: 'Overview' },
  { id: 'admins', name: 'Manage Admins' },
  { id: 'regions', name: 'Manage Regions' },
  { id: 'drivers', name: 'Manage Drivers' },
  { id: 'buses', name: 'Manage Buses' }
];

function DashboardTabs({ activeTab, setActiveTab }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default DashboardTabs;
