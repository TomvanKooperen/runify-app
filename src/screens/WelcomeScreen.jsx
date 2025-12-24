import React from 'react';
import Button from '../components/Button';

const WelcomeScreen = ({ setScreen }) => (
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

export default WelcomeScreen;
