import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

interface OpeningCardProps {
    onOpen: () => void;
}

export const OpeningCard = ({ onOpen }: OpeningCardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(() => {
            onOpen();
        }, 2000); // Wait for animation to finish
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFD1DC] floral-bg overflow-hidden">
            <div className="relative w-full h-full max-w-lg max-h-[600px] flex items-center justify-center perspective-1000">
                <motion.div
                    className="relative w-80 h-60 bg-rose-100 shadow-2xl rounded-lg cursor-pointer preserve-3d"
                    onClick={handleOpen}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: isOpen ? 5 : 1,
                        opacity: isOpen ? 0 : 1,
                        rotateX: isOpen ? 180 : 0
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    {/* Envelope Flap */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1/2 bg-rose-200 origin-top z-20 rounded-t-lg border-b-2 border-rose-300 flex items-center justify-center"
                        animate={{ rotateX: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-red-700">
                            <Heart className="w-6 h-6 text-white fill-white" />
                        </div>
                    </motion.div>

                    {/* Envelope Body */}
                    <div className="absolute bottom-0 left-0 w-full h-full bg-rose-100 rounded-lg border-2 border-rose-200 flex items-center justify-center overflow-hidden z-10">
                        <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-50">
                            <span className="text-6xl text-rose-300 font-handwriting">For You</span>
                        </div>

                        {/* Decorative elements */}
                        <Star className="absolute top-4 right-4 w-6 h-6 text-birthday-gold animate-pulse" />
                        <Star className="absolute bottom-4 left-4 w-6 h-6 text-birthday-gold animate-pulse delay-75" />
                    </div>

                    {/* Card Inside (Hidden initially) */}
                    <motion.div
                        className="absolute inset-x-4 top-4 bottom-0 bg-white shadow-inner rounded-t-lg z-0 flex flex-col items-center pt-8"
                        initial={{ y: 0 }}
                        animate={{ y: isOpen ? -100 : 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                    >
                        <h2 className="text-2xl font-bold text-rose-900 font-handwriting">Happy Birthday!</h2>
                        <Heart className="w-8 h-8 text-rose-500 mt-4 animate-bounce" />
                    </motion.div>
                </motion.div>

                {!isOpen && (
                    <motion.div
                        className="absolute bottom-1/4 text-rose-800 font-bold text-xl animate-bounce"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        Tap to Open 💌
                    </motion.div>
                )}
            </div>
        </div>
    );
};
