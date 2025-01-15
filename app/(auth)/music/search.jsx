"use client";
import React, { useState, useRef, useEffect } from 'react';
import SearchBar from './SearchBar';
import MusicCard from './MusicCard';

const MusicSearchPlayer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const playerRef = useRef(null);
  const debounceTimeout = useRef(null);

  const apiKey = 'AIzaSyCs-n3zAUayf7jgbLjPJDQtgbfbh5uRCKw';

  const searchSongs = async (query) => {
    if (!query.trim()) return;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.items || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      searchSongs(searchQuery);
    }, 500);
  }, [searchQuery]);

  const selectSong = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const playPause = () => setIsPlaying((prev) => !prev);

  const playNext = () => {
    if (currentVideoIndex < searchResults.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Music Search & Player</h1>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        searchResults={showDropdown ? searchResults : []}
        onSelectResult={selectSong}
        onSearch={() => searchSongs(searchQuery)} // Passing search action to handle search on click
      />
      {currentVideoIndex !== null && (
        <MusicCard
          video={searchResults[currentVideoIndex]}
          isPlaying={isPlaying}
          onPlayPause={playPause}
          onNext={playNext}
          onPrevious={playPrevious}
          playerRef={playerRef}
        />
      )}
    </div>
  );
};

export default MusicSearchPlayer;
