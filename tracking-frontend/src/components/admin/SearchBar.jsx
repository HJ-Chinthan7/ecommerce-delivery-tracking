import { useState } from "react";

const SearchBar = ({ placeholder, onSearch }) => {
  const [term, setTerm] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setTerm(val);
    onSearch(val);
  };

  return (
    <input
      type="text"
      value={term}
      onChange={handleChange}
      placeholder={placeholder}
      className="border rounded p-2 w-full"
    />
  );
};

export default SearchBar;
