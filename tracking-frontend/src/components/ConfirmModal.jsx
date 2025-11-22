import {
  AlertTriangle, 
} from 'lucide-react';
const ConfirmModal=({ open, title, message, onConfirm, onClose })=> {
  if (!open) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleBackdrop}>
      <div className="bg-[#09090b] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
        
        <div className="mb-4">
           <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-4">
              <AlertTriangle className="text-red-400" size={24} />
           </div>
           <h2 className="text-lg font-medium text-white mb-2">{title}</h2>
           <p className="text-sm text-zinc-400 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
             onClick={onClose} 
             className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 p-3 rounded-xl transition-colors text-sm font-medium"
          >
             Cancel
          </button>
          <button 
             onClick={onConfirm} 
             className="flex-1 bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl shadow-lg shadow-red-900/20 transition-colors text-sm font-medium"
          >
             Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal;