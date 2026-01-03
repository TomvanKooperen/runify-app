import React from 'react';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';

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
                        <div className="w-1 h-4 bg-[#1e293b] rounded-full"></div>
                        <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Interval Cycle</h3>
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
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">min/km</span>
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
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">min/km</span>
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

export default IntervalConfigScreen;
