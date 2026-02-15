import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Lock, Unlock, ArrowRight, Lightbulb } from 'lucide-react';
import { useConfetti } from '../../hooks/useConfetti';

interface Puzzle {
    question: string;
    answer: string;
    hint: string;
    reward: string;
}

const puzzles: Puzzle[] = [
    {
        question: "What is the most beautiful curve on your face?",
        answer: "smile",
        hint: "It brightens up the whole room! :)",
        reward: "😊 Keep smiling, it suits you perfectly!",
    },
    {
        question: "What is the one thing you shouldn't forget to make today?",
        answer: "wish",
        hint: "You do it before blowing out the candles 🕯️",
        reward: "✨ May all your wishes come true!",
    },
    {
        question: "What do you deserve to have tons of today?",
        answer: "fun",
        hint: "It rhymes with 'Sun' ☀️",
        reward: "🎉 Let's celebrate and have a blast!",
    },
];

export const PuzzleVault = () => {
    const [currentPuzzle, setCurrentPuzzle] = useState(0);
    const [answer, setAnswer] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockedPuzzles, setUnlockedPuzzles] = useState<number[]>([]);
    const [error, setError] = useState(false);
    const { setScene } = useAppStore();
    const { burst } = useConfetti();

    const puzzle = puzzles[currentPuzzle];
    const allUnlocked = unlockedPuzzles.length === puzzles.length;

    const checkAnswer = (input: string, correct: string) => {
        const normalizedInput = input.toLowerCase().trim();
        const normalizedCorrect = correct.toLowerCase();
        if (normalizedInput === normalizedCorrect) return true;
        // Flexible answers
        if (normalizedCorrect === 'smile' && (normalizedInput === 'laughter' || normalizedInput === 'happiness')) return true;
        if (normalizedCorrect === 'wish' && (normalizedInput === 'hope' || normalizedInput === 'dream')) return true;
        if (normalizedCorrect === 'fun' && (normalizedInput === 'joy' || normalizedInput === 'party')) return true;
        return false;
    };

    const handleSubmit = () => {
        if (checkAnswer(answer, puzzle.answer)) {
            setIsUnlocked(true);
            setUnlockedPuzzles([...unlockedPuzzles, currentPuzzle]);
            burst();
            setAnswer('');
            setShowHint(false);
            setError(false);
        } else {
            setError(true);
            // Shake effect
            const form = document.getElementById('puzzle-form');
            if (form) {
                form.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 400 });
            }
        }
    };

    const handleNext = () => {
        if (currentPuzzle < puzzles.length - 1) {
            setCurrentPuzzle(currentPuzzle + 1);
            setIsUnlocked(false);
        } else {
            setScene('balloons');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 floral-bg">
            <div className="text-center mb-12 z-10">
                <Lock className="w-16 h-16 text-birthday-gold mx-auto mb-4 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
                    Memory Vault 🔐
                </h2>
                <p className="text-xl text-rose-900">
                    Unlock special surprises by solving puzzles!
                </p>
            </div>

            <div className="w-full max-w-2xl bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-white/70 relative z-20">
                {/* Progress */}
                <div className="flex gap-2 mb-8 justify-center">
                    {puzzles.map((_, i) => (
                        <div
                            key={i}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${unlockedPuzzles.includes(i)
                                ? 'bg-birthday-gold border-birthday-gold'
                                : i === currentPuzzle
                                    ? 'border-white'
                                    : 'border-white/30'
                                }`}
                        >
                            {unlockedPuzzles.includes(i) ? (
                                <Unlock className="w-6 h-6 text-rose-900" />
                            ) : (
                                <Lock className="w-6 h-6 text-rose-400" />
                            )}
                        </div>
                    ))}
                </div>

                {!isUnlocked ? (
                    <>
                        <h3 className="text-2xl font-bold text-rose-900 mb-6 text-center">
                            {puzzle.question}
                        </h3>

                        <div id="puzzle-form" className="w-full">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => {
                                    setAnswer(e.target.value);
                                    setError(false);
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="Type your answer..."
                                className={`w-full bg-white/40 border-2 rounded-2xl p-4 text-rose-900 text-lg placeholder-rose-400 focus:outline-none transition-all mb-2 ${error ? 'border-red-400 bg-red-50' : 'border-rose-200 focus:border-birthday-gold'}`}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
                                    Oops! That's not quite right. Try a hint? 🤔
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="glass-effect px-6 py-3 rounded-full text-rose-800 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Lightbulb className="w-5 h-5" />
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={!answer.trim()}
                                className="flex-1 glass-effect px-6 py-3 rounded-full font-bold text-rose-900 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Unlock 🔓
                            </button>
                        </div>

                        {showHint && (
                            <div className="mt-4 p-4 bg-yellow-100 border-2 border-birthday-gold rounded-2xl">
                                <p className="text-rose-900 text-center">💡 {puzzle.hint}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-3xl font-bold text-rose-900 mb-4">
                            Unlocked!
                        </h3>
                        <p className="text-2xl text-birthday-gold mb-8">
                            {puzzle.reward}
                        </p>

                        <button
                            onClick={handleNext}
                            className="glass-effect px-8 py-4 rounded-full text-xl font-bold text-rose-900 hover:scale-110 transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                            {allUnlocked ? 'Continue Journey' : 'Next Puzzle'} <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>

            {/* Decorative locks */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                {[...Array(8)].map((_, i) => (
                    <Lock
                        key={i}
                        className="absolute text-rose-900"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${40 + Math.random() * 60}px`,
                            height: `${40 + Math.random() * 60}px`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
