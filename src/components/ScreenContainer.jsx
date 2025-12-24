import React from 'react';
import { ArrowLeft, Music } from 'lucide-react';

const ScreenContainer = ({ children, title, onBack, rightAction }) => (
    <div className="w-full h-full bg-indigo-50 flex flex-col relative overflow-hidden font-sans">
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

export default ScreenContainer;
