import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAdminAuth } from "../../AuthContext/AdminAuthContext";
import { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react'; 
import { cn } from '../../utils/util';
import { clsx } from "clsx";      //eslint-disable-line
import { twMerge } from "tailwind-merge"; //eslint-disable-line
const AdminLogin=()=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login ,setMessage,message} = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {

      const result = await login({email, password, role});
      if (result.success) {
        if (result?.admin?.role === 'superadmin') {
          navigate('/admin/login/superadmin-dashboard');
        } else {
          navigate('/admin/login/admin-dashboard');
        }
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Login failed. Please try again.'+error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
   return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <h2 className="text-3xl font-medium font-serif tracking-tight text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to manage the tracking system
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Select Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white shadow-sm placeholder:text-zinc-600 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-sm transition-colors"
                  required
                >
                  <option value="admin" className="bg-zinc-900">Admin</option>
                  <option value="superadmin" className="bg-zinc-900">Super Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white shadow-sm placeholder:text-zinc-600 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-sm transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white shadow-sm placeholder:text-zinc-600 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-sm transition-colors pr-10"
                  placeholder="••••••••"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            {message && (
              <div className={cn(
                "p-3 rounded-lg text-sm border",
                message.includes("successful")
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              )}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-full border border-transparent bg-white py-2.5 px-4 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-zinc-500">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin;
