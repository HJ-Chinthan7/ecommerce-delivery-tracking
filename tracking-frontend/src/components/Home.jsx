import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; //eslint-disable-line
import { clsx } from "clsx";      //eslint-disable-line
import { twMerge } from "tailwind-merge"; //eslint-disable-line
import { 
  Users, 
  Bus, 
  MapPin, 
  ClipboardList, 
  ArrowRight, 
  Search,
  Box 
} from 'lucide-react';
import { cn } from '../utils/util'; 

const ParcelCube = () => {
  const faces = [
    { type: 'face-front', icon: <Users size={40} className="text-red-400" />, label: "Admin" },
    { type: 'face-back', icon: <Bus size={40} className="text-yellow-400" />, label: "Driver" },
    { type: 'face-right', icon: <MapPin size={40} className="text-green-400" />, label: "Track" },
    { type: 'face-left', icon: <ClipboardList size={40} className="text-blue-400" />, label: "Assign" },
    { type: 'face-top', icon: <Box size={40} className="text-white/50" />, label: "Parcel" },
    { type: 'face-bottom', icon: <Box size={40} className="text-white/50" />, label: "System Admin" },
  ];

  return (
    <div className="cube-container">
      <div className="cube">
        {faces.map((item, i) => (
          <div key={i} className={cn("cube-face", item.type)}>
            {item.icon}
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
              {item.label}
            </span>
            <div className="absolute inset-0 w-full h-full shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, colorClass, glowClass, children, className, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    viewport={{ once: true }}
    className={cn(
      "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-1",
      className
    )}
  >
    <div className={cn("mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5", colorClass)}>
      {icon}
    </div>
    <h3 className="mb-3 text-xl font-medium text-white font-serif tracking-tight">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed mb-6 min-h-[40px]">{description}</p>
    
    {children}

    <div className={cn("absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-[60px] transition-opacity opacity-0 group-hover:opacity-20 pointer-events-none", glowClass)} />
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const [parcelId, setParcelId] = useState('');

  const handleTrack = () => {
    if (parcelId) navigate(`/track/${parcelId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter font-serif">User Controlled <span className="text-zinc-600">Smart Last Mile Rural</span> Delivery Web Application using<span className="text-zinc-600"> MERN & ZAP</span></div>
          <div className="flex gap-4">
            <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32">
            
            <div className="flex-1 text-center lg:text-left z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  System Operational
                </div>

                <h1 className="text-5xl md:text-7xl font-medium font-serif tracking-tight leading-[1.1] mb-6 text-white">
                  Real-time <br />
                  <span className="bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent">
                    Parcel Tracking
                  </span>
                </h1>

                <p className="text-lg text-zinc-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Monitor and manage parcels efficiently using our advanced bus-based delivery system.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => document.getElementById('track-card').scrollIntoView({ behavior: 'smooth' })}
                    className="h-12 px-8 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors w-full sm:w-auto"
                  >
                    Start Tracking
                  </button>
                  <Link to="/about" className="h-12 px-8 rounded-full border border-white/10 bg-transparent text-white font-medium hover:bg-white/5 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                    Learn more
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 flex justify-center items-center min-h-[300px]">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                    <ParcelCube />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black shadow-[0_0_60px_40px_rgba(255,255,255,0.1)] z-[-1]" />
                </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <FeatureCard
              delay={0.1}
              title="Admin Panel"
              description="Manage parcels, assign buses, and monitor the entire delivery infrastructure."
              icon={<Users size={24} />}
              colorClass="text-red-400 group-hover:text-red-300 group-hover:bg-red-500/10 group-hover:border-red-500/20"
              glowClass="bg-red-500"
            >
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-red-300 transition-colors"
              >
                Access Panel <ArrowRight size={14} />
              </Link>
            </FeatureCard>

            <FeatureCard
              delay={0.2}
              title="Driver Portal"
              description="Login as a bus driver to share location and update parcel statuses."
              icon={<Bus size={24} />}
              colorClass="text-yellow-400 group-hover:text-yellow-300 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/20"
              glowClass="bg-yellow-500"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-yellow-300 transition-colors"
              >
                Driver Login <ArrowRight size={14} />
              </Link>
            </FeatureCard>

            <FeatureCard
              delay={0.3}
              title="Track Parcel"
              description="Enter your parcel ID to view its real-time location on the map."
              icon={<MapPin size={24} />}
              colorClass="text-green-400 group-hover:text-green-300 group-hover:bg-green-500/10 group-hover:border-green-500/20"
              glowClass="bg-green-500"
              className="lg:col-span-1 border-green-500/20 bg-green-500/[0.03]"
            >
              <div id="track-card" className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input
                    type="text"
                    placeholder="Parcel ID..."
                    value={parcelId}
                    onChange={(e) => setParcelId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={handleTrack}
                  className="w-full bg-green-600 hover:bg-green-500 text-black font-medium py-2 rounded-lg text-sm transition-colors"
                >
                  Track Now
                </button>
              </div>
            </FeatureCard>

            <FeatureCard
              delay={0.4}
              title="Parcel Assigner"
              description="Quickly assign incoming parcels to specific bus routes efficiently."
              icon={<ClipboardList size={24} />}
              colorClass="text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/10 group-hover:border-blue-500/20"
              glowClass="bg-blue-500"
            >
              <Link
                to="/assigner-login"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-300 transition-colors"
              >
                Go to Assigner <ArrowRight size={14} />
              </Link>
            </FeatureCard>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;