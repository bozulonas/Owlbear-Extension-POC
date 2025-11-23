import React, { useState, useEffect, useCallback } from 'react';
import { generateEncounter } from './services/geminiService';
import { EncounterResult, LoadingState } from './types';

// Icons
const DiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('Forest Ambush');
  const [result, setResult] = useState<EncounterResult | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [obrReady, setObrReady] = useState<boolean>(false);

  // Check if OBR SDK is ready
  useEffect(() => {
    // Standard OBR ready check
    if (window.OBR) {
      window.OBR.onReady(() => {
        setObrReady(true);
        console.log("Owlbear Rodeo SDK is ready");
      });
    } else {
      // Fallback for standalone dev
      console.log("OBR SDK not found (running standalone?)");
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!theme.trim()) return;

    setStatus(LoadingState.LOADING);
    try {
      const data = await generateEncounter(theme);
      setResult(data);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(LoadingState.ERROR);
    }
  }, [theme]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-obr-dark p-4 font-sans text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
        <h1 className="text-base font-bold text-white flex items-center gap-2">
          <DiceIcon />
          <span>Encounter Gen</span>
        </h1>
        <div className={`w-2 h-2 rounded-full ${obrReady ? 'bg-green-500' : 'bg-red-500'}`} title={obrReady ? "Connected to OBR" : "Disconnected"} />
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Scenario Theme</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Haunted Crypt"
            className="w-full bg-obr-panel border border-gray-700 text-white rounded p-2 focus:outline-none focus:border-obr-accent focus:ring-1 focus:ring-obr-accent transition-colors"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={status === LoadingState.LOADING}
          className="w-full bg-obr-accent hover:bg-violet-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === LoadingState.LOADING ? (
            <>
              <RefreshIcon />
              <span className="animate-pulse">Thinking...</span>
            </>
          ) : (
            'Generate Encounter'
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="flex-1 overflow-y-auto mt-6 custom-scrollbar">
        {status === LoadingState.ERROR && (
          <div className="p-3 rounded bg-red-900/20 border border-red-800 text-red-200 text-center">
            Failed to generate. Check your API Key.
          </div>
        )}

        {result && status !== LoadingState.LOADING && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-obr-panel p-3 rounded border-l-4 border-obr-accent shadow-lg">
              <h2 className="text-lg font-bold text-white mb-1">{result.title}</h2>
              <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {result.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Creatures</h3>
              <div className="flex flex-wrap gap-2">
                {result.suggestedCreatures.map((creature, idx) => (
                  <span key={idx} className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs border border-gray-600">
                    {creature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {!result && status !== LoadingState.LOADING && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
            <DiceIcon />
            <p className="mt-2 text-xs">Enter a theme to begin</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4 text-center">
        <p className="text-[10px] text-gray-600">Powered by Google Gemini</p>
      </div>
    </div>
  );
};

export default App;