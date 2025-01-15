// MusicCard.js
import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

const MusicCard = ({ video, isPlaying, onPlayPause, onNext, onPrevious, playerRef }) => {
  if (!video || !video.snippet) {
    return null;
  }

  const youtubeOptions = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      playsinline: 1,
    },
  };

  useEffect(() => {
    if (playerRef.current) {
      isPlaying ? playerRef.current.playVideo() : playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
      <img
        src="https://i.pinimg.com/736x/db/6b/d8/db6bd8db59673796910256ad753b964d.jpg"
        alt={video.snippet?.title || 'No Title'}
        className="w-40 h-40 rounded-md mb-4"
      />
      <p className="text-lg font-semibold text-center mb-2">{video.snippet?.title || 'No Title'}</p>
      <YouTube
        videoId={video.id?.videoId}
        opts={youtubeOptions}
        onReady={(e) => (playerRef.current = e.target)}
      />
      <div className="flex space-x-4 mt-4">
        <button onClick={onPrevious} className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400">⏮️</button>
        <button onClick={onPlayPause} className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={onNext} className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400">⏭️</button>
      </div>
    </div>
  );
};

export default MusicCard;