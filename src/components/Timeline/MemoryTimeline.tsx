import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Calendar, MapPin, Camera, Gift } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Memory {
    date: string;
    title: string;
    description: string;
    icon: string;
    location?: string;
}

const memories: Memory[] = [
    {
        date: "Today",
        title: "Your Special Day! 🎂",
        description: "Celebrating another year of being amazing!",
        icon: "🎉",
        location: "Right here, right now",
    },
    {
        date: "This Year",
        title: "Incredible Achievements",
        description: "You've accomplished so much and grown in wonderful ways.",
        icon: "🌟",
    },
    {
        date: "Last Year",
        title: "Unforgettable Moments",
        description: "So many beautiful memories created together.",
        icon: "💫",
    },
    {
        date: "Always",
        title: "Forever Grateful",
        description: "For every moment, every smile, every memory.",
        icon: "💖",
        location: "In our hearts",
    },
];

export const MemoryTimeline = () => {
    const { setScene } = useAppStore();
    useEffect(() => {
        // Simple, robust animation targeted by class name
        gsap.from(".timeline-item", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            clearProps: 'all'
        });
    }, []);

    const handleNext = () => {
        setScene('bucket-list');
    };

    const [showSecretMessage, setShowSecretMessage] = useState(false);

    return (
        <div className="min-h-screen py-20 px-4 floral-bg relative">
            <div className="text-center mb-16">
                <Calendar className="w-16 h-16 text-birthday-gold mx-auto mb-4 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
                    Memory Timeline 📅
                </h2>
                <p className="text-xl text-rose-900">
                    A journey through beautiful moments...
                </p>
            </div>

            <div className="max-w-4xl mx-auto relative min-h-[600px]">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-birthday-pink via-birthday-purple to-birthday-blue" />

                {/* Secret Memory Box - Centered in timeline */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 animate-bounce-slow text-center w-full flex justify-center py-10">
                    <button
                        onClick={() => setShowSecretMessage(true)}
                        className="group relative"
                    >
                        <div className="absolute inset-0 bg-pink-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border-4 border-pink-300 shadow-xl group-hover:scale-110 transition-transform duration-300 flex flex-col items-center gap-2">
                            <Gift className="w-12 h-12 text-pink-600" />
                            <span className="font-bold text-rose-800">Future Memories</span>
                        </div>
                        <span className="absolute -top-2 -right-2 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
                        </span>
                    </button>
                </div>

                {/* Timeline items */}
                {memories.map((memory, index) => (
                    <div
                        key={index}
                        className={`timeline-item flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                            }`}
                    >
                        {/* Content */}
                        <div className="w-5/12">
                            <div className="glass-effect p-6 rounded-2xl hover:scale-105 transition-transform">
                                <div className="flex items-center gap-2 mb-2 text-birthday-gold">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{memory.date}</span>
                                </div>

                                <h3 className="text-2xl font-bold text-rose-900 mb-2">
                                    {memory.title}
                                </h3>

                                <p className="text-rose-800 mb-3">
                                    {memory.description}
                                </p>

                                {memory.location && (
                                    <div className="flex items-center gap-2 text-rose-600 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{memory.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="w-2/12 flex justify-center">
                            <div className="w-16 h-16 glass-effect rounded-full flex items-center justify-center text-3xl border-4 border-birthday-gold z-10">
                                {memory.icon}
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="w-5/12" />
                    </div>
                ))}
            </div>

            <div className="text-center mt-16">
                <button
                    onClick={handleNext}
                    className="glass-effect px-8 py-4 rounded-full text-xl font-bold text-rose-900 hover:scale-110 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                    View Photo Album <Camera className="w-6 h-6" />
                </button>
            </div>
            {/* Secret Message Modal */}
            {showSecretMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl max-w-lg w-full text-center border-4 border-pink-300 shadow-2xl relative">
                        <button
                            onClick={() => setShowSecretMessage(false)}
                            className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <div className="mb-6 inline-block p-4 bg-pink-100 rounded-full animate-bounce">
                            <Gift className="w-12 h-12 text-pink-600" />
                        </div>

                        <h3 className="text-3xl font-bold text-rose-900 mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                            Future Memories ✨
                        </h3>

                        <p className="text-xl text-rose-800 leading-relaxed font-medium">
                            "We may not have many pictures together <i>yet</i>, but this box is saved for all the beautiful moments we are going to create.
                            <br /><br />
                            Get ready for a lifetime of smiles, laughter, and endless memories waiting to be captured! 📸💖"
                        </p>

                        <div className="mt-8 flex justify-center gap-2">
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>❤️</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
