import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
    id: number;
    emoji: string;
    caption: string;
    note: string;
}

const photos: Photo[] = [
    {
        id: 1,
        emoji: "🎂",
        caption: "The Birthday Star!",
        note: "Shining bright today and always ✨",
    },
    {
        id: 2,
        emoji: "🌟",
        caption: "You're Amazing!",
        note: "Never forget how special you are 💖",
    },
    {
        id: 3,
        emoji: "🎈",
        caption: "Celebrate You!",
        note: "Today is all about celebrating YOU! 🎉",
    },
    {
        id: 4,
        emoji: "💝",
        caption: "Precious Moments",
        note: "Every moment with you is a gift 🎁",
    },
    {
        id: 5,
        emoji: "🌈",
        caption: "Colorful Memories",
        note: "You bring color to every day 🌺",
    },
];

export const Scrapbook = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { setScene } = useAppStore();

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % photos.length);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const handleFinish = () => {
        setScene('card');
    };

    const currentPhoto = photos[currentPage];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 floral-bg">
            <div className="text-center mb-12">
                <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
                    Digital Scrapbook 📸
                </h2>
                <p className="text-xl text-rose-900">
                    Flip through precious memories...
                </p>
            </div>

            {/* Scrapbook */}
            <div className="relative w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="glass-effect p-8 md:p-12 rounded-3xl cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                    >
                        {/* Photo */}
                        <div className="bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue rounded-2xl p-12 mb-6 flex items-center justify-center min-h-[300px]">
                            <div className="text-9xl">{currentPhoto.emoji}</div>
                        </div>

                        {/* Caption */}
                        <h3 className="text-3xl font-bold text-rose-900 text-center mb-3">
                            {currentPhoto.caption}
                        </h3>

                        {/* Note */}
                        <p className="text-xl text-rose-800 text-center italic">
                            "{currentPhoto.note}"
                        </p>

                        {/* Page number */}
                        <div className="text-center mt-6 text-rose-600">
                            {currentPage + 1} / {photos.length}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <button
                    onClick={prevPage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 glass-effect p-4 rounded-full hover:scale-110 transition-transform"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-8 h-8 text-rose-900" />
                </button>

                <button
                    onClick={nextPage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 glass-effect p-4 rounded-full hover:scale-110 transition-transform"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-8 h-8 text-rose-900" />
                </button>
            </div>

            {/* Finish button */}
            <button
                onClick={handleFinish}
                className="mt-12 glass-effect px-8 py-4 rounded-full text-xl font-bold text-rose-900 hover:scale-110 transition-all duration-300 flex items-center gap-2"
            >
                Continue Adventure <ArrowRight className="w-6 h-6" />
            </button>

            {/* Fullscreen modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-8 right-8 glass-effect p-4 rounded-full hover:scale-110 transition-transform"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div className="text-center">
                            <div className="text-[200px] mb-8">{currentPhoto.emoji}</div>
                            <h3 className="text-5xl font-bold text-rose-900 mb-4">
                                {currentPhoto.caption}
                            </h3>
                            <p className="text-2xl text-rose-800 italic">
                                "{currentPhoto.note}"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
