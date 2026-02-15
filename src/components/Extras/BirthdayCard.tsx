import { useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Download, Heart } from 'lucide-react';
import html2canvas from 'html2canvas';
import { sendBirthdaySummary } from '../../utils/emailService';

export const BirthdayCard = () => {
    const { userName, selfieImage, wishMessage, bucketList } = useAppStore();
    const cardRef = useRef<HTMLDivElement>(null);
    const hasSentRef = useRef(false);

    useEffect(() => {
        if (!hasSentRef.current) {
            hasSentRef.current = true;
            sendBirthdaySummary(userName, wishMessage, bucketList);
        }
    }, [userName, wishMessage, bucketList]);

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, {
                    scale: 2, // High quality
                    backgroundColor: null,
                    useCORS: true
                });

                const link = document.createElement('a');
                link.download = `Happy-Birthday-${userName}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error('Error generating card:', error);
                alert('Oops! Could not save the card. Try taking a screenshot!');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 floral-bg">
            <h2 className="text-4xl md:text-5xl font-bold text-rose-900 mb-8 text-center animate-fade-in font-handwriting">
                A Keepsake For You 💖
            </h2>

            {/* The Card - To Capture */}
            <div
                ref={cardRef}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full transform rotate-1 hover:rotate-0 transition-transform duration-500 mb-8 border-8 border-birthday-gold relative overflow-hidden"
            >
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-rose-100 rounded-br-full -translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-rose-100 rounded-tl-full translate-x-10 translate-y-10" />

                {/* Content */}
                <div className="text-center relative z-10">
                    <div className="mb-6 relative inline-block">
                        {selfieImage ? (
                            <img
                                src={selfieImage}
                                alt="Birthday Star"
                                className="w-64 h-64 object-cover rounded-xl border-4 border-rose-200 shadow-md transform -rotate-2"
                            />
                        ) : (
                            <div className="w-64 h-64 bg-rose-50 rounded-xl border-4 border-rose-200 flex items-center justify-center text-rose-300 transform -rotate-2">
                                <span className="text-4xl">🎂</span>
                            </div>
                        )}
                        <Heart className="absolute -top-4 -right-4 w-10 h-10 text-rose-500 fill-rose-500 animate-bounce" />
                    </div>

                    <h1 className="text-4xl font-bold text-gradient mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Happy Birthday!
                    </h1>
                    <h3 className="text-2xl text-rose-800 font-handwriting mb-4">
                        Dearest {userName}
                    </h3>

                    <p className="text-gray-600 italic text-sm mb-6">
                        "May your year be filled with magic, laughter, and endless joy. You are loved!" ✨
                    </p>

                    <div className="flex justify-center gap-2 text-rose-400">
                        <span className="text-xs">{new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-xs">With Love ❤️</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={handleDownload}
                    className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                    <Download className="w-5 h-5" /> Download Card
                </button>
            </div>
            <p className="mt-8 text-rose-800/60 text-sm">
                Thank you for celebrating! 🎈
            </p>
        </div>
    );
};
