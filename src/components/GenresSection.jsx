import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const GenresSection = ({ selectedGenres, setSelectedGenres }) => {
    const [allGenres, setAllGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('/data/songs.csv');
                const text = await response.text();
                const lines = text.split('\n');
                const genres = new Set();

                for (let i = 1; i < lines.length; i++) {
                    // Regex to handle CSV parsing with quotes, similar to before
                    const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    // playlist_genre is at index 9 based on the CSV header:
                    // track_id,track_name,track_artist,track_popularity,track_album_id,track_album_name,track_album_release_date,playlist_name,playlist_id,playlist_genre
                    if (currentLine.length > 9) {
                        const genre = currentLine[9]?.trim();
                        if (genre) genres.add(genre);
                    }
                }
                setAllGenres(Array.from(genres).sort());
            } catch (error) {
                console.error("Error fetching genres:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const toggleGenre = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const filteredGenres = allGenres.filter(g =>
        g.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Input for searching/adding */}
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Search genres..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 bg-white border border-slate-300 rounded-lg text-sm focus:border-indigo-500 outline-none"
                />
                <Plus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Filter Chips */}
            {loading ? (
                <div className="text-center py-2 text-slate-400 text-xs">Loading genres...</div>
            ) : (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {filteredGenres.map(genre => {
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
                    {filteredGenres.length === 0 && (
                        <div className="text-slate-400 text-xs w-full text-center py-2">No matching genres found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenresSection;
