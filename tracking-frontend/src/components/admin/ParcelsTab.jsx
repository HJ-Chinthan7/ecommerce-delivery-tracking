import React from "react";
import { useNavigate } from "react-router-dom";

const ParcelsTab = ({ parcels }) => {
  const navigate = useNavigate();

  const goToAssigner = () => {
    navigate("/parcel-assigner"); 
  };

  return (
    <div className="py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Region Parcels ({parcels.length})</h3>
          <button
            onClick={goToAssigner}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Parcel Assigner
          </button>
        </div>

        {parcels.length === 0 ? (
          <p className="text-gray-500">No parcels in your region</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcel ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Link</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parcel._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.busId || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parcel.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        parcel.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                        parcel.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {parcel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.trackingLink ? (
                        <a href={parcel.trackingLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                          Track Parcel
                        </a>
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelsTab;
