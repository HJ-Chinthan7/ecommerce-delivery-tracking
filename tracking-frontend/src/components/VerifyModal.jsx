import { useEffect, useState } from "react";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-2">{title}</h2>

        <p className="text-sm text-gray-600 mb-4">
          {action === "deliver" ? "We sent an OTP to the recipient's email/phone." : "An admin OTP was sent to admin email."}
        </p>

        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter OTP" className="w-full p-3 border rounded-lg mb-4" />

        <div className="flex gap-2">
          <button onClick={verify} className="flex-1 bg-purple-600 hover:bg-orange-700 text-white p-3 rounded-lg">Verify</button>
          <button onClick={resend} disabled={sending} className="flex-1 border p-3 rounded-lg">{sending ? "Sending…" : "Resend OTP"}</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;
