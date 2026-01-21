import React, { useState } from 'react';
import { GameMode, Country, GameState } from './types';
import { QuizGame } from './components/QuizGame';
import { LearnMode } from './components/LearnMode';
import { FlagModal } from './components/FlagModal';
import { StatsMode } from './components/StatsMode';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.HOME);
  const [fullscreenFlagCountry, setFullscreenFlagCountry] = useState<Country | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    totalAnswered: 0,
    history: [],
    currentLevel: 1
  });

  const NavItem = ({ targetMode, label, icon }: { targetMode: GameMode, label: string, icon: React.ReactNode }) => {
    const isActive = mode === targetMode;
    return (
      <button 
        onClick={() => setMode(targetMode)}
        className={`flex flex-col items-center justify-center flex-1 py-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
      >
        {icon}
        <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{label}</span>
      </button>
    );
  };

  const renderContent = () => {
    switch (mode) {
      case GameMode.QUIZ:
        return (
          <QuizGame 
            gameState={gameState}
            setGameState={setGameState}
            onShowFlag={setFullscreenFlagCountry} 
          />
        );
      case GameMode.LEARN:
        return (
          <LearnMode 
            onShowFlag={setFullscreenFlagCountry} 
          />
        );
      case GameMode.STATS:
        return (
          <StatsMode 
            gameState={gameState}
          />
        );
      case GameMode.HOME:
      default:
        return (
          <div className="h-[100dvh] flex flex-col bg-slate-50 p-6 overflow-hidden max-w-md mx-auto relative">
            {/* Header Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-indigo-200 rounded-3xl rotate-6 blur-lg opacity-50"></div>
                <img 
                  src="https://flagcdn.com/w320/un.png" 
                  alt="FlagQuest" 
                  className="w-24 h-auto rounded-2xl shadow-xl relative"
                />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">FlagQuest</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Level Up Your Knowledge</p>
            </div>

            {/* Progress Banner */}
            <div className="bg-indigo-600 rounded-3xl p-5 text-white mb-6 shadow-xl shadow-indigo-100 flex justify-between items-center shrink-0">
              <div>
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Mastery Level</p>
                <p className="text-2xl font-black">{gameState.currentLevel}</p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-2xl">
                <span className="text-lg font-bold">{gameState.score} pts</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 gap-3 mb-24 shrink-0">
              <button 
                onClick={() => setMode(GameMode.QUIZ)}
                className="group relative bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500 transition-all shadow-sm active:scale-95"
              >
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 text-sm">Start Level {gameState.currentLevel}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">5 challenges per round</p>
                </div>
              </button>

              <button 
                onClick={() => setMode(GameMode.LEARN)}
                className="group relative bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-500 transition-all shadow-sm active:scale-95"
              >
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 text-sm">Learning Library</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Review world flags</p>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-slate-50 flex flex-col">
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
      
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 flex justify-around items-center z-40 pb-safe shadow-2xl shadow-slate-900/10">
        <NavItem 
          targetMode={GameMode.HOME} 
          label="Home" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        />
        <NavItem 
          targetMode={GameMode.QUIZ} 
          label="Quiz" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
        />
        <NavItem 
          targetMode={GameMode.LEARN} 
          label="Learn" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <NavItem 
          targetMode={GameMode.STATS} 
          label="Stats" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m2 0h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>}
        />
      </nav>

      <FlagModal 
        country={fullscreenFlagCountry} 
        onClose={() => setFullscreenFlagCountry(null)} 
      />

      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;