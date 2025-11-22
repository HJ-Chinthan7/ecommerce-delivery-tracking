import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { motion } from 'framer-motion'; //eslint-disable-line

const MessageBox = ({ message }) => {
  if (!message) return null;

  const isError = message.toLowerCase().includes("error") || message.toLowerCase().includes("fail");

  return (
    <div className={`relative w-full p-4 rounded-xl border flex items-start gap-3 backdrop-blur-md ${
      isError 
        ? "bg-red-500/10 border-red-500/20 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.1)]" 
        : "bg-green-500/10 border-green-500/20 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
    }`}>
      
      <div className="shrink-0 mt-0.5">
        {isError ? (
          <AlertCircle size={20} className="text-red-400" />
        ) : (
          <CheckCircle2 size={20} className="text-green-400" />
        )}
      </div>

      <div className="flex-1 text-sm font-medium leading-relaxed">
        {message}
      </div>

      <div className={`absolute inset-0 rounded-xl opacity-20 pointer-events-none ${
        isError ? "bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0" : "bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0"
      }`} />
    </div>
  );
};

export default MessageBox;