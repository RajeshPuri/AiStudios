import React, { useState, useEffect, useCallback } from 'react';
import { Country, GameState, QuestionType, QuizQuestion } from '../types';
import { COUNTRIES } from '../constants';
import { fetchFunFact } from '../services/geminiService';

interface QuizGameProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onShowFlag: (country: Country) => void;
}

const QUESTIONS_PER_ROUND = 5;
const PASSING_SCORE = 4; // Need 4/5 to advance

export const QuizGame: React.FC<QuizGameProps> = ({ gameState, setGameState, onShowFlag }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [roundCount, setRoundCount] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [showRoundResults, setShowRoundResults] = useState(false);

  const generateQuestion = useCallback(() => {
    // Level 1: Mostly Name/Capital. Level 2: Adds Currency more frequently
    const pool = gameState.currentLevel === 1 
      ? COUNTRIES.slice(0, 30) // Use a smaller set for level 1
      : COUNTRIES; // Use full set for level 2

    const randomIndex = Math.floor(Math.random() * pool.length);
    const targetCountry = pool[randomIndex];
    
    let types = [QuestionType.NAME, QuestionType.CAPITAL];
    if (gameState.currentLevel >= 2) {
      types.push(QuestionType.CURRENCY);
    }
    
    const type = types[Math.floor(Math.random() * types.length)];

    let correctAnswer = '';
    let optionsPool: string[] = [];

    switch (type) {
      case QuestionType.NAME:
        correctAnswer = targetCountry.name;
        optionsPool = COUNTRIES.map(c => c.name);
        break;
      case QuestionType.CAPITAL:
        correctAnswer = targetCountry.capital;
        optionsPool = COUNTRIES.map(c => c.capital);
        break;
      case QuestionType.CURRENCY:
        correctAnswer = targetCountry.currency;
        optionsPool = COUNTRIES.map(c => c.currency);
        break;
    }

    const otherOptions = optionsPool
      .filter(opt => opt !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctAnswer, ...otherOptions].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      country: targetCountry,
      type,
      options,
      correctAnswer
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFunFact(null);
  }, [gameState.currentLevel]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) setRoundCorrect(prev => prev + 1);

    setGameState(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        ...prev,
        score: correct ? prev.score + 10 : prev.score,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        totalAnswered: prev.totalAnswered + 1,
        history: [...prev.history, { country: currentQuestion!.country.name, isCorrect: correct, timestamp: Date.now() }]
      };
    });

    const fact = await fetchFunFact(currentQuestion!.country.name);
    setFunFact(fact);
  };

  const nextQuestion = () => {
    if (roundCount + 1 >= QUESTIONS_PER_ROUND) {
      setShowRoundResults(true);
    } else {
      setRoundCount(prev => prev + 1);
      generateQuestion();
    }
  };

  const restartRound = (shouldAdvance: boolean) => {
    if (shouldAdvance) {
      setGameState(prev => ({ ...prev, currentLevel: prev.currentLevel + 1 }));
    }
    setRoundCount(0);
    setRoundCorrect(0);
    setShowRoundResults(false);
    generateQuestion();
  };

  if (showRoundResults) {
    const passed = roundCorrect >= PASSING_SCORE;
    return (
      <div className="flex flex-col min-h-full bg-white p-6 justify-center items-center max-w-md mx-auto text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {passed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">
          {passed ? "Level Complete!" : "Round Finished"}
        </h2>
        <p className="text-slate-500 mb-8">
          You got <span className="font-bold text-indigo-600">{roundCorrect}</span> out of {QUESTIONS_PER_ROUND} correct.
        </p>

        <div className="w-full space-y-3">
          {passed ? (
            <button
              onClick={() => restartRound(true)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100"
            >
              Move to Level {gameState.currentLevel + 1}
            </button>
          ) : (
            <>
              <p className="text-rose-500 text-sm font-bold mb-2">Need {PASSING_SCORE}/{QUESTIONS_PER_ROUND} to reach Level 2</p>
              <button
                onClick={() => restartRound(false)}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-lg"
              >
                Retry Level {gameState.currentLevel}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 p-4 max-w-md mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 pt-4">
        <div>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg">Level {gameState.currentLevel}</span>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question</p>
          <p className="text-lg font-black text-slate-700">{roundCount + 1} <span className="text-slate-300">/ {QUESTIONS_PER_ROUND}</span></p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak</p>
          <p className="text-lg font-black text-orange-500">{gameState.streak} 🔥</p>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-1.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-indigo-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${((roundCount + (selectedAnswer ? 1 : 0)) / QUESTIONS_PER_ROUND) * 100}%` }}
        />
      </div>

      <div className="flex flex-col flex-1">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 mb-6 flex flex-col items-center">
          <div 
            className="cursor-pointer group relative mb-6"
            onClick={() => onShowFlag(currentQuestion.country)}
          >
            <img 
              src={`https://flagcdn.com/w320/${currentQuestion.country.code}.png`} 
              alt="Quiz Flag"
              className="w-48 h-auto rounded-xl shadow-md group-hover:scale-105 transition-transform"
            />
          </div>

          <h3 className="text-lg font-semibold text-slate-700 text-center mb-2">
            {currentQuestion.type === QuestionType.NAME && "Which country is this?"}
            {currentQuestion.type === QuestionType.CAPITAL && `Capital of ${currentQuestion.country.name}?`}
            {currentQuestion.type === QuestionType.CURRENCY && `Currency of ${currentQuestion.country.name}?`}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const isTarget = option === currentQuestion.correctAnswer;
            const isPicked = selectedAnswer === option;
            
            let btnClass = "bg-white text-slate-700 border-2 border-slate-100";
            if (selectedAnswer) {
              if (isTarget) btnClass = "bg-emerald-500 text-white border-emerald-500";
              else if (isPicked) btnClass = "bg-rose-500 text-white border-rose-500";
              else btnClass = "bg-white text-slate-300 border-slate-50 opacity-50";
            } else {
              btnClass += " hover:border-indigo-200 active:scale-95";
            }

            return (
              <button
                key={idx}
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer(option)}
                className={`w-full py-4 px-6 rounded-2xl text-left font-bold transition-all duration-200 ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 bg-white border border-slate-100 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM6.464 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">World Insight</p>
                <p className="text-slate-600 italic text-sm leading-tight">
                  {funFact || "Asking the local experts..."}
                </p>
              </div>
            </div>
            <button
              onClick={nextQuestion}
              className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              {roundCount + 1 >= QUESTIONS_PER_ROUND ? "Finish Round" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};