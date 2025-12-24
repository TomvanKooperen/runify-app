import React from 'react';
import { Music } from 'lucide-react';

const SpotifyScreen = ({ setScreen, currentPlaylist }) => (
    <div className="w-full h-full bg-[#1DB954] flex flex-col items-center justify-center text-white relative">
        <Music size={80} className="mb-6 animate-pulse" />
        <h2 className="text-4xl font-bold mb-2 tracking-tighter">Spotify</h2>
        <p className="text-white/80 text-lg">Playing {currentPlaylist ? currentPlaylist.name : 'your playlist'}...</p>

        <button
            onClick={() => setScreen('welcome')}
            className="absolute bottom-12 px-6 py-2 bg-black/20 hover:bg-black/30 rounded-full text-sm font-medium transition-colors"
        >
            Return to Runify
        </button>
    </div>
);

export default SpotifyScreen;
