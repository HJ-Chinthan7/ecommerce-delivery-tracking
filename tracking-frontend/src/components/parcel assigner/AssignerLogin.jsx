import { useState } from "react";
import { useAssignerAuth } from "../../AuthContext/AssignerAuthContext";
import { ClipboardList, ArrowLeft } from 'lucide-react';
import { clsx } from "clsx";      //eslint-disable-line
import { twMerge } from "tailwind-merge"; //eslint-disable-line
import { cn } from "../../utils/util";
import { Link } from "react-router-dom";
const AssignerLogin = () => {
  const { login, message, setMessage } = useAssignerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await login({ email, password });
      if (!res.token) {
        setMessage(res.message || "Login failed");
      }
    } catch (err) {
      setMessage("Login error. Try again.",err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Home Button (Top Left) */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/50 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 backdrop-blur-md"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto h-12 w-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-4">
            <ClipboardList className="text-blue-400 h-6 w-6" />
          </div>
          <h2 className="text-3xl font-medium font-serif tracking-tight text-white">
            Assigner Login
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Manage parcel logistics and assignments
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {message && (
              <div className={cn(
                "p-3 rounded-lg text-sm border",
                message.toLowerCase().includes("success") 
                  ? "bg-green-500/10 border-green-500/20 text-green-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              )}>
                {message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white shadow-sm placeholder:text-zinc-600 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-sm transition-colors"
                  placeholder="assigner@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white shadow-sm placeholder:text-zinc-600 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-full border border-transparent bg-white py-2.5 px-4 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default AssignerLogin;
