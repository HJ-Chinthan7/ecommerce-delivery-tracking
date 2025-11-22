import { useState } from "react";
import { 
  Search 
} from 'lucide-react';

const SearchBar = ({ placeholder, onSearch }) => {
  const [term, setTerm] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setTerm(val);
    onSearch(val);
  };

 return (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
      <input
        type="text"
        value={term} 
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
      />
    </div>
  );
};

export default SearchBar;
