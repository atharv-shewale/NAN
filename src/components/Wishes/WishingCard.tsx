import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Mail, ArrowRight, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { useConfetti } from '../../hooks/useConfetti';

export const WishingCard = () => {
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { setScene } = useAppStore();
    const { fire } = useConfetti();
    const cardRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.from(cardRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'back.out(1.2)',
            });
        }
    }, []);

    const handleOpen = () => {
        if (message.trim()) {
            setIsOpen(true);
            fire({ particleCount: 100, spread: 70, origin: { x: 0.5, y: 0.6 } });

            // Envelope opening animation
            const tl = gsap.timeline();

            // 1. Flip envelope
            tl.to(envelopeRef.current, {
                rotateX: 180,
                duration: 0.8,
                ease: 'power2.inOut',
            });

            // 2. Pull letter out
            tl.to(letterRef.current, {
                y: -150,
                duration: 1,
                ease: 'power2.out',
            }, "-=0.2");

            // 3. Expand letter
            tl.to(letterRef.current, {
                y: 0,
                scale: 1.1,
                zIndex: 50,
                duration: 0.8,
                ease: 'back.out(1.7)',
            });
        }
    };

    const handleNext = () => {
        setScene('bucket-list');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden bg-gradient-to-br from-pink-600 via-purple-600 to-rose-500">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-yellow-200 opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            fontSize: `${Math.random() * 20 + 10}px`
                        }}
                    >
                        ★
                    </div>
                ))}
            </div>

            <div className="text-center mb-8 z-10 relative">
                <Mail className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-bounce-soft" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                    A Note to Future Me 💌
                </h2>
                <p className="text-xl text-purple-200 font-medium max-w-lg mx-auto">
                    Write a promise, a hope, or a love letter to yourself...
                </p>
            </div>

            <div ref={cardRef} className="relative w-full max-w-2xl perspective-1000 z-10">
                {!isOpen ? (
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border-4 border-pink-200 shadow-2xl transform transition-all hover:scale-[1.01]">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Dear me..."
                            className="w-full h-64 bg-pink-50 border-2 border-pink-200/50 rounded-2xl p-6 text-rose-900 text-xl placeholder-rose-300 focus:outline-none focus:border-pink-400 focus:bg-white transition-all resize-none font-handwriting leading-relaxed shadow-inner"
                            style={{ fontFamily: '"Indie Flower", cursive' }}
                            maxLength={500}
                        />

                        <div className="flex justify-between items-center mt-6">
                            <span className="text-rose-400 text-sm font-medium">
                                {message.length}/500
                            </span>

                            <button
                                onClick={handleOpen}
                                disabled={!message.trim()}
                                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-pink-400/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Seal & Open <Heart className="w-5 h-5 fill-white" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center">
                        {/* Envelope Base */}
                        <div ref={envelopeRef} className="w-full max-w-lg bg-pink-100 h-64 absolute bottom-0 rounded-b-2xl shadow-xl border-t-8 border-pink-200 z-20 origin-bottom" />

                        {/* Letter */}
                        <div
                            ref={letterRef}
                            className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl transform transition-all text-gray-800 relative z-10 mb-32"
                            style={{ fontFamily: '"Indie Flower", cursive' }}
                        >
                            <div className="absolute top-4 right-4 text-4xl opacity-20">📮</div>
                            <h3 className="text-2xl font-bold mb-4 text-purple-900 border-b-2 border-purple-100 pb-2">To Me,</h3>
                            <p className="text-xl leading-relaxed whitespace-pre-wrap min-h-[100px]">
                                {message}
                            </p>
                            <div className="text-right mt-8 text-sm text-gray-500 font-sans">
                                — {new Date().toLocaleDateString()}
                            </div>
                        </div>

                        <div className="fixed bottom-10 z-50 animate-fade-in">
                            <button
                                onClick={handleNext}
                                className="px-10 py-4 bg-yellow-400 text-purple-900 rounded-full text-xl font-bold shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-2"
                            >
                                Continue Journey <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Instruction */}
            {!isOpen && (
                <div className="absolute bottom-10 text-white/90 text-sm animate-pulse z-10 font-medium tracking-wide drop-shadow-md">
                    Your words are magic. Write them down.
                </div>
            )}
        </div>
    );
};
