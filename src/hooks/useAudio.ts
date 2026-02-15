import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAppStore } from '../store/useAppStore';

interface UseAudioOptions {
    src: string;
    loop?: boolean;
    volume?: number;
    autoplay?: boolean;
}

export const useAudio = ({ src, loop = false, volume = 0.5, autoplay = false }: UseAudioOptions) => {
    const soundRef = useRef<Howl | null>(null);
    const isAudioMuted = useAppStore((state) => state.isAudioMuted);
    const hasInteracted = useAppStore((state) => state.hasInteracted);

    useEffect(() => {
        soundRef.current = new Howl({
            src: [src],
            loop,
            volume: isAudioMuted ? 0 : volume,
            autoplay: autoplay && hasInteracted,
        });

        return () => {
            soundRef.current?.unload();
        };
    }, [src, loop]);

    useEffect(() => {
        if (soundRef.current) {
            soundRef.current.volume(isAudioMuted ? 0 : volume);
        }
    }, [isAudioMuted, volume]);

    const play = () => {
        if (soundRef.current && !isAudioMuted) {
            soundRef.current.play();
        }
    };

    const pause = () => {
        soundRef.current?.pause();
    };

    const stop = () => {
        soundRef.current?.stop();
    };

    return { play, pause, stop, sound: soundRef.current };
};
