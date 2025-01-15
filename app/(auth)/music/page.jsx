// pages/index.js
"use client"

import React, { useState } from 'react';
import YouTube from 'react-youtube';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Customize the YouTube player options
  const youtubeOptions = {
    height: '0',  // Set height to 0 to hide iframe
    width: '0',   // Set width to 0 to hide iframe
    playerVars: {
      autoplay: 1,  // Autoplay the video
      controls: 0,  // Hide YouTube controls
      modestbranding: 1,  // Hide YouTube branding
      rel: 0,  // Don't show related videos at the end
      showinfo: 0,  // Hide video info (like title)
      iv_load_policy: 3,  // Hide annotations
      playsinline: 1,  // Play inline (important for mobile devices)
    },
  };

  const albumCoverUrl = "https://i.pinimg.com/736x/db/6b/d8/db6bd8db59673796910256ad753b964d.jpg"; // Replace with your own album cover URL

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-80 md:w-96">
        {/* Custom Album Cover */}
        <div
          onClick={() => setIsPlaying(true)}
          className="relative h-64 bg-gray-100 cursor-pointer rounded-xl"
          style={{
            backgroundImage: `url(${albumCoverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay Play Icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l14 9-14 9V3z" />
              </svg> */}
            </div>
          )}

          {/* Album Cover stays visible while audio plays */}
          {isPlaying && (
            <div className="absolute inset-0 bg-cover bg-center opacity-100 z-10" style={{ backgroundImage: `url(${albumCoverUrl})` }} />
          )}
        </div>

        {/* YouTube Video Embed (Only when Playing) */}
        {isPlaying && (
          <div className="relative pb-9/16" style={{ display: 'none' }}>
            <YouTube
              videoId="V8zXLMIjlcw" // Replace with the video ID of your choice
              opts={youtubeOptions}
              style={{ opacity: 0 }} // Hides the video but plays the audio
            />
          </div>
        )}

        {/* Music Player Info */}
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Now Playing</h2>
          <p className="text-lg font-medium text-gray-700">Song Title Here</p>
          <p className="text-sm text-gray-500">Artist Name</p>
        </div>

        {/* Play/Pause Button */}
        <div className="flex justify-center space-x-4 pb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transition-colors"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12v12H6z" />
              </svg> // Pause icon
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l14 9-14 9V3z" />
              </svg> // Play icon
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
