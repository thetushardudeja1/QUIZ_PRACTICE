export interface Question {
  question: string;
  options: string[];
  correct: number; // Index of the correct option (0-3)
}

export interface QuizData {
  [key: string]: Question[];
}

export type AppState = 'HOME' | 'QUIZ' | 'RESULT';
export type QuizMode = 'PRACTICE' | 'PYQ';
