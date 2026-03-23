import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Home, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  BookOpen,
  LayoutGrid
} from 'lucide-react';
import { quizData } from './data/quizData';
import { pyqData } from './data/pyqData';
import { Question, AppState, QuizMode } from './types';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [quizMode, setQuizMode] = useState<QuizMode>('PRACTICE');
  const [homeView, setHomeView] = useState<'SELECTION' | 'WEEKS'>('SELECTION');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  const startQuiz = (weekKey: string | 'all') => {
    let questions: Question[] = [];
    const activeData = quizMode === 'PRACTICE' ? quizData : pyqData;
    
    if (weekKey === 'all') {
      // Combine all weeks
      Object.values(activeData).forEach(weekQs => {
        questions = [...questions, ...weekQs];
      });
      setSelectedWeek(`All ${quizMode === 'PRACTICE' ? 'Practice' : 'PYQ'} Weeks`);
    } else {
      questions = [...(activeData[weekKey] || [])];
      setSelectedWeek(`${quizMode === 'PRACTICE' ? 'Practice' : 'PYQ'} - Week ${weekKey.replace('week', '')}`);
    }

    if (questions.length === 0) {
      alert("No questions available for this selection yet.");
      return;
    }

    // Shuffle questions
    const shuffledQuestions = shuffleArray(questions).map(q => {
      // Shuffle options and track the correct index
      const originalOptions = [...q.options];
      const correctOptionText = originalOptions[q.correct];
      const shuffledOptions = shuffleArray(originalOptions);
      const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
      
      return {
        ...q,
        options: shuffledOptions,
        correct: newCorrectIndex
      };
    });

    setCurrentQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setUserAnswers(new Array(shuffledQuestions.length).fill(null));
    setScore(0);
    setAppState('QUIZ');
  };

  const handleAnswer = (optionIndex: number) => {
    if (userAnswers[currentIndex] !== null) return; // Already answered

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentIndex] = optionIndex;
    setUserAnswers(newUserAnswers);

    if (optionIndex === currentQuestions[currentIndex].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAppState('RESULT');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const resetToHome = () => {
    setAppState('HOME');
    setHomeView('SELECTION');
    setSelectedWeek(null);
  };

  const retryQuiz = () => {
    if (selectedWeek?.includes('All')) {
      startQuiz('all');
    } else if (selectedWeek) {
      const match = selectedWeek.match(/Week (\d+)/);
      if (match) {
        startQuiz(`week${match[1]}`);
      }
    }
  };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-6 md:mb-24">
        <h1 className="text-2xl sm:text-6xl md:text-8xl lg:text-[100px] font-bold text-white mb-3 md:mb-10 tracking-tight leading-[1.1] md:leading-[0.95]">
          Modern Indian <br className="hidden md:block" /> Political Thought
        </h1>
        <div className="inline-flex items-center gap-2 px-4 md:px-8 py-1.5 md:py-3 rounded-full bg-[#1d1d1f] border border-white/10 backdrop-blur-3xl mb-3 md:mb-8">
          <p className="text-[10px] md:text-xl text-[#86868b] font-medium tracking-tight">
            Introduction To Modern Indian Political Thought
          </p>
        </div>
        <p className="text-[8px] md:text-[11px] font-bold text-[#424245] uppercase tracking-[0.2em] md:tracking-[0.5em] block">
          By Prof. Mithilesh Kumar Jha | IIT Guwahati
        </p>
      </div>

      <AnimatePresence mode="wait">
        {homeView === 'SELECTION' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-20"
          >
            <button
              onClick={() => {
                setQuizMode('PRACTICE');
                setHomeView('WEEKS');
              }}
              className="group relative bg-[#1d1d1f]/50 border border-white/[0.03] p-6 md:p-20 rounded-[1.5rem] md:rounded-[3rem] transition-all hover:bg-[#1d1d1f] hover:border-white/[0.08] text-left backdrop-blur-3xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-12 h-12 md:w-32 md:h-32 text-white" />
              </div>
              <span className="block text-[8px] md:text-[11px] font-bold text-[#424245] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-2 md:mb-6">Mode 01</span>
              <h3 className="text-xl md:text-6xl font-bold text-white mb-1 md:mb-6 tracking-tight">Practice Questions</h3>
              <p className="text-xs md:text-xl text-[#86868b] leading-relaxed max-w-md">
                Master the course content with weekly practice assignments.
              </p>
            </button>

            <button
              onClick={() => {
                setQuizMode('PYQ');
                setHomeView('WEEKS');
              }}
              className="group relative bg-[#1d1d1f]/50 border border-white/[0.03] p-6 md:p-20 rounded-[1.5rem] md:rounded-[3rem] transition-all hover:bg-[#1d1d1f] hover:border-white/[0.08] text-left backdrop-blur-3xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="w-12 h-12 md:w-32 md:h-32 text-white" />
              </div>
              <span className="block text-[8px] md:text-[11px] font-bold text-[#424245] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-2 md:mb-6">Mode 02</span>
              <h3 className="text-xl md:text-6xl font-bold text-white mb-1 md:mb-6 tracking-tight">PYQ Section</h3>
              <p className="text-xs md:text-xl text-[#86868b] leading-relaxed max-w-md">
                Test your knowledge with Previous Year Questions.
              </p>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="weeks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-6 md:mb-12">
              <button 
                onClick={() => setHomeView('SELECTION')}
                className="flex items-center gap-2 text-[#86868b] hover:text-white transition-colors font-bold uppercase tracking-[0.2em] text-[9px] md:text-[11px]"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                Back
              </button>
              <div className="bg-white/5 border border-white/10 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-white font-bold text-[9px] md:text-xs uppercase tracking-widest">
                {quizMode === 'PRACTICE' ? 'Practice' : 'PYQ'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-20">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => startQuiz(`week${i + 1}`)}
                  className="group relative bg-[#1d1d1f]/50 border border-white/[0.03] p-4 md:p-12 rounded-[1rem] md:rounded-[2.5rem] transition-all hover:bg-[#1d1d1f] hover:border-white/[0.08] text-center backdrop-blur-3xl"
                >
                  <span className="block text-[8px] md:text-[11px] font-bold text-[#424245] uppercase tracking-[0.1em] md:tracking-[0.3em] mb-1 md:mb-4 group-hover:text-[#86868b] transition-colors">
                    Week
                  </span>
                  <span className="block text-lg md:text-4xl font-bold text-white tracking-tight">{i + 1}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => startQuiz('all')}
              className="w-full group relative overflow-hidden bg-white text-black py-4 md:py-8 rounded-[1rem] md:rounded-[2.5rem] text-lg md:text-3xl font-bold shadow-2xl hover:bg-[#f5f5f7] active:scale-[0.995] transition-all flex items-center justify-center gap-2 md:gap-5 mb-12 md:mb-32"
            >
              <LayoutGrid className="w-5 h-5 md:w-10 md:h-10" />
              Attempt All Weeks
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center pt-4 md:pt-20 border-t border-white/[0.05]">
        <p className="text-[#424245] text-[7px] md:text-[11px] font-bold tracking-[0.3em] md:tracking-[0.6em] uppercase mb-0.5 md:mb-4">
          Maintained by
        </p>
        <p className="text-white text-lg md:text-4xl font-bold tracking-tight">
          MR. TUSHAR DUDEJA
        </p>
      </footer>
    </motion.div>
  );

  const renderQuiz = () => {
    const currentQ = currentQuestions[currentIndex];
    const userAnswer = userAnswers[currentIndex];
    const isAnswered = userAnswer !== null;

    return (
      <div className="h-full flex flex-col max-w-6xl mx-auto">
        {/* Header - Compact */}
        <div className="flex items-center justify-between py-3 md:py-6">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="bg-white/5 text-[#86868b] border border-white/10 px-3 md:px-6 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase">
              {selectedWeek}
            </div>
            <div className="text-[#424245] text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase">
              Q {currentIndex + 1} / {currentQuestions.length}
            </div>
          </div>
          <button 
            onClick={resetToHome}
            className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#86868b] hover:text-white hover:bg-white/10 transition-all"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Question & Options Area - Flexible */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#1d1d1f]/50 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[3rem] border border-white/[0.03] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col">
            <h2 className="text-base md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-10 leading-tight tracking-tight">
              {currentQ.question}
            </h2>

            <div className="grid gap-2 md:gap-4">
              {currentQ.options.map((option, idx) => {
                let buttonClass = "w-full text-left p-3 md:p-6 rounded-[0.75rem] md:rounded-[1.5rem] border transition-all flex items-center justify-between group relative overflow-hidden ";
                let icon = null;

                if (!isAnswered) {
                  buttonClass += "border-white/[0.03] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.03] text-[#d2d2d7] hover:text-white";
                } else {
                  if (idx === currentQ.correct) {
                    buttonClass += "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
                    icon = <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6 text-emerald-400" />;
                  } else if (idx === userAnswer) {
                    buttonClass += "border-rose-500/40 bg-rose-500/10 text-rose-400";
                    icon = <XCircle className="w-4 h-4 md:w-6 md:h-6 text-rose-400" />;
                  } else {
                    buttonClass += "border-white/[0.03] opacity-20 text-[#424245]";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <span className="text-xs md:text-xl font-medium tracking-tight relative z-10">{option}</span>
                    <div className="relative z-10">{icon}</div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 md:mt-8 p-3 md:p-6 rounded-[0.75rem] md:rounded-[1.5rem] text-center font-bold text-xs md:text-lg tracking-tight ${
                    userAnswer === currentQ.correct 
                      ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10' 
                      : 'bg-rose-500/5 text-rose-400 border border-rose-500/10'
                  }`}
                >
                  {userAnswer === currentQ.correct 
                    ? 'Correct' 
                    : 'Incorrect'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Controls - Compact */}
        <div className="flex items-center justify-between gap-3 md:gap-6 py-4 md:py-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 md:py-5 px-4 md:px-8 rounded-[1rem] md:rounded-[1.5rem] bg-white/5 text-[#86868b] font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] hover:bg-white/10 hover:text-white disabled:opacity-10 transition-all"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back
          </button>
          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="flex-1 flex items-center justify-center gap-2 py-3 md:py-5 px-4 md:px-8 rounded-[1rem] md:rounded-[1.5rem] bg-white text-black font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] hover:bg-[#f5f5f7] disabled:opacity-20 transition-all shadow-2xl"
          >
            {currentIndex === currentQuestions.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto text-center h-full flex flex-col justify-center"
      >
        <div className="bg-[#1d1d1f]/50 backdrop-blur-3xl rounded-[2rem] md:rounded-[5rem] p-6 md:p-20 border border-white/[0.03] shadow-2xl overflow-y-auto max-h-full">
          <div className="w-16 h-16 md:w-32 md:h-32 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-12">
            <Trophy className="w-8 h-8 md:w-16 md:h-16 text-white" />
          </div>
          
          <h2 className="text-2xl md:text-6xl font-bold text-white mb-2 tracking-tight">Quiz Complete</h2>
          <p className="text-[#86868b] text-[10px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mb-8 md:mb-16">Performance Report: {selectedWeek}</p>
 
          <div className="grid grid-cols-2 gap-4 md:gap-10 mb-8 md:mb-16">
            <div className="bg-white/[0.01] p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] border border-white/[0.03]">
              <div className="text-3xl md:text-7xl font-bold text-white mb-1 md:mb-2 tracking-tight">{score} <span className="text-sm md:text-2xl text-[#424245]">/ {currentQuestions.length}</span></div>
              <div className="text-[8px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] md:tracking-[0.3em]">Score</div>
            </div>
            <div className="bg-white/[0.01] p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] border border-white/[0.03]">
              <div className="text-3xl md:text-7xl font-bold text-white mb-1 md:mb-2 tracking-tight">{percentage}%</div>
              <div className="text-[8px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] md:tracking-[0.3em]">Accuracy</div>
            </div>
          </div>
 
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 mb-8 md:mb-16">
            <button
              onClick={retryQuiz}
              className="flex-1 bg-white text-black py-4 md:py-6 rounded-[1rem] md:rounded-[2rem] text-lg md:text-2xl font-bold shadow-2xl hover:bg-[#f5f5f7] active:scale-[0.995] transition-all flex items-center justify-center gap-2 md:gap-3"
            >
              <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
              Try Again
            </button>
            <button
              onClick={resetToHome}
              className="flex-1 bg-white/5 text-[#86868b] py-4 md:py-6 rounded-[1rem] md:rounded-[2rem] text-lg md:text-2xl font-bold border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 md:gap-3"
            >
              <Home className="w-5 h-5 md:w-6 md:h-6" />
              Home
            </button>
          </div>
 
          <div className="pt-8 md:pt-16 border-t border-white/[0.05]">
            <p className="text-[#424245] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase mb-1 md:mb-2">
              Maintained by
            </p>
            <p className="text-white text-xl md:text-3xl font-bold tracking-tight">
              MR. TUSHAR DUDEJA
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-[#f5f5f7] selection:bg-white/10 selection:text-white antialiased">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#1d1d1f] to-transparent opacity-30" />
      </div>

      <main className={`relative z-10 px-6 ${appState === 'QUIZ' ? 'h-screen h-[100svh] overflow-hidden' : 'py-8 md:py-20'}`}>
        {appState === 'HOME' && renderHome()}
        {appState === 'QUIZ' && renderQuiz()}
        {appState === 'RESULT' && renderResult()}
      </main>
    </div>
  );
}
