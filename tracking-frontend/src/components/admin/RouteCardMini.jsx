import { 
  Route as RouteIcon, 
  MapPin
} from 'lucide-react';

const RouteCardMini = ({ route }) => {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="mt-1 bg-green-500/10 p-1.5 rounded-lg border border-green-500/20">
            <MapPin size={14} className="text-green-400" />
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-white mb-0.5">{route.name}</p>
            <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{route.description}</p>
            
            {route.startTimes?.length > 0 && (
            <div className="flex flex-wrap gap-1">
                {route.startTimes.map((t, i) => (
                <span key={i} className="text-[10px] font-mono text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                    {t} - {route.endTimes[i] || "?"}
                </span>
                ))}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RouteCardMini;
