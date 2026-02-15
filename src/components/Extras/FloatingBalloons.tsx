import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PartyPopper, ArrowRight } from 'lucide-react';
import { useConfetti } from '../../hooks/useConfetti';

interface Balloon {
    id: number;
    x: number;
    y: number;
    color: string;
    message: string;
}

const messages = [
    "You're amazing! 🌟",
    "Keep shining! ✨",
    "You're loved! 💖",
    "Dream big! 🌈",
    "Be happy! 😊",
    "Stay blessed! 🙏",
    "You rock! 🎸",
    "Smile more! 😄",
];

const colors = ['#FF6B9D', '#C44569', '#4E54C8', '#FFD700', '#FF69B4', '#9B59B6'];

export const FloatingBalloons = () => {
    const [balloons, setBalloons] = useState<Balloon[]>([]);
    const [poppedCount, setPoppedCount] = useState(0);
    const { setScene } = useAppStore();
    const { fire } = useConfetti();

    useEffect(() => {
        // Generate balloons
        const newBalloons: Balloon[] = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
        }));
        setBalloons(newBalloons);
    }, []);

    const popBalloon = (id: number) => {
        setBalloons(balloons.filter((b) => b.id !== id));
        setPoppedCount(poppedCount + 1);
        fire({ particleCount: 30, spread: 60 });
    };

    const handleFinish = () => {
        setScene('card'); // Final scene
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 floral-bg">
            <div className="text-center mb-12 z-10">
                <PartyPopper className="w-16 h-16 text-birthday-gold mx-auto mb-4 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
                    Pop the Balloons! 🎈
                </h2>
                <p className="text-xl text-rose-900 mb-2">
                    Click on balloons to reveal hidden messages!
                </p>
                <p className="text-lg text-rose-700">
                    Popped: {poppedCount} / 12
                </p>
            </div>

            {/* Balloons */}
            <div className="absolute inset-0">
                {balloons.map((balloon) => (
                    <div
                        key={balloon.id}
                        onClick={() => popBalloon(balloon.id)}
                        className="absolute cursor-pointer hover:scale-110 transition-transform group"
                        style={{
                            left: `${balloon.x}%`,
                            top: `${balloon.y}%`,
                            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        {/* Balloon */}
                        <div
                            className="w-20 h-24 rounded-full relative"
                            style={{ backgroundColor: balloon.color }}
                        >
                            {/* Shine effect */}
                            <div className="absolute top-4 left-4 w-6 h-6 bg-white/40 rounded-full" />

                            {/* String */}
                            <div className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-white/50" />
                        </div>

                        {/* Message tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <div className="glass-effect px-4 py-2 rounded-full text-rose-900 text-sm font-bold">
                                {balloon.message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Finish button */}
            {poppedCount >= 8 && (
                <button
                    onClick={handleFinish}
                    className="mt-auto mb-12 glass-effect px-8 py-4 rounded-full text-xl font-bold text-rose-900 hover:scale-110 transition-all duration-300 flex items-center gap-2 z-10"
                >
                    Finish Celebration! <ArrowRight className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};
