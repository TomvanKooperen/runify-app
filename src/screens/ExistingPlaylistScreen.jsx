import React, { useState } from 'react';
import { Trash2, Music, CheckCircle, Play, Eye, X } from 'lucide-react';
import ScreenContainer from '../components/ScreenContainer';

const ExistingPlaylistScreen = ({ setScreen, savedPlaylists = [], deletePlaylist, setCurrentPlaylist }) => {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [playlistsToDelete, setPlaylistsToDelete] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [previewPlaylist, setPreviewPlaylist] = useState(null);

    // Toggle delete mode
    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedPlaylistId(null); // Clear play selection
        setPlaylistsToDelete([]); // Clear delete selection
    };

    // Toggle item for deletion
    const toggleDeleteSelection = (id) => {
        if (playlistsToDelete.includes(id)) {
            setPlaylistsToDelete(playlistsToDelete.filter(item => item !== id));
        } else {
            setPlaylistsToDelete([...playlistsToDelete, id]);
        }
    };

    const handlePlay = () => {
        const playlist = savedPlaylists.find(p => p.id === selectedPlaylistId);
        if (playlist) {
            setCurrentPlaylist(playlist);
            setScreen('spotify');
        }
    };

    const handleDeleteConfirm = () => {
        playlistsToDelete.forEach(id => deletePlaylist(id));
        setShowConfirmModal(false);
        setIsDeleteMode(false);
        setPlaylistsToDelete([]);
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

            {savedPlaylists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Music size={48} className="mb-4 opacity-20" />
                    <p>No saved playlists yet.</p>
                    <button
                        onClick={() => setScreen('questions')}
                        className="mt-4 text-runify-blue font-semibold hover:underline"
                    >
                        Create one now
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {savedPlaylists.map((playlist) => {
                        const isSelected = isDeleteMode ? playlistsToDelete.includes(playlist.id) : selectedPlaylistId === playlist.id;

                        // Dynamic styles based on mode
                        let containerStyle = "bg-white border-blue-100 hover:bg-blue-50";
                        let iconBoxStyle = "bg-blue-100 text-runify-blue";
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
                            containerStyle = "bg-blue-50 border-runify-blue ring-1 ring-runify-blue";
                            iconBoxStyle = "bg-blue-200 text-blue-800";
                            textStyle = "text-blue-900";
                        }

                        return (
                            <div
                                key={playlist.id}
                                onClick={() => isDeleteMode ? toggleDeleteSelection(playlist.id) : setSelectedPlaylistId(playlist.id)}
                                className={`p-4 rounded-lg shadow-sm border flex items-center justify-between cursor-pointer transition-all ${containerStyle}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBoxStyle}`}>
                                        <Music size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${textStyle}`}>{playlist.name}</span>
                                        <span className="text-xs text-slate-400">{new Date(playlist.createdAt).toLocaleDateString()} • {playlist.songs?.length || 0} songs</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isDeleteMode && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewPlaylist(playlist);
                                            }}
                                            className="p-2 text-slate-400 hover:text-runify-blue hover:bg-blue-50 rounded-full transition-colors"
                                            title="Preview Songs"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    )}
                                    {isDeleteMode ? (
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-red-500 border-red-500' : 'border-slate-300 bg-white'}`}>
                                            {isSelected && <CheckCircle size={14} className="text-white" />}
                                        </div>
                                    ) : (
                                        isSelected ? <CheckCircle size={20} className="text-runify-blue" /> : <Play size={16} className="text-slate-400" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
                        onClick={handlePlay}
                        disabled={!selectedPlaylistId}
                        className={`px-8 py-3 rounded-full font-semibold shadow-md transition-all active:scale-95 ${selectedPlaylistId
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        Play playlist on Spotify
                    </button>
                )}
            </div>

            {/* Preview Modal */}
            {previewPlaylist && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-h-[80vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{previewPlaylist.name}</h3>
                                <p className="text-xs text-slate-500">{previewPlaylist.songs?.length || 0} songs</p>
                            </div>
                            <button
                                onClick={() => setPreviewPlaylist(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 space-y-2">
                            {previewPlaylist.songs && previewPlaylist.songs.map((song, i) => (
                                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                    <span className="text-slate-400 font-mono text-xs w-5 text-center">{i + 1}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-700 truncate">{song.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{song.artist}</p>
                                    </div>
                                    {song.tempo && (
                                        <span className="ml-auto text-xs font-mono text-slate-400 whitespace-nowrap">
                                            {Math.round(song.tempo)} BPM
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
                            <button
                                onClick={() => {
                                    setCurrentPlaylist(previewPlaylist);
                                    setScreen('spotify');
                                }}
                                className="px-6 py-2 bg-green-500 text-white text-sm font-bold rounded-full hover:bg-green-600 transition-colors shadow-sm"
                            >
                                Play on Spotify
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                onClick={handleDeleteConfirm}
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

export default ExistingPlaylistScreen;
