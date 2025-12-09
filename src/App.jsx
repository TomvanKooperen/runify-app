import React, { useState } from 'react';
import { Play, ArrowLeft, Music, Save, List, CheckCircle, Disc, X, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
const RunifyApp = () => {
  const [screen, setScreen] = useState('welcome');
  const [playlistName, setPlaylistName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [inputMode, setInputMode] = useState('distance-time'); // 'distance-time', 'distance-pace', 'pace-distance'
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [pace, setPace] = useState('');

  // --- Components ---

  const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyle = "w-3/4 mx-auto py-3 rounded-full font-semibold shadow-md transition-all duration-200 active:scale-95";
    const variants = {
      primary: "bg-slate-800 text-white hover:bg-slate-700",
      secondary: "bg-slate-600 text-white hover:bg-slate-500",
      spotify: "bg-green-500 text-white hover:bg-green-600",
      outline: "border-2 border-slate-800 text-slate-800 hover:bg-slate-100"
    };
    return (
      <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  };

  const ScreenContainer = ({ children, title, onBack, rightAction }) => (
    <div className="w-full h-full max-w-md mx-auto bg-indigo-50 flex flex-col relative overflow-hidden font-sans">
      {/* Status Bar Mock */}
      <div className="h-6 w-full bg-slate-800 opacity-10 mb-2"></div>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        {onBack ? (
          <button onClick={onBack} className="text-slate-800 hover:text-slate-600">
            <ArrowLeft size={24} />
          </button>
        ) : <div className="w-6"></div>}
        <div className="flex items-center gap-2">
          <Music size={20} className="text-slate-800" />
          <span className="font-bold text-slate-800">Runify</span>
        </div>
        <div className="w-6 flex justify-end">{rightAction}</div>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8 overflow-y-auto">
        {title && <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );

  // --- Screens ---

  const WelcomeScreen = () => (
    <div className="flex flex-col h-full text-center">

      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Runify</h1>
        <p className="text-slate-500">Let's create your perfect running playlist!</p>
      </div>

      <div className="w-full space-y-4 mb-8">
        <Button onClick={() => setScreen('questions')}>Create a playlist</Button>
        <Button variant="outline" onClick={() => setScreen('existing')}>Existing playlist</Button>
      </div>
    </div>
  );

  const IntervalConfigScreen = ({ onBack, settings, setSettings }) => {
    const handleChange = (field, value) => {
      setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
      <ScreenContainer title="Configure Interval" onBack={onBack}>
        <div className="space-y-6">
          {/* Warmup */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Warmup</label>
            <div className="relative">
              <input
                type="number"
                value={settings.warmup}
                onChange={(e) => handleChange('warmup', e.target.value)}
                className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                placeholder="Duration"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">min</span>
            </div>
          </div>

          {/* Interval Group */}
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Interval Cycle</h3>
            </div>

            {/* Cycles */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Cycles</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.cycles}
                  onChange={(e) => handleChange('cycles', e.target.value)}
                  className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                  placeholder="Number of cycles"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">x</span>
              </div>
            </div>

            {/* Fast Pace */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Fast Pace</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={settings.fastTime}
                    onChange={(e) => handleChange('fastTime', e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                    placeholder="Duration"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">min</span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={settings.fastPace}
                    onChange={(e) => handleChange('fastPace', e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                    placeholder="Pace"
                  />
                </div>
              </div>
            </div>

            {/* Slow Pace */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Slow Pace</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={settings.slowTime}
                    onChange={(e) => handleChange('slowTime', e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                    placeholder="Duration"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">min</span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={settings.slowPace}
                    onChange={(e) => handleChange('slowPace', e.target.value)}
                    className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                    placeholder="Pace"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cool Down */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Cool Down</label>
            <div className="relative">
              <input
                type="number"
                value={settings.cooldown}
                onChange={(e) => handleChange('cooldown', e.target.value)}
                className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                placeholder="Duration"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">min</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center w-full">
            <Button onClick={onBack}>Save Configuration</Button>
          </div>
        </div>
      </ScreenContainer>
    );
  };

  const QuestionsScreen = () => {
    // --- Local State for this screen ---
    const [distMode, setDistMode] = useState('Distance'); // Toggle state: Distance vs Time
    const [runType, setRunType] = useState('Free Run');   // Toggle state: Free Run vs Pace
    const [selectedGenres, setSelectedGenres] = useState(['Pop', 'Rock']); // Active chips
    const [targetDistance, setTargetDistance] = useState('');
    const [targetTime, setTargetTime] = useState('');

    // Interval Config State
    const [showIntervalConfig, setShowIntervalConfig] = useState(false);
    const [intervalSettings, setIntervalSettings] = useState({
      warmup: '',
      cycles: '',
      fastTime: '',
      fastPace: '',
      slowTime: '',
      slowPace: '',
      cooldown: ''
    });

    const [isYearEnabled, setIsYearEnabled] = useState(false);            // Checkbox state
    const [yearRange, setYearRange] = useState({ min: 2000, max: 2024 }); // Range state
    const [isGenreEnabled, setIsGenreEnabled] = useState(false);          // Genre checkbox state
    const [isMoodEnabled, setIsMoodEnabled] = useState(false);            // Mood checkbox state
    const [isPopularityEnabled, setIsPopularityEnabled] = useState(false);// Popularity checkbox state
    const [showMusicPrefs, setShowMusicPrefs] = useState(false);          // Master accordion state
    const [popularity, setPopularity] = useState(50);     // Popularity slider

    // Helper function to toggle genres on/off
    const toggleGenre = (genre) => {
      if (selectedGenres.includes(genre)) {
        setSelectedGenres(selectedGenres.filter(g => g !== genre)); // Remove if exists
      } else {
        setSelectedGenres([...selectedGenres, genre]); // Add if not exists
      }
    };

    if (showIntervalConfig) {
      return <IntervalConfigScreen onBack={() => setShowIntervalConfig(false)} settings={intervalSettings} setSettings={setIntervalSettings} />;
    }

    return (
      <ScreenContainer title="Preferences" onBack={() => setScreen('welcome')}>
        <div className="space-y-8 pb-8">
          {/* 1. TYPE OF RUN (Mandatory) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-800">Type of Run</label>
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Mandatory</span>
            </div>

            <div className="flex bg-slate-200 p-1 rounded-lg">
              {['Target Pace', 'Interval Run'].map((type) => (
                <button
                  key={type}
                  onClick={() => setRunType(type)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${runType === type ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Conditional Rendering: Only show Pace Input if "Target Pace" is selected */}
            {runType === 'Target Pace' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3 mt-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block ml-1">Distance</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      value={targetDistance}
                      onChange={(e) => setTargetDistance(e.target.value)}
                      className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">km</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block ml-1">Target Time</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 30"
                      value={targetTime}
                      onChange={(e) => setTargetTime(e.target.value)}
                      className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">min</span>
                  </div>
                </div>
                {targetDistance > 0 && targetTime > 0 && (
                  <div className="text-center p-3 bg-indigo-50 rounded-xl text-indigo-700 font-medium text-sm animate-in fade-in border border-indigo-100">
                    Estimated Pace: <span className="font-bold text-lg">{(parseFloat(targetTime) / parseFloat(targetDistance)).toFixed(2)}</span> min/km
                  </div>
                )}
              </div>
            )}

            {/* Conditional Rendering: Configure Interval Run Button */}
            {runType === 'Interval Run' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-3">
                <button
                  onClick={() => setShowIntervalConfig(true)}
                  className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold shadow-md hover:bg-slate-700 transition-all active:scale-95"
                >
                  Configure Interval Run
                </button>
              </div>
            )}
          </div>


          {/* --- MUSIC PREFERENCES ACCORDION --- */}
          <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => setShowMusicPrefs(!showMusicPrefs)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Music size={20} className="text-slate-800" />
                <span className="font-bold text-slate-800">Music Preferences</span>
              </div>
              {showMusicPrefs ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
            </button>

            {showMusicPrefs && (
              <div className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">

                {/* 3. MUSIC GENRE (Optional) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsGenreEnabled(!isGenreEnabled)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isGenreEnabled ? 'bg-slate-800 border-slate-800' : 'border-slate-300 bg-white'}`}>
                        {isGenreEnabled && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <label className="text-sm font-bold text-slate-800 cursor-pointer">Music Genre</label>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Optional</span>
                  </div>

                  {isGenreEnabled && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Input for searching/adding */}
                      <div className="relative mb-3">
                        <input
                          type="text"
                          placeholder="Search genres..."
                          className="w-full p-3 pl-10 bg-white border border-slate-300 rounded-lg text-sm focus:border-indigo-500 outline-none"
                        />
                        <Plus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>

                      {/* Filter Chips */}
                      <div className="flex flex-wrap gap-2">
                        {['Pop', 'Rock', 'EDM'].map(genre => {
                          const isSelected = selectedGenres.includes(genre);
                          return (
                            <button
                              key={genre}
                              onClick={() => toggleGenre(genre)}
                              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isSelected
                                ? 'bg-slate-800 border-slate-800 text-white'
                                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                              {genre}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. YEAR (Range Slider) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsYearEnabled(!isYearEnabled)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isYearEnabled ? 'bg-slate-800 border-slate-800' : 'border-slate-300 bg-white'}`}>
                        {isYearEnabled && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <label className="text-sm font-bold text-slate-800 cursor-pointer">Era / Year</label>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Optional</span>
                  </div>

                  {isYearEnabled && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex justify-between text-sm font-bold text-slate-800 mb-4">
                        <span>{yearRange.min}</span>
                        <span className="text-indigo-600 text-xs uppercase tracking-wider">Range</span>
                        <span>{yearRange.max}</span>
                      </div>

                      {/* Min Slider */}
                      <div className="mb-4">
                        <label className="text-xs text-slate-500 mb-1 block">From</label>
                        <input
                          type="range"
                          min="1950"
                          max="2024"
                          step="1"
                          value={yearRange.min}
                          onChange={(e) => {
                            const val = Math.min(Number(e.target.value), yearRange.max - 1);
                            setYearRange(prev => ({ ...prev, min: val }));
                          }}
                          className="w-full accent-slate-800 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                      </div>

                      {/* Max Slider */}
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">To</label>
                        <input
                          type="range"
                          min="1980"
                          max="2024"
                          step="1"
                          value={yearRange.max}
                          onChange={(e) => {
                            const val = Math.max(Number(e.target.value), yearRange.min + 1);
                            setYearRange(prev => ({ ...prev, max: val }));
                          }}
                          className="w-full accent-slate-800 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. MOOD (Dropdown) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsMoodEnabled(!isMoodEnabled)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isMoodEnabled ? 'bg-slate-800 border-slate-800' : 'border-slate-300 bg-white'}`}>
                        {isMoodEnabled && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <label className="text-sm font-bold text-slate-800 cursor-pointer">Mood</label>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Optional</span>
                  </div>

                  {isMoodEnabled && (
                    <div className="relative animate-in fade-in slide-in-from-top-2 duration-200">
                      <select className="w-full p-4 bg-white border border-slate-300 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium">
                        <option>Energetic & Hype</option>
                        <option>Chill & Relaxed</option>
                        <option>Focus & Deep</option>
                        <option>Happy & Upbeat</option>
                        <option>Aggressive</option>
                      </select>
                      {/* Custom arrow for dropdown */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. POPULARITY (Slider) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsPopularityEnabled(!isPopularityEnabled)}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPopularityEnabled ? 'bg-slate-800 border-slate-800' : 'border-slate-300 bg-white'}`}>
                        {isPopularityEnabled && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <label className="text-sm font-bold text-slate-800 cursor-pointer">Popularity</label>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Optional</span>
                  </div>

                  {isPopularityEnabled && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex justify-between text-xs text-slate-400 font-bold mb-4">
                        <span>Niche</span>
                        <span>Mainstream</span>
                      </div>
                      <input
                        type="range"
                        className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        value={popularity}
                        onChange={(e) => setPopularity(e.target.value)}
                      />
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Generate Button - Centered */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setScreen('generated')}
            className="px-8 py-3 bg-slate-800 text-white rounded-full font-semibold shadow-md hover:bg-slate-700 transition-all active:scale-95"
          >
            Generate playlist
          </button>
        </div>
      </ScreenContainer>
    );
  };

  const ExistingPlaylistScreen = () => {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [playlistsToDelete, setPlaylistsToDelete] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Toggle delete mode
    const toggleDeleteMode = () => {
      setIsDeleteMode(!isDeleteMode);
      setSelectedPlaylist(null); // Clear play selection
      setPlaylistsToDelete([]); // Clear delete selection
    };

    // Toggle item for deletion
    const toggleDeleteSelection = (list) => {
      if (playlistsToDelete.includes(list)) {
        setPlaylistsToDelete(playlistsToDelete.filter(item => item !== list));
      } else {
        setPlaylistsToDelete([...playlistsToDelete, list]);
      }
    };

    return (
      <ScreenContainer
        title={isDeleteMode ? "Select to Delete" : "Your Playlists"}
        onBack={() => setScreen('welcome')}
        rightAction={
          <button
            onClick={toggleDeleteMode}
            className={`p-2 rounded-full transition-colors ${isDeleteMode ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <Trash2 size={20} />
          </button>
        }
      >
        <p className="text-slate-500 mb-4">{isDeleteMode ? "Select playlists to remove." : "Select a prior created playlist."}</p>
        <div className="space-y-3">
          {['Morning Jog', 'Marathon Training', 'Sunday Chill', 'High Intensity'].map((list, i) => {
            const isSelected = isDeleteMode ? playlistsToDelete.includes(list) : selectedPlaylist === list;

            // Dynamic styles based on mode
            let containerStyle = "bg-white border-indigo-100 hover:bg-indigo-50";
            let iconBoxStyle = "bg-indigo-100 text-indigo-600";
            let textStyle = "text-slate-700";

            if (isDeleteMode) {
              if (isSelected) {
                containerStyle = "bg-red-50 border-red-500 ring-1 ring-red-500";
                iconBoxStyle = "bg-red-200 text-red-800";
                textStyle = "text-red-900";
              } else {
                containerStyle = "bg-white border-slate-200 hover:bg-red-50";
                iconBoxStyle = "bg-slate-100 text-slate-400";
              }
            } else if (isSelected) {
              containerStyle = "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500";
              iconBoxStyle = "bg-indigo-200 text-indigo-800";
              textStyle = "text-indigo-900";
            }

            return (
              <div
                key={i}
                onClick={() => isDeleteMode ? toggleDeleteSelection(list) : setSelectedPlaylist(list)}
                className={`p-4 rounded-lg shadow-sm border flex items-center justify-between cursor-pointer transition-all ${containerStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBoxStyle}`}>
                    <Music size={20} />
                  </div>
                  <span className={`font-medium ${textStyle}`}>{list}</span>
                </div>
                {isDeleteMode ? (
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-red-500 border-red-500' : 'border-slate-300 bg-white'}`}>
                    {isSelected && <CheckCircle size={14} className="text-white" />}
                  </div>
                ) : (
                  isSelected ? <CheckCircle size={20} className="text-indigo-600" /> : <Play size={16} className="text-slate-400" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-8 flex justify-center">
          {isDeleteMode ? (
            <button
              onClick={() => playlistsToDelete.length > 0 && setShowConfirmModal(true)}
              disabled={playlistsToDelete.length === 0}
              className={`px-8 py-3 rounded-full font-semibold shadow-md transition-all active:scale-95 ${playlistsToDelete.length > 0
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
            >
              Delete Selected ({playlistsToDelete.length})
            </button>
          ) : (
            <button
              onClick={() => selectedPlaylist && setScreen('spotify')}
              disabled={!selectedPlaylist}
              className={`px-8 py-3 rounded-full font-semibold shadow-md transition-all active:scale-95 ${selectedPlaylist
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
            >
              Play playlist on Spotify
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirmModal && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white w-full rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                  <Trash2 size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2">Delete Playlists?</h3>
                <p className="text-slate-500">
                  Are you sure you want to delete {playlistsToDelete.length} playlist{playlistsToDelete.length !== 1 && 's'}? This action cannot be undone.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setIsDeleteMode(false);
                    setPlaylistsToDelete([]);
                    // Logic to actually delete would go here
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg hover:bg-red-600 transition-all active:scale-95"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </ScreenContainer>
    );
  };

  const GeneratedPlaylistScreen = () => (
    <ScreenContainer title="Generated Playlist" onBack={() => setScreen('questions')}>
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex-1 min-h-[300px]">
        {/* Mock Song List */}
        {[
          { title: "Eye of the Tiger", artist: "Survivor" },
          { title: "Stronger", artist: "Kanye West" },
          { title: "Can't Hold Us", artist: "Macklemore" },
          { title: "Run the World", artist: "Beyoncé" },
          { title: "Lose Yourself", artist: "Eminem" },
        ].map((song, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
            <span className="text-slate-400 font-mono text-sm">{i + 1}</span>
            <div>
              <p className="font-medium text-slate-800 text-sm">{song.title}</p>
              <p className="text-xs text-slate-500">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mt-auto flex flex-col items-center gap-4">
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-8 py-3 bg-slate-800 text-white rounded-full font-semibold shadow-md hover:bg-slate-700 transition-all active:scale-95"
        >
          Save playlist
        </button>
        <button
          onClick={() => setScreen('spotify')}
          className="px-8 py-3 bg-green-500 text-white rounded-full font-semibold shadow-md hover:bg-green-600 transition-all active:scale-95"
        >
          Play playlist on Spotify
        </button>
      </div>

      {/* Save Modal Overlay */}
      {showSaveModal && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-2xl p-6 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 text-white p-4 -mx-6 -mt-6 rounded-t-2xl mb-6">
              <h3 className="font-bold text-lg">Save Playlist</h3>
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-2">Name:</label>
            <input
              type="text"
              className="w-full p-3 border border-slate-300 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. My Morning Run"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />

            <div className="flex justify-center w-full">
              <Button onClick={() => {
                setShowSaveModal(false);
                // In a real app, logic to save would go here
              }}>
                Save playlist
              </Button>
            </div>
            <button
              onClick={() => setShowSaveModal(false)}
              className="w-full justify-center text-slate-500 text-sm mt-4 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </ScreenContainer>
  );

  const SpotifyScreen = () => (
    <div className="w-full h-full bg-[#1DB954] flex flex-col items-center justify-center text-white relative">
      <Music size={80} className="mb-6 animate-pulse" />
      <h2 className="text-4xl font-bold mb-2 tracking-tighter">Spotify</h2>
      <p className="text-white/80 text-lg">Playing your playlist...</p>

      <button
        onClick={() => setScreen('welcome')}
        className="absolute bottom-12 px-6 py-2 bg-black/20 hover:bg-black/30 rounded-full text-sm font-medium transition-colors"
      >
        Return to Runify
      </button>
    </div>
  );

  // --- Main Router ---

  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen />;
      case 'questions': return <QuestionsScreen />;
      case 'existing': return <ExistingPlaylistScreen />;
      case 'generated': return <GeneratedPlaylistScreen />;
      case 'spotify': return <SpotifyScreen />;
      default: return <WelcomeScreen />;
    }
  };

  return (
    <div className="w-full h-screen bg-slate-200 flex items-center justify-center p-4">
      {/* Phone Bezel */}
      <div className="w-full max-w-[375px] h-[667px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-50"></div>
        {renderScreen()}
      </div>
    </div>
  );
};

export default RunifyApp;