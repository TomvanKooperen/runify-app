import React, { useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import ExistingPlaylistScreen from './screens/ExistingPlaylistScreen';
import GeneratedPlaylistScreen from './screens/GeneratedPlaylistScreen';
import SpotifyScreen from './screens/SpotifyScreen';

const RunifyApp = () => {
  const [screen, setScreen] = useState('welcome');
  const [playlistName, setPlaylistName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Potential unused legacy state, kept for safety but seemingly unlinked
  const [inputMode, setInputMode] = useState('distance-time');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [pace, setPace] = useState('');

  const [selectedGenres, setSelectedGenres] = useState([]); // Shared state for genre filtering
  const [isYearEnabled, setIsYearEnabled] = useState(false);            // Shared checkbox state
  const [yearRange, setYearRange] = useState({ min: 2000, max: 2024 }); // Shared range state
  const [isMoodEnabled, setIsMoodEnabled] = useState(false);            // Shared mood checkbox state
  const [mood, setMood] = useState('Euphoric & Energetic');             // Shared mood state
  const [isPopularityEnabled, setIsPopularityEnabled] = useState(false);// Shared popularity checkbox state
  const [popularity, setPopularity] = useState(50);                     // Shared popularity slider state

  // --- Run Configuration State ---
  const [runType, setRunType] = useState('Free Run');
  const [targetDistance, setTargetDistance] = useState('');
  const [targetTime, setTargetTime] = useState('');
  // Target Pace Warmup/Cooldown State
  const [hasWarmupCooldown, setHasWarmupCooldown] = useState(false);
  const [paceWarmupTime, setPaceWarmupTime] = useState('');
  const [paceWarmupPace, setPaceWarmupPace] = useState('');
  const [paceCooldownTime, setPaceCooldownTime] = useState('');
  const [paceCooldownPace, setPaceCooldownPace] = useState('');

  // Interval Config State
  const [intervalSettings, setIntervalSettings] = useState({
    warmup: '',
    cycles: '',
    fastTime: '',
    fastPace: '',
    slowTime: '',
    slowPace: '',
    cooldown: ''
  });

  // --- Playlist Management State ---
  const [savedPlaylists, setSavedPlaylists] = useState(() => {
    const saved = localStorage.getItem('runify_playlists');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const savePlaylist = (name, songs) => {
    const newPlaylist = {
      id: Date.now(),
      name: name || `Run ${new Date().toLocaleDateString()}`,
      songs,
      createdAt: new Date().toISOString()
    };
    const updated = [newPlaylist, ...savedPlaylists];
    setSavedPlaylists(updated);
    localStorage.setItem('runify_playlists', JSON.stringify(updated));
  };

  const deletePlaylist = (id) => {
    const updated = savedPlaylists.filter(p => p.id !== id);
    setSavedPlaylists(updated);
    localStorage.setItem('runify_playlists', JSON.stringify(updated));
  };

  // --- Main Router ---
  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen setScreen={setScreen} />;
      case 'questions': return <QuestionsScreen
        setScreen={setScreen}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        yearRange={yearRange}
        setYearRange={setYearRange}
        isYearEnabled={isYearEnabled}
        setIsYearEnabled={setIsYearEnabled}
        isMoodEnabled={isMoodEnabled}
        setIsMoodEnabled={setIsMoodEnabled}
        mood={mood}
        setMood={setMood}
        isPopularityEnabled={isPopularityEnabled}
        setIsPopularityEnabled={setIsPopularityEnabled}
        popularity={popularity}
        setPopularity={setPopularity}
        runType={runType}
        setRunType={setRunType}
        targetDistance={targetDistance}
        setTargetDistance={setTargetDistance}
        targetTime={targetTime}
        setTargetTime={setTargetTime}
        hasWarmupCooldown={hasWarmupCooldown}
        setHasWarmupCooldown={setHasWarmupCooldown}
        paceWarmupTime={paceWarmupTime}
        setPaceWarmupTime={setPaceWarmupTime}
        paceWarmupPace={paceWarmupPace}
        setPaceWarmupPace={setPaceWarmupPace}
        paceCooldownTime={paceCooldownTime}
        setPaceCooldownTime={setPaceCooldownTime}
        paceCooldownPace={paceCooldownPace}
        setPaceCooldownPace={setPaceCooldownPace}
        intervalSettings={intervalSettings}
        setIntervalSettings={setIntervalSettings}
      />;
      case 'existing': return <ExistingPlaylistScreen
        setScreen={setScreen}
        savedPlaylists={savedPlaylists}
        deletePlaylist={deletePlaylist}
        setCurrentPlaylist={setCurrentPlaylist}
      />;
      case 'generated': return <GeneratedPlaylistScreen
        setScreen={setScreen}
        savePlaylist={savePlaylist}
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
        selectedGenres={selectedGenres}
        yearRange={yearRange}
        isYearEnabled={isYearEnabled}
        isMoodEnabled={isMoodEnabled}
        mood={mood}
        isPopularityEnabled={isPopularityEnabled}
        popularity={popularity}
        runType={runType}
        targetDistance={targetDistance}
        targetTime={targetTime}
        hasWarmupCooldown={hasWarmupCooldown}
        paceWarmupTime={paceWarmupTime}
        paceWarmupPace={paceWarmupPace}
        paceCooldownTime={paceCooldownTime}
        paceCooldownPace={paceCooldownPace}
        intervalSettings={intervalSettings}
      />;
      case 'spotify': return <SpotifyScreen setScreen={setScreen} currentPlaylist={currentPlaylist} />;
      default: return <WelcomeScreen setScreen={setScreen} />;
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-white overflow-hidden">
      {renderScreen()}
    </div>
  );
};

export default RunifyApp;
