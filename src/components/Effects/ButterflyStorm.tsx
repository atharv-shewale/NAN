import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Butterfly {
    id: number;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    color: string;
    delay: number;
    type: 'blue' | 'purple' | 'pink' | 'gold';
}

const colors = {
    blue: '#A0D8EF',
    purple: '#E8D5F2',
    pink: '#FFB3C1',
    gold: '#FFD700'
};

export const ButterflyStorm = ({ isActive }: { isActive: boolean }) => {
    const [butterflies, setButterflies] = useState<Butterfly[]>([]);

    useEffect(() => {
        if (isActive) {
            const newButterflies = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: 0.5 + Math.random() * 0.8,
                rotation: Math.random() * 360,
                color: Object.values(colors)[Math.floor(Math.random() * 4)],
                delay: Math.random() * 2,
                type: ['blue', 'purple', 'pink', 'gold'][Math.floor(Math.random() * 4)] as any
            }));
            setButterflies(newButterflies);
        } else {
            setButterflies([]);
        }
    }, [isActive]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {isActive && butterflies.map((b) => (
                    <motion.div
                        key={b.id}
                        initial={{
                            opacity: 0,
                            x: `${b.x}vw`,
                            y: '110vh',
                            scale: 0
                        }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            x: [
                                `${b.x}vw`,
                                `${b.x + (Math.random() * 20 - 10)}vw`,
                                `${b.x - (Math.random() * 20 - 10)}vw`
                            ],
                            y: '-10vh',
                            scale: [0, b.scale, b.scale, 0],
                            rotate: [b.rotation, b.rotation + 45, b.rotation - 45, b.rotation]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            delay: b.delay,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                        style={{
                            position: 'absolute',
                            width: '40px',
                            height: '40px',
                            color: b.color
                        }}
                    >
                        {/* SVG Butterfly */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-lg">
                            <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-1.5-3.6l-1 2.4c-.4.9.2 2 1.2 2 .5 0 1-.3 1.2-.7l1.1-3.7c-1.3.4-2.5.4-2.5 0zm5.5-.3l-2-.8c.4 1.3.4 2.6 0 3.9l1.1 3.7c.2.5.7.8 1.2.8 1 0 1.6-1.1 1.2-2l-1-2.4c0-.4-.3-2.1-.5-3.2z" opacity="0.5" />
                            <path d="M8.8 6.4c-1.1.2-1.9 1.4-1.9 2.5 0 2.2 2.6 3.6 4.1 4.6.4.3.5.7.3 1.1-.9 1.4-2.2 2.7-3.6 2.7H7c-1.1 0-2-.9-2-2 0-3.3 2.7-6 6-6 .9 0 1.8.2 2.6.5-.4-.6-.9-1.3-1.4-1.9-1.1-1.3-2.4-1.7-3.4-1.5z" />
                            <path d="M17 15.3h-.6c-1.4 0-2.8-1.3-3.6-2.7-.2-.4-.1-.9.3-1.1 1.5-1 4.1-2.4 4.1-4.6 0-1.1-.9-2.3-1.9-2.5-1-.2-2.3.2-3.4 1.5-.5.6-1 1.3-1.4 1.9.8-.3 1.7-.5 2.6-.5 3.3 0 6 2.7 6 6 0 1.1-.9 2-2 2z" />
                        </svg>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
