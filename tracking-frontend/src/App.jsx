import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import BusDriverApp from './components/BusDriverApp';
import PublicTracking from './components/PublicTracking';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/driver" element={<BusDriverApp />} />
          <Route path="/track/:parcelId" element={<PublicTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
