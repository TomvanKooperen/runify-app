import React from 'react';
import Button from '../components/Button';

const WelcomeScreen = ({ setScreen }) => (
    <div className="flex flex-col h-full text-center">

        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-slate-100 rounded-3xl mb-8 flex items-center justify-center shadow-inner overflow-hidden relative">
                <img
                    src="/runify-logo-placeholder.jpg"
                    alt="Runify Logo"
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentNode.classList.add('animate-pulse');
                    }}
                />
                <span className="text-slate-300 text-sm font-mono absolute z-0">Logo Placeholder</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Runify</h1>
            <p className="text-slate-500">Let's create your perfect running playlist!</p>
        </div>

        <div className="w-full space-y-4 mb-8">
            <Button onClick={() => setScreen('questions')}>Create a playlist</Button>
            <Button variant="outline" onClick={() => setScreen('existing')}>Existing playlist</Button>
        </div>
    </div>
);

export default WelcomeScreen;
