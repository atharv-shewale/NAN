import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Sparkles, Star } from 'lucide-react';
import { gsap } from 'gsap';

const ShootingStars = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars: { x: number; y: number; size: number; speed: number }[] = [];
        const shootingStars: { x: number; y: number; len: number; speed: number; angle: number }[] = [];

        // Init static stars
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';

            // Draw static stars
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Twinkle
                if (Math.random() > 0.95) {
                    star.size = Math.random() * 2;
                }
            });

            // Handle shooting stars
            if (Math.random() > 0.98 && shootingStars.length < 5) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: 0,
                    len: Math.random() * 80 + 20,
                    speed: Math.random() * 10 + 5,
                    angle: Math.PI / 4 // 45 degrees
                });
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];

                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
                ctx.lineWidth = 2;
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.len * Math.cos(s.angle), s.y - s.len * Math.sin(s.angle));
                ctx.stroke();

                s.x += s.speed * Math.cos(s.angle);
                s.y += s.speed * Math.sin(s.angle);

                if (s.x > canvas.width || s.y > canvas.height) {
                    shootingStars.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none fade-in-slow" />;
};

export const WishBox = () => {
    const [wish, setLocalWish] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { setScene, setWish } = useAppStore();
    const wishBoxRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleSubmit = () => {
        if (wish.trim()) {
            setIsSubmitted(true);
            setWish(wish);


            // Glow animation
            if (glowRef.current) {
                gsap.to(glowRef.current, {
                    scale: 1.5,
                    opacity: 0.6, // Low opacity to avoid contrast issues
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        gsap.to(glowRef.current, {
                            scale: 20,
                            opacity: 0,
                            duration: 1.5,
                            ease: 'power2.out'
                        });
                    }
                });
            }

            setTimeout(() => {
                setScene('wishing-card');
            }, 2000);
        }
    };

    useEffect(() => {
        if (wishBoxRef.current) {
            // Ensure visibility start
            gsap.set(wishBoxRef.current, { visibility: 'visible' });
            gsap.fromTo(wishBoxRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)' }
            );
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden bg-gradient-to-b from-purple-900 via-fuchsia-900 to-pink-900">
            <ShootingStars />

            <div className="text-center mb-12 z-10 relative">
                <div className="flex justify-center gap-4 mb-4">
                    <Star className="w-12 h-12 text-yellow-300 animate-spin-slow" />
                    <Sparkles className="w-16 h-16 text-rose-200 animate-pulse" />
                    <Star className="w-12 h-12 text-yellow-300 animate-spin-slow" />
                </div>

                <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-indigo-200 mb-4" style={{ fontFamily: '"Playfair Display", serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                    Make a Wish ✨
                </h2>
                <p className="text-xl text-indigo-100 font-medium max-w-lg mx-auto">
                    The stars are listening. Close your eyes, make a wish, and send it to the universe... 🌟
                </p>
            </div>

            <div ref={wishBoxRef} className="relative w-full max-w-2xl z-10 opactiy-0">
                {/* Glow effect */}
                <div
                    ref={glowRef}
                    className="absolute inset-0 bg-yellow-400 rounded-3xl blur-3xl opacity-0 pointer-events-none"
                />

                <div className="glass-effect p-8 rounded-3xl border border-white/20 shadow-2xl relative bg-black/40 backdrop-blur-md">
                    {!isSubmitted ? (
                        <>
                            <textarea
                                value={wish}
                                onChange={(e) => setLocalWish(e.target.value)}
                                placeholder="I wish for..."
                                className="w-full h-48 bg-white/10 border-2 border-indigo-300/30 rounded-2xl p-6 text-white text-2xl placeholder-indigo-200 focus:outline-none focus:border-yellow-300 focus:bg-white/20 transition-all resize-none font-medium leading-relaxed"
                                maxLength={200}
                                autoFocus
                            />

                            <div className="flex justify-between items-center mt-6">
                                <span className="text-indigo-200 text-sm font-medium">
                                    {wish.length}/200
                                </span>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!wish.trim()}
                                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold text-white shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    Send to Stars <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="text-7xl mb-6 animate-bounce">🌠</div>
                            <h3 className="text-4xl font-bold text-rose-900 mb-4 drop-shadow-md">
                                Wish Sent!
                            </h3>
                            <p className="text-indigo-100 text-xl font-medium drop-shadow-md">
                                Look up... it's already on its way. 💫
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Instruction hint */}
            {!isSubmitted && (
                <div className="absolute bottom-10 text-indigo-300 text-sm animate-pulse z-10">
                    Type your wish above and send it to the stars
                </div>
            )}
        </div>
    );
};
