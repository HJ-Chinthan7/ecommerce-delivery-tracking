
const Navbar = ({ activeTab, logout }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="flex justify-between items-center px-6 py-4">
      <h1 className="text-xl font-bold">Bus Driver Dashboard - {activeTab}</h1>
      <button onClick={logout} className="btn-secondary">Logout</button>
    </div>
  </div>
);

export default Navbar;
