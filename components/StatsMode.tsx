import React from 'react';
import { GameState } from '../types';

interface StatsModeProps {
  gameState: GameState;
}

export const StatsMode: React.FC<StatsModeProps> = ({ gameState }) => {
  const accuracy = gameState.totalAnswered > 0 
    ? Math.round((gameState.history.filter(h => h.isCorrect).length / gameState.totalAnswered) * 100) 
    : 0;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-black text-slate-800 mb-6 mt-4">Statistics</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
          <p className="text-2xl font-black text-indigo-600">{gameState.score}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Best Streak</p>
          <p className="text-2xl font-black text-orange-500">{gameState.maxStreak} 🔥</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
          <p className="text-2xl font-black text-emerald-500">{accuracy}%</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Answered</p>
          <p className="text-2xl font-black text-blue-500">{gameState.totalAnswered}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
      <div className="space-y-3 pb-12">
        {gameState.history.slice().reverse().slice(0, 15).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="font-semibold text-slate-700">{item.country}</span>
            </div>
            <span className={`text-sm font-bold ${item.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
              {item.isCorrect ? '+10' : '+0'}
            </span>
          </div>
        ))}
        {gameState.history.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No quiz history yet. Start playing!</p>
          </div>
        )}
      </div>
    </div>
  );
};