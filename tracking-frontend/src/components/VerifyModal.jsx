import { useEffect, useState } from "react";
import { 
  KeyRound, 
  RefreshCw,
  X
} from 'lucide-react';
const VerifyModal = ({ open, parcel = {}, action = "", onGenerate, onVerify, onClose }) => {
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (open) setCode("");
  }, [open, action]);

  if (!open) return null;

  const verify = async () => {
    if (!code) return alert("Enter OTP");
    const res = await onVerify(code);
    if (!res.ok) alert(res.msg || "Verification failed");
  };

  const resend = async () => {
    try {
      setSending(true);
      await onGenerate(parcel, action);
      alert("OTP re-sent");
    } catch (e) {
      alert("Failed to re-send OTP",e.message);
    } finally {
      setSending(false);
    }
  };

  const title = action === "deliver" ? "Delivery OTP" : action === "remove" ? "Admin OTP (remove)" : action === "remove_selected" ? "Admin OTP (remove selected)" : action === "remove_all" ? "Admin OTP (remove all)" : "Enter OTP";

return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#09090b] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />

        <button 
           className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10" 
           onClick={onClose}
        >
           <X size={20} />
        </button>

        <div className="mb-6">
           <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-4">
              <KeyRound className="text-purple-400" size={24} />
           </div>
           <h2 className="text-xl font-medium text-white">{title}</h2>
           <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
             {action === "deliver" 
               ? "An OTP has been sent to the recipient's contact details." 
               : "An admin OTP was sent to the registered admin email."}
           </p>
        </div>

        <input 
           value={code} 
           onChange={(e) => setCode(e.target.value)} 
           placeholder="Enter 6-digit OTP" 
           className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-center text-white placeholder:text-zinc-600 tracking-widest font-mono focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all mb-4" 
        />

        <div className="flex gap-3">
          <button 
             onClick={verify} 
             className="flex-1 bg-white text-black font-medium p-3 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
          >
             Verify Code
          </button>
          <button 
             onClick={resend} 
             disabled={sending} 
             className="flex-1 bg-white/5 border border-white/10 text-zinc-300 font-medium p-3 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
             {sending ? <RefreshCw size={16} className="animate-spin" /> : "Resend"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;
