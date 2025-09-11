import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate=useNavigate();
    return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Real-time Parcel Tracking
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your parcels in real-time with our bus-based delivery system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
        
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg" className="w-10 h-10 text-primary-600" alt="Admin Icon"/>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-gray-600 mb-4">
                Manage parcels, assign them to buses, and monitor the delivery system
              </p>
              <Link to="/admin" className="btn-primary inline-block">
                Access Admin Panel
              </Link>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="https://www.svgrepo.com/show/527634/bus.svg" className="w-8 h-8 text-green-600" alt="Bus Icon"/>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bus Driver App</h3>
              <p className="text-gray-600 mb-4">
                Login as a bus driver and start sharing your location for parcel tracking
              </p>
              <Link to="/driver" className="btn-primary inline-block">
                Driver Login
              </Link>
            </div>
          </div>

         
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Parcel</h3>
              <p className="text-gray-600 mb-4">
                Enter your parcel ID to track its real-time location on the map
              </p>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Enter Parcel ID" 
                  className="input-field text-center"
                  id="parcelIdInput"
                />
                <button 
                  onClick={() => {
                    const parcelId = document.getElementById('parcelIdInput').value;
                    if (parcelId) {
                      navigate(`/track/${parcelId}`);
                    }
                  }}
                  className="btn-primary w-full"
                >
                  Track Parcel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;




