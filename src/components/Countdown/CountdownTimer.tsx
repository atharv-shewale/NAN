import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Gift } from 'lucide-react';
import { useConfetti } from '../../hooks/useConfetti';

export const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState(10); // 10 seconds countdown
    const [isComplete, setIsComplete] = useState(false);
    const { setScene } = useAppStore();
    const { fireworks } = useConfetti();

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (!isComplete) {
            setIsComplete(true);
            fireworks();
        }
    }, [timeLeft, isComplete, fireworks]);

    const handleNext = () => {
        setScene('vault');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 floral-bg">
            <div className="text-center mb-12 z-10">
                <Gift className="w-16 h-16 text-rose-400 mx-auto mb-4 animate-bounce" />
                <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4 font-display text-shadow-soft">
                    {isComplete ? 'Surprise Time! 🎁' : 'Countdown to Surprise!'}
                </h2>
                <p className="text-xl text-rose-900">
                    {isComplete ? 'Your special surprise is ready!' : 'Something magical is coming...'}
                </p>
            </div>

            <div className="glass-effect p-8 md:p-12 rounded-3xl text-center max-w-2xl w-full mx-4 relative z-20 shadow-2xl border-4 border-white/50">
                {!isComplete ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-8xl md:text-9xl font-bold text-gradient mb-4 animate-pulse drop-shadow-lg font-display">
                            {timeLeft}
                        </div>
                        <div className="text-xl md:text-3xl text-rose-900 font-semibold tracking-wide">
                            seconds until your surprise... ✨
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 animate-fade-in">
                        <div className="text-8xl mb-2 animate-bounce">🎉</div>
                        <h3 className="text-4xl md:text-5xl font-bold text-rose-900 drop-shadow-sm font-display">
                            The wait is over!
                        </h3>
                        <p className="text-xl md:text-2xl text-rose-800 font-medium max-w-md mx-auto">
                            Let's unlock your memory vault... 🗝️
                        </p>

                        <button
                            onClick={handleNext}
                            className="glass-effect px-10 py-5 rounded-full text-xl md:text-2xl font-bold text-rose-900 hover:scale-110 transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:shadow-rose-300/50 mt-4 border-2 border-white/60"
                        >
                            Unlock Vault <Gift className="w-8 h-8" />
                        </button>
                    </div>
                )}
            </div>

            {/* Animated rings */}
            {!isComplete && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-64 h-64 border-4 border-rose-300 rounded-full opacity-20"
                            style={{
                                animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
