import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ searchQuery, onSearchChange, onSearch, searchResults, onSelectResult }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchBarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      searchBarRef.current && !searchBarRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);  // Close the dropdown if the click is outside
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    onSearch();  // Execute the search action
    setIsDropdownOpen(true);  // Open dropdown after search
  };

  return (
    <div className="relative w-80" ref={searchBarRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for a song..."
        className="w-full px-4 py-2 border rounded-md"
      />
      <button
        onClick={handleSearch}
        className="absolute right-2 top-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Search
      </button>
      {isDropdownOpen && searchResults.length > 0 && (
        <ul ref={dropdownRef} className="absolute z-10 bg-white w-full max-h-60 overflow-y-auto mt-2 shadow-lg rounded-md">
          {searchResults.map((result, index) => (
            <li
              key={result.id?.videoId || index}
              onClick={() => onSelectResult(index)}
              className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
            >
              <img
                src={result.snippet?.thumbnails?.default?.url || ''}
                alt={result.snippet?.title || 'No Title'}
                className="w-8 h-8 mr-2 rounded"
              />
              <span>{result.snippet?.title || 'No Title'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
