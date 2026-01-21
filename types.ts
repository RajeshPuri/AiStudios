
export interface Country {
  name: string;
  code: string;
  capital: string;
  currency: string;
  region: string;
  population: string;
}

export enum GameMode {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  LEARN = 'LEARN',
  STATS = 'STATS'
}

export enum QuestionType {
  NAME = 'NAME',
  CAPITAL = 'CAPITAL',
  CURRENCY = 'CURRENCY'
}

export interface QuizQuestion {
  country: Country;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
}

export interface GameHistoryItem {
  country: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface GameState {
  score: number;
  streak: number;
  maxStreak: number;
  totalAnswered: number;
  history: GameHistoryItem[];
  currentLevel: number;
}
