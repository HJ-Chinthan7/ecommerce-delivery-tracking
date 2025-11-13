import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] via-[#e5e7eb] to-[#d1d5db] flex flex-col items-center py-20">
      <div className="max-w-6xl w-full px-6">
       
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Real-time Parcel Tracking
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Monitor and manage parcels efficiently using our bus-based delivery system
          </p>
        </div>

        
        <div className="grid md:grid-cols-4 gap-10">
         
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a6/User-admin.svg"
                className="w-10 h-10"
                alt="Admin Icon"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Panel</h3>
            <p className="text-gray-600 text-center mb-4">
              Manage parcels, assign buses, and monitor the delivery system.
            </p>
            <Link
              to="/admin/login"
              className="bg-red-600 text-white py-2 px-5 rounded-lg hover:bg-red-700 transition"
            >
              Access Admin Panel
            </Link>
          </div>

          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <img
                src="https://www.svgrepo.com/show/527634/bus.svg"
                className="w-8 h-8"
                alt="Bus Icon"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bus Driver App</h3>
            <p className="text-gray-600 text-center mb-4">
              Login as a bus driver and share your location for parcel tracking.
            </p>
            <Link
              to="/login"
              className="bg-yellow-600 text-white py-2 px-5 rounded-lg hover:bg-yellow-700 transition"
            >
              Driver Login
            </Link>
          </div>

          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Parcel</h3>
            <p className="text-gray-600 text-center mb-4">
              Enter your parcel ID to track its real-time location on the map.
            </p>
            <input
              type="text"
              placeholder="Parcel ID"
              id="parcelIdInput"
              className="border border-gray-300 rounded-md py-2 w-full text-center mb-3"
            />
            <button
              onClick={() => {
                const parcelId = document.getElementById('parcelIdInput').value;
                if (parcelId) navigate(`/track/${parcelId}`);
              }}
              className="bg-green-600 text-white py-2 w-full rounded-lg hover:bg-green-700 transition"
            >
              Track Parcel
            </button>
          </div>

          {/* Parcel Assigner */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Parcel Assigner</h3>
            <p className="text-gray-600 text-center mb-4">
              Assign parcels to buses quickly and efficiently.
            </p>
            <Link
              to="/assign-parcel"
              className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Assigner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
