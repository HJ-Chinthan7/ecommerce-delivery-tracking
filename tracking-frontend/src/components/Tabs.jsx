
const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Map View", "Route List", "Parcels"];
  return (
    <nav className="flex space-x-6 border-b px-6 bg-gray-50">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 capitalize ${
            activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;
