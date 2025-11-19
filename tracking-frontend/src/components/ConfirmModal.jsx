const ConfirmModal=({ open, title, message, onConfirm, onClose })=> {
  if (!open) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleBackdrop}>
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <p className="mb-6">{message}</p>

        <div className="flex justify-between gap-4">
          <button onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 p-3 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg">Confirm</button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal;