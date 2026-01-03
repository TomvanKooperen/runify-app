import React, { useState, useEffect, useCallback } from 'react';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import { RotateCw } from 'lucide-react';

const GeneratedPlaylistScreen = ({ setScreen, savePlaylist, playlistName, setPlaylistName, showSaveModal, setShowSaveModal, selectedGenres, isYearEnabled, yearRange, isMoodEnabled, mood, isPopularityEnabled, popularity, runType, targetDistance, targetTime, hasWarmupCooldown, paceWarmupTime, paceWarmupPace, paceCooldownTime, paceCooldownPace, intervalSettings }) => {
    const [showDebug, setShowDebug] = useState(false);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSongs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/data/songs.csv');
            const text = await response.text();

            // Simple CSV Parser with quote handling
            const lines = text.split('\n');

            let parsedData = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                // This regex splits by comma that is NOT inside quotes
                const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                // Basic handling to avoid index out of bounds
                if (currentLine.length < 21) continue; // Need up to index 20 for valence

                const obj = {};
                // Mapping based on actual CSV headers: 
                // 1: track_name, 2: track_artist, 6: release_date, 9: genre
                // 3: track_popularity
                // 11: danceability, 12: energy, 16: speechiness, 17: acousticness, 18: instrumentalness, 20: valence
                obj.title = currentLine[1]?.trim();
                obj.artist = currentLine[2]?.trim();
                obj.genre = currentLine[9]?.trim();
                obj.popularity = parseInt(currentLine[3]);

                const releaseDate = currentLine[6]?.trim();
                // Extract year from YYYY-MM-DD or YYYY
                obj.year = releaseDate ? parseInt(releaseDate.substring(0, 4)) : null;

                // Parse Audio Features
                obj.danceability = parseFloat(currentLine[11]);
                obj.energy = parseFloat(currentLine[12]);
                obj.speechiness = parseFloat(currentLine[16]);
                obj.acousticness = parseFloat(currentLine[17]);
                obj.instrumentalness = parseFloat(currentLine[18]);
                obj.valence = parseFloat(currentLine[20]);
                obj.tempo = parseFloat(currentLine[21]);
                obj.duration_ms = parseInt(currentLine[22]);

                if (obj.title && obj.artist) {
                    parsedData.push(obj);
                }
            }

            // Filter by selected genres if any are selected
            if (selectedGenres && selectedGenres.length > 0) {
                parsedData = parsedData.filter(song =>
                    song.genre && selectedGenres.some(g => g.toLowerCase() === song.genre.toLowerCase())
                );
            }

            // Filter by year range if enabled
            if (isYearEnabled && yearRange) {
                parsedData = parsedData.filter(song =>
                    song.year && song.year >= yearRange.min && song.year <= yearRange.max
                );
            }

            // Filter by Mood if enabled
            if (isMoodEnabled && mood) {
                parsedData = parsedData.filter(song => {
                    // Ensure all features are valid numbers
                    if (isNaN(song.energy) || isNaN(song.valence)) return false;

                    switch (mood) {
                        case 'Euphoric & Energetic':
                            return song.energy > 0.70 &&
                                song.valence > 0.60 &&
                                song.danceability > 0.60 &&
                                song.speechiness < 0.33;

                        case 'Chill & Mellow':
                            return song.energy < 0.50 &&
                                song.valence > 0.50 &&
                                song.acousticness > 0.40 &&
                                song.danceability < 0.60;

                        case 'Somber & Melancholy':
                            return song.valence < 0.35 &&
                                song.energy < 0.40 &&
                                song.danceability < 0.45 &&
                                song.acousticness > 0.30;

                        case 'Focused & Intense':
                            return song.instrumentalness > 0.70 &&
                                song.energy > 0.50 &&
                                song.speechiness < 0.10;

                        default:
                            return true;
                    }
                });
            }

            // Filter by Popularity if enabled
            if (isPopularityEnabled) {
                parsedData = parsedData.filter(song => {
                    if (isNaN(song.popularity)) return false;
                    // Slider is 0-100. Filter songs within +/- 20 range of the slider value?
                    // Or if Mainstream (high), just want high popularity
                    // If Niche (low), want low popularity
                    // Let's do a weighted approach:
                    // Range width = 30
                    return Math.abs(song.popularity - popularity) <= 25;
                });
            }

            if (parsedData.length > 0) {
                let finalSongs = [];

                // Helper to select songs for a duration and pace
                const selectSongsForPhase = (durationMinutes, paceInput, phaseName) => {
                    if (!durationMinutes || !paceInput) return [];

                    let paceVal = 0;
                    // Handle "mm:ss" or decimal
                    if (typeof paceInput === 'string' && paceInput.includes(':')) {
                        const [m, s] = paceInput.split(':').map(Number);
                        paceVal = m + (s / 60);
                    } else {
                        paceVal = parseFloat(paceInput);
                    }

                    if (!paceVal || paceVal <= 0) return [];

                    const targetBPM = 210 - (5 * paceVal);
                    const minBPM = targetBPM * 1;
                    const maxBPM = targetBPM * 1.03;

                    let pool = parsedData.filter(song =>
                        song.tempo >= minBPM && song.tempo <= maxBPM
                    );

                    if (pool.length === 0) {
                        console.warn(`No songs found for ${phaseName} (BPM ~${targetBPM}), using all songs.`);
                        pool = parsedData;
                    }

                    const shuffled = pool.sort(() => 0.5 - Math.random());
                    const selected = [];
                    let currentDur = 0;
                    const targetDurMs = durationMinutes * 60 * 1000;

                    for (const song of shuffled) {
                        // Avoid duplicates if possible (simple check by title)
                        if (finalSongs.some(s => s.title === song.title) || selected.some(s => s.title === song.title)) continue;

                        // Add songs until we reach the target duration. 
                        // Allow overshooting (no upper bound check here) to ensure we never fall short.
                        selected.push({ ...song, phase: phaseName }); // Add phase tag for debug
                        currentDur += song.duration_ms;

                        // Stop ONLY when we have met or exceeded the target duration
                        if (currentDur >= targetDurMs) break;
                    }
                    return selected;
                };

                if (runType === 'Target Pace' && targetDistance && targetTime) {
                    const dist = parseFloat(targetDistance);
                    const time = parseFloat(targetTime);

                    if (dist > 0 && time > 0) {
                        // 1. Warmup
                        if (hasWarmupCooldown) {
                            const warmupSongs = selectSongsForPhase(parseFloat(paceWarmupTime), paceWarmupPace, 'Warmup');
                            finalSongs = [...finalSongs, ...warmupSongs];
                        }

                        // 2. Main Run
                        const mainPace = time / dist;
                        const mainSongs = selectSongsForPhase(time, mainPace, 'Run');
                        finalSongs = [...finalSongs, ...mainSongs];

                        // 3. Cooldown
                        if (hasWarmupCooldown) {
                            const cooldownSongs = selectSongsForPhase(parseFloat(paceCooldownTime), paceCooldownPace, 'Cooldown');
                            finalSongs = [...finalSongs, ...cooldownSongs];
                        }

                    } else {
                        // Fallback if invalid input
                        finalSongs = parsedData.sort(() => 0.5 - Math.random()).slice(0, 10);
                    }
                } else if (runType === 'Interval Run' && intervalSettings) {
                    const { warmup, cycles, fastTime, fastPace, slowTime, slowPace, cooldown } = intervalSettings;
                    const numCycles = parseInt(cycles) || 0;

                    // 1. Warmup (uses slowPace)
                    if (warmup && parseFloat(warmup) > 0) {
                        const warmupSongs = selectSongsForPhase(parseFloat(warmup), slowPace, 'Warmup');
                        finalSongs = [...finalSongs, ...warmupSongs];
                    }

                    // 2. Cycles
                    for (let i = 1; i <= numCycles; i++) {
                        // Fast Phase
                        if (fastTime && parseFloat(fastTime) > 0) {
                            const fastSongs = selectSongsForPhase(parseFloat(fastTime), fastPace, `Cycle ${i} (Fast)`);
                            finalSongs = [...finalSongs, ...fastSongs];
                        }
                        // Slow Phase
                        if (slowTime && parseFloat(slowTime) > 0) {
                            const slowSongs = selectSongsForPhase(parseFloat(slowTime), slowPace, `Cycle ${i} (Slow)`);
                            finalSongs = [...finalSongs, ...slowSongs];
                        }
                    }

                    // 3. Cooldown (uses slowPace)
                    if (cooldown && parseFloat(cooldown) > 0) {
                        const cooldownSongs = selectSongsForPhase(parseFloat(cooldown), slowPace, 'Cooldown');
                        finalSongs = [...finalSongs, ...cooldownSongs];
                    }

                } else {
                    // Default behavior: Shuffle and pick 10
                    finalSongs = parsedData.sort(() => 0.5 - Math.random()).slice(0, 10);
                }

                setSongs(finalSongs);
            } else {
                // Fallback if no songs match
                setSongs([]);
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
            setSongs([]);
        } finally {
            setLoading(false);
        }
    }, [selectedGenres, isYearEnabled, yearRange, isMoodEnabled, mood, isPopularityEnabled, popularity, runType, targetDistance, targetTime, hasWarmupCooldown, paceWarmupTime, paceWarmupPace, paceCooldownTime, paceCooldownPace, intervalSettings]);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    return (
        <ScreenContainer
            title="Generated Playlist"
            onBack={() => setScreen('questions')}
            rightAction={
                <button
                    onClick={fetchSongs}
                    className="px-3 py-1.5 bg-[#F59E0B] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-opacity-90 transition-all active:scale-95"
                >
                    Regenerate Playlist
                </button>
            }
        >
            <div className="flex justify-between items-center mb-2">
                {showDebug && (
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        Total: {Math.floor(songs.reduce((acc, s) => acc + (s.duration_ms || 0), 0) / 60000)}m {Math.floor((songs.reduce((acc, s) => acc + (s.duration_ms || 0), 0) % 60000) / 1000)}s
                    </span>
                )}
                <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-xs text-slate-400 hover:text-slate-600 underline ml-auto"
                >
                    {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                </button>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex-1 min-h-[300px] overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-runify-blue rounded-full animate-spin mb-4"></div>
                        <p>Curating your playlist...</p>
                    </div>
                ) : (
                    songs.map((song, i) => (
                        <div key={i} className="flex flex-col py-3 border-b border-slate-100 last:border-0">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 font-mono text-sm w-4 text-center">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 text-sm truncate">{song.title}</p>
                                    <p className="text-xs text-slate-500 truncate">{song.artist}</p>
                                </div>
                            </div>
                            {showDebug && (
                                <div className="ml-7 mt-2 p-2 bg-slate-50 rounded text-[10px] text-slate-500 font-mono grid grid-cols-2 gap-x-4 gap-y-1">
                                    <span className="col-span-2 font-bold text-slate-600">Pop: {song.popularity}</span>
                                    <span>Year: {song.year}</span>
                                    <span>Genre: {song.genre}</span>
                                    <span>Energy: {song.energy?.toFixed(2)}</span>
                                    <span>Valence: {song.valence?.toFixed(2)}</span>
                                    <span>Dance: {song.danceability?.toFixed(2)}</span>
                                    <span>Acoustic: {song.acousticness?.toFixed(2)}</span>
                                    <span>Speech: {song.speechiness?.toFixed(2)}</span>
                                    <span>Instrum: {song.instrumentalness?.toFixed(2)}</span>
                                    <span className="col-span-2 font-bold text-runify-blue">BPM: {song.tempo?.toFixed(1)} {song.phase ? `(${song.phase})` : ''}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="space-y-3 mt-auto flex flex-col items-center gap-4">
                <button
                    onClick={() => setShowSaveModal(true)}
                    className="px-8 py-3 bg-[#1e293b] text-white rounded-full font-semibold shadow-md hover:bg-opacity-90 transition-all active:scale-95"
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
                        <div className="bg-[#F59E0B] text-white p-4 -mx-6 -mt-6 rounded-t-2xl mb-6">
                            <h3 className="font-bold text-lg">Save Playlist</h3>
                        </div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">Name:</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-lg mb-6 focus:ring-2 focus:ring-runify-blue outline-none"
                            placeholder="e.g. My Morning Run"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                        />

                        <div className="flex justify-center w-full">
                            <Button onClick={() => {
                                savePlaylist(playlistName, songs);
                                setShowSaveModal(false);
                                setScreen('existing');
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
};

export default GeneratedPlaylistScreen;
