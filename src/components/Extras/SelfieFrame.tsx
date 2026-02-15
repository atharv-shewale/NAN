import { useRef, useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SelfieFrame = ({ onClose }: { onClose: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const { userName, setSelfie } = useAppStore();
    const shutterSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'));

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            alert("Unable to access camera. Please check permissions!");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        setCountdown(3);
        let count = 3;
        const timer = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(timer);
                capture();
                setCountdown(null);
            }
        }, 1000);
    };

    const [flash, setFlash] = useState(false);

    const capture = () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 200);

        if (videoRef.current && canvasRef.current) {
            // ... existing capture logic ...
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Set canvas dimensions
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw video
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1); // Mirror
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset with 6 args

                // Verify context state before drawing overlay
                ctx.save();

                // Add Overlay (Polaroid Style)
                const border = 40;

                // Draw white border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = border * 2;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                // Add Text
                ctx.fillStyle = '#FFD700'; // Gold
                ctx.font = 'bold 48px "Brush Script MT", cursive';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 10;
                ctx.fillText(`Happy Birthday ${userName}!`, canvas.width / 2, canvas.height - 40);

                ctx.restore();

                setPhoto(canvas.toDataURL('image/png'));
                stopCamera(); // Stop camera immediately after capture

                // Play shutter sound
                shutterSound.current.play().catch(e => console.log('Audio play failed', e));
            }
        }
    };

    const handleRetake = () => {
        setPhoto(null);
        startCamera();
    };

    const saveAndClose = () => {
        if (photo) {
            setSelfie(photo);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            {/* ... */}

            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-3xl overflow-hidden border-4 border-birthday-gold shadow-2xl">
                {!photo ? (
                    // ... existing video render ...
                    <>
                        {/* Live Video */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover transform -scale-x-100"
                        />

                        {/* Overlay with Capture Button */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/50 to-transparent">
                            {countdown !== null ? (
                                <div className="text-8xl font-bold text-white animate-bounce drop-shadow-lg">
                                    {countdown}
                                </div>
                            ) : (
                                <button
                                    onClick={takePhoto}
                                    className="w-20 h-20 rounded-full border-4 border-white bg-red-500 hover:bg-red-600 transition-transform hover:scale-110 shadow-lg flex items-center justify-center group"
                                    aria-label="Take Photo"
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-black/20 group-active:scale-90 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* Flash Effect */}
                        {flash && <div className="absolute inset-0 bg-white animate-flash z-20 pointer-events-none" />}

                    </>
                ) : (
                    <>
                        <img src={photo} alt="Selfie" className="w-full h-full object-contain" />
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
                            <button
                                onClick={handleRetake}
                                className="glass-effect px-6 py-3 rounded-full text-white flex items-center gap-2 hover:bg-white/20"
                            >
                                <RefreshCw className="w-5 h-5" /> Retake
                            </button>
                            <button
                                onClick={saveAndClose}
                                className="glass-effect px-8 py-3 rounded-full text-birthday-gold font-bold flex items-center gap-2 hover:bg-white/20 border-2 border-birthday-gold"
                            >
                                <Download className="w-5 h-5" /> Keep it!
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Hidden Canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};
