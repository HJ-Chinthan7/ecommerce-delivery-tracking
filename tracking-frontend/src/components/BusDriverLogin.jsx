
import { useState } from "react";
import { useAuth } from "../AuthContext/BusAuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BusDriverLogin = () => {
  const { login,message,setMessage } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await login(loginForm);
    } catch (err) {
        setMessage("Login failed. Please check your credentials."+err.message);
    }finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
     
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bus Driver Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to start sharing your location
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field mt-1"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
                 <div className="relative mt-1">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="input-field w-full pr-10"
                      placeholder={"Enter your password"}
                      value={loginForm.password}
                      onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      />
                      <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={togglePasswordVisibility}
                      >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                       </span>
                  </div>
                           
            </div>
           
          </div>

        
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.includes("successful")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
        </form>

      </div>
    </div>
  );
};

export default BusDriverLogin;

                         