import confetti from 'canvas-confetti';

interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: ('circle' | 'square')[];
    scalar?: number;
}

export const useConfetti = () => {
    // Canvas ref removed as it was unused (using global canvas-confetti)

    const fire = (options: ConfettiOptions = {}) => {
        const defaults = {
            particleCount: 50, // Reduced from 100
            spread: 60, // Reduced from 70
            origin: { y: 0.6 },
            colors: ['#FFB3C1', '#FFC2D1', '#E8D5F2', '#FF9AA2'],
            scalar: 0.8, // Smaller particles
        };

        confetti({
            ...defaults,
            ...options,
        });
    };

    const fireworks = () => {
        const duration = 2 * 1000; // Reduced from 3 seconds
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 300, ticks: 50, zIndex: 0 }; // Reduced velocity and ticks

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 30 * (timeLeft / duration); // Reduced from 50

            confetti({
                ...defaults,
                particleCount,
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                colors: ['#FFB3C1', '#FFC2D1', '#E8D5F2', '#FF9AA2'],
                scalar: 0.7,
            });
        }, 300); // Increased interval from 250ms
    };

    const burst = () => {
        const count = 100; // Reduced from 200
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#FFB3C1', '#FFC2D1', '#E8D5F2', '#FF9AA2'],
            scalar: 0.8,
        };

        function fireConfetti(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        fireConfetti(0.25, {
            spread: 26,
            startVelocity: 45, // Reduced from 55
        });

        fireConfetti(0.2, {
            spread: 50, // Reduced from 60
        });

        fireConfetti(0.35, {
            spread: 80, // Reduced from 100
            decay: 0.91,
            scalar: 0.7, // Reduced from 0.8
        });

        fireConfetti(0.1, {
            spread: 100, // Reduced from 120
            startVelocity: 20, // Reduced from 25
            decay: 0.92,
            scalar: 1,
        });

        fireConfetti(0.1, {
            spread: 100, // Reduced from 120
            startVelocity: 35, // Reduced from 45
        });
    };

    return { fire, fireworks, burst };
};
