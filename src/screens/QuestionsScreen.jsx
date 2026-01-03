import React, { useState } from 'react';
import { Music, ChevronUp, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import ScreenContainer from '../components/ScreenContainer';
import GenresSection from '../components/GenresSection';
import IntervalConfigScreen from './IntervalConfigScreen';

const QuestionsScreen = ({
    setScreen,
    selectedGenres,
    setSelectedGenres,
    yearRange,
    setYearRange,
    isYearEnabled,

    setIsYearEnabled,
    mood,
    setMood,
    isMoodEnabled,
    setIsMoodEnabled,
    isPopularityEnabled,
    setIsPopularityEnabled,
    popularity,
    setPopularity,
    runType,
    setRunType,
    targetDistance,
    setTargetDistance,
    targetTime,
    setTargetTime,
    hasWarmupCooldown,
    setHasWarmupCooldown,
    paceWarmupTime,
    setPaceWarmupTime,
    paceWarmupPace,
    setPaceWarmupPace,
    paceCooldownTime,
    setPaceCooldownTime,
    paceCooldownPace,
    setPaceCooldownPace,
    intervalSettings,
    setIntervalSettings
}) => {
    // --- Local State for this screen ---
    const [distMode, setDistMode] = useState('Distance'); // Toggle state: Distance vs Time
    // runType, targetDistance, targetTime are passed as props

    // Target Pace Warmup/Cooldown State - Passed as props

    // Interval Config State
    const [showIntervalConfig, setShowIntervalConfig] = useState(false);
    // intervalSettings passed as props

    // isYearEnabled and yearRange are passed as props
    const [isGenreEnabled, setIsGenreEnabled] = useState(false);          // Genre checkbox state

    const [showMusicPrefs, setShowMusicPrefs] = useState(false);          // Master accordion state
    const [showWarning, setShowWarning] = useState(false);                // Warning popup state

    const isRunValid = () => {
        if (runType === 'Target Pace') {
            return targetDistance > 0 && targetTime > 0;
        }
        if (runType === 'Interval Run') {
            const { warmup, cycles, fastTime, slowTime, cooldown } = intervalSettings;
            // Ensure all fields have values
            return warmup && cycles && fastTime && slowTime && cooldown;
        }
        return false;
    };

    const handleGenerateClick = () => {
        if (!isRunValid()) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }
        setScreen('generated');
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
                                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${runType === type ? 'bg-[#F59E0B] shadow text-white' : 'text-slate-500 hover:text-slate-700'
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
                                <label className="text-sm font-bold text-[#1e293b] mb-1 block ml-1">Distance</label>
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
                                <label className="text-sm font-bold text-[#1e293b] mb-1 block ml-1">Target Time</label>
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
                                <>
                                    <div className="text-center p-3 bg-indigo-50 rounded-xl text-[#1e293b] font-medium text-sm animate-in fade-in border border-indigo-100">
                                        Estimated Pace: <span className="font-bold text-lg">{(parseFloat(targetTime) / parseFloat(targetDistance)).toFixed(2)}</span> min/km
                                    </div>

                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2 animate-in fade-in slide-in-from-top-1">
                                        <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setHasWarmupCooldown(!hasWarmupCooldown)}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hasWarmupCooldown ? 'bg-[#1e293b] border-[#1e293b]' : 'border-slate-300 bg-white'}`}>
                                                {hasWarmupCooldown && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            <label className="text-sm font-bold text-[#1e293b] cursor-pointer">Add Warmup & Cool Down</label>
                                        </div>

                                        {hasWarmupCooldown && (
                                            <div className="space-y-4 pt-2 border-t border-slate-200 mt-2">
                                                <div className="text-sm text-slate-500 bg-white p-2 rounded border border-slate-100">
                                                    <span className="font-bold text-[#1e293b]">Recommendation:</span> <span className="font-medium">{(parseFloat(targetTime) / parseFloat(targetDistance) + 1).toFixed(2)} - {(parseFloat(targetTime) / parseFloat(targetDistance) + 1.5).toFixed(2)}</span> min/km
                                                </div>

                                                {/* Warmup */}
                                                <div>
                                                    <span className="text-sm font-bold text-[#1e293b] uppercase tracking-wider block mb-1">Warmup</span>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="number"
                                                                placeholder="Time"
                                                                value={paceWarmupTime}
                                                                onChange={e => setPaceWarmupTime(e.target.value)}
                                                                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">min</span>
                                                        </div>
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Pace"
                                                                value={paceWarmupPace}
                                                                onChange={e => setPaceWarmupPace(e.target.value)}
                                                                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">min/km</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Cooldown */}
                                                <div>
                                                    <span className="text-sm font-bold text-[#1e293b] uppercase tracking-wider block mb-1">Cool Down</span>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="number"
                                                                placeholder="Time"
                                                                value={paceCooldownTime}
                                                                onChange={e => setPaceCooldownTime(e.target.value)}
                                                                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">min</span>
                                                        </div>
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Pace"
                                                                value={paceCooldownPace}
                                                                onChange={e => setPaceCooldownPace(e.target.value)}
                                                                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">min/km</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Conditional Rendering: Configure Interval Run Button */}
                    {runType === 'Interval Run' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-3">
                            {intervalSettings.warmup && intervalSettings.cycles && intervalSettings.fastTime && intervalSettings.slowTime && intervalSettings.cooldown ? (
                                <>
                                    <button
                                        onClick={() => setShowIntervalConfig(true)}
                                        className="w-full py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold shadow-sm hover:bg-green-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} className="text-green-600" />
                                        <span>Configuration Saved, Click to edit</span>
                                    </button>

                                    <div className="mt-2 bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex items-center justify-between text-xs">
                                        <div className="flex flex-col items-center flex-1 border-r border-slate-100">
                                            <span className="font-bold text-slate-800 text-sm">{intervalSettings.warmup}m</span>
                                            <span className="text-slate-400">Warmup</span>
                                        </div>
                                        <div className="flex flex-col items-center flex-1 border-r border-slate-100 px-2">
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-slate-800 text-sm">{intervalSettings.cycles}x</span>
                                            </div>
                                            <span className="text-slate-400 text-[10px] text-center">{intervalSettings.fastTime}m / {intervalSettings.slowTime}m</span>
                                        </div>
                                        <div className="flex flex-col items-center flex-1">
                                            <span className="font-bold text-slate-800 text-sm">{intervalSettings.cooldown}m</span>
                                            <span className="text-slate-400">Cooldown</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowIntervalConfig(true)}
                                    className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold shadow-md hover:bg-slate-700 transition-all active:scale-95"
                                >
                                    Configure Interval Run
                                </button>
                            )}
                        </div>
                    )}
                </div>


                {/* --- MUSIC PREFERENCES ACCORDION --- */}
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <button
                        onClick={() => setShowMusicPrefs(!showMusicPrefs)}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${showMusicPrefs ? 'bg-[#F59E0B] hover:bg-[#e08e09]' : 'bg-slate-50 hover:bg-slate-100'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Music size={20} className={showMusicPrefs ? 'text-white' : 'text-slate-800'} />
                            <span className={`font-bold ${showMusicPrefs ? 'text-white' : 'text-slate-800'}`}>Music Preferences</span>
                        </div>
                        {showMusicPrefs ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-slate-500" />}
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
                                    <GenresSection
                                        selectedGenres={selectedGenres}
                                        setSelectedGenres={setSelectedGenres}
                                    />
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
                                            <span className="text-[#1e293b] text-xs uppercase tracking-wider">Range</span>
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
                                        <select
                                            value={mood}
                                            onChange={(e) => setMood(e.target.value)}
                                            className="w-full p-4 bg-white border border-slate-300 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
                                        >
                                            <option>Euphoric & Energetic</option>
                                            <option>Chill & Mellow</option>
                                            <option>Somber & Melancholy</option>
                                            <option>Focused & Intense</option>
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
                                            className="w-full accent-[#1e293b] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
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
            <div className="mt-8 flex flex-col items-center relative">
                <button
                    onClick={handleGenerateClick}
                    className={`px-8 py-3 rounded-full font-semibold shadow-md transition-all active:scale-95 ${isRunValid()
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
                        }`}
                >
                    Generate playlist
                </button>

                {showWarning && (
                    <div className="absolute -top-12 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-in slide-in-from-bottom-2 fade-in duration-200 whitespace-nowrap z-10">
                        <AlertCircle size={16} />
                        <span>Please input your run details first</span>
                    </div>
                )}
            </div>
        </ScreenContainer>
    );
};

export default QuestionsScreen;
