import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useConfetti } from '../../hooks/useConfetti';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { gsap } from 'gsap';

import { SelfieFrame } from '../Extras/SelfieFrame';
import { OpeningCard } from './OpeningCard';

export const WelcomeScreen = () => {
    const { userName, isAudioMuted, setScene, toggleAudio, setHasInteracted, selfieImage } = useAppStore();
    const { fireworks, burst, fire } = useConfetti();
    const containerRef = useRef<HTMLDivElement>(null);
    const [showSelfie, setShowSelfie] = useState(false);
    const [showOpeningCard, setShowOpeningCard] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    // Watch for selfie capture to trigger celebration
    useEffect(() => {
        if (selfieImage && !showSelfie) {
            setShowSuccess(true);
            fire({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            setTimeout(() => setShowSuccess(false), 3000);
        }
    }, [selfieImage, showSelfie, fire]);

    const handleCardOpen = () => {
        setShowOpeningCard(false);
        // Trigger fireworks slightly after card opens
        setTimeout(() => {
            fireworks();
        }, 500);
    };

    // ... existing useEffect ...

    const handleStart = () => {
        // ... existing handleStart ...
        setHasInteracted(true);
        burst();

        // Animate out
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                ease: 'power2.in',
                onComplete: () => {
                    setScene('interactive-cake');
                },
            });
        } else {
            // Fallback if ref is missing
            setScene('interactive-cake');
        }
    };

    if (showOpeningCard) {
        return <OpeningCard onOpen={handleCardOpen} />;
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 floral-bg"
            style={{ opacity: 1 }}
        >
            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-lg">
                        <span>✨ Beautiful! Selfie Saved!</span>
                    </div>
                </div>
            )}

            {/* ... remaining JSX ... */}
            {/* Floating hearts and flowers */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-4xl opacity-20 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    >
                        {['🌸', '🌺', '💐', '🌷', '🦋'][i % 5]}
                    </div>
                ))}
            </div>

            {/* Audio toggle */}
            <button
                onClick={toggleAudio}
                className="absolute top-8 right-8 glass-effect p-4 rounded-full hover:scale-110 transition-transform z-10"
                aria-label="Toggle audio"
            >
                {isAudioMuted ? (
                    <VolumeX className="w-6 h-6 text-rose-800" />
                ) : (
                    <Volume2 className="w-6 h-6 text-rose-800" />
                )}
            </button>

            {/* Main content */}
            <div className="text-center z-10 max-w-4xl animate-fade-in">
                <div className="mb-8 flex justify-center gap-4">
                    <Heart className="w-16 h-16 text-coral animate-pulse fill-coral" />
                    <Sparkles className="w-16 h-16 text-rose-blush animate-sparkle" />
                    <Heart className="w-16 h-16 text-coral animate-pulse fill-coral" />
                </div>

                <h1
                    className="text-6xl md:text-8xl font-bold mb-6 text-gradient text-shadow-soft"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    Happy Birthday! 🎂
                </h1>

                <p className="text-2xl md:text-3xl text-rose-900 mb-12 font-medium">
                    Welcome to your special day, <span className="font-bold text-coral">{userName}</span>! 💕
                </p>

                <div className="mt-8 flex flex-col items-center gap-4">
                    {/* Step 1: Selfie */}
                    <div className="relative group">
                        <button
                            onClick={() => setShowSelfie(true)}
                            className={`
                                relative px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center gap-3 shadow-xl
                                ${selfieImage
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-white text-rose-600 hover:scale-105 animate-pulse-slow border-2 border-rose-200'
                                }
                            `}
                        >
                            {selfieImage ? (
                                <>
                                    <span className="text-2xl">✅</span>
                                    <span>Selfie Ready!</span>
                                    <span className="text-xs opacity-75 font-normal ml-1">(Click to retake)</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-2xl">📸</span>
                                    <span>Take Birthday Selfie</span>
                                </>
                            )}
                        </button>

                        {!selfieImage && (
                            <div className="absolute -right-32 top-1/2 -translate-y-1/2 bg-yellow-300 text-rose-900 text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-horizontal hidden md:block">
                                👈 For a surprise later!
                            </div>
                        )}
                    </div>

                    {/* Step 2: Start */}
                    <button
                        onClick={handleStart}
                        className={`
                            btn-primary text-2xl md:text-3xl px-12 py-6 mt-4
                            ${!selfieImage ? 'opacity-90' : 'animate-bounce-soft'}
                        `}
                    >
                        Let's Celebrate! 🎉
                    </button>
                </div>

                <p className="mt-8 text-rose-800/80 text-sm font-semibold">
                    {selfieImage
                        ? "You look great! All set to party! ✨"
                        : "Tip: Take a selfie for the full experience! ✨"}
                </p>
            </div>

            {/* Selfie Frame Modal */}
            {showSelfie && <SelfieFrame onClose={() => setShowSelfie(false)} />}

            {/* Floating decorative elements */}
            <div className="absolute bottom-10 left-10 text-7xl animate-float">🎈</div>
            <div className="absolute bottom-20 right-20 text-7xl animate-float" style={{ animationDelay: '0.5s' }}>🎁</div>
            <div className="absolute top-20 left-20 text-7xl animate-float" style={{ animationDelay: '1s' }}>🌸</div>
            <div className="absolute top-32 right-32 text-7xl animate-float" style={{ animationDelay: '1.5s' }}>🦋</div>
        </div>
    );
};
