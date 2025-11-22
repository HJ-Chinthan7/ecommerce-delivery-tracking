import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight, ExternalLink, Box, Truck, CheckCircle2, Clock } from 'lucide-react';
const ParcelsTab = ({ parcels }) => {
  const navigate = useNavigate();

  const goToAssigner = () => {
    navigate("/parcel-assigner", {
    state: { regionId: parcels[0]?.region }
  });
  };
return (
    <div className="py-4">
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col min-h-[600px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Package className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Region Parcels</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">Total Count: {parcels.length}</p>
            </div>
          </div>
          
          <button
            onClick={goToAssigner}
            className="bg-white text-black hover:bg-zinc-200 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-lg shadow-white/5"
          >
            <span>Open Assigner</span>
            <ArrowRight size={16} />
          </button>
        </div>
        {parcels.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-white/10 rounded-xl bg-white/[0.01] m-4">
            <Box size={40} strokeWidth={1} className="mb-3 opacity-50" />
            <p className="text-sm">No parcels found in your region.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar rounded-xl border border-white/5">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-wider">Parcel ID</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-wider">Order Ref</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-wider">Assigned Bus</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {parcels.map((parcel) => (
                  <tr key={parcel._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Box size={14} className="text-zinc-600" />
                        <span className="text-sm font-medium text-zinc-200 font-mono">{parcel._id.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
                      {parcel.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       {parcel.busId ? (
                         <div className="flex items-center gap-2 text-sm text-zinc-300">
                           <Truck size={14} className="text-zinc-600" />
                           <span className="font-mono">{parcel.busId}</span>
                         </div>
                       ) : (
                         <span className="text-zinc-600 text-xs italic">Unassigned</span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md border ${
                        parcel.status === 'assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        parcel.status === 'in_transit' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        parcel.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      }`}>
                        {parcel.status === 'delivered' && <CheckCircle2 size={10} />}
                        {parcel.status === 'in_transit' && <Truck size={10} />}
                        {parcel.status === 'assigned' && <Clock size={10} />}
                        {parcel.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {parcel.busId ? (
                        <a 
                          href={`/track/${parcel.busId}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium"
                        >
                          Track Live <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-zinc-700 text-xs cursor-not-allowed">Unavailable</span>
                      )}
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
