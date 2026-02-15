import { create } from 'zustand';

export type Scene =
    | 'welcome'
    | 'ar-cake'
    | 'countdown'
    | 'vault'
    | 'interactive-cake'
    | 'wish'
    | 'wishing-card'
    | 'timeline'
    | 'scrapbook'
    | 'balloons'
    | 'bouquet'
    | 'bucket-list'
    | 'card'
    | 'avatar'
    | 'loading';

interface AppState {
    currentScene: Scene;
    isAudioMuted: boolean;
    userName: string;
    hasInteracted: boolean;
    completedScenes: Scene[];

    setScene: (scene: Scene) => void;
    toggleAudio: () => void;
    setUserName: (name: string) => void;
    setHasInteracted: (value: boolean) => void;
    markSceneComplete: (scene: Scene) => void;
    selfieImage: string | null;
    wishMessage: string;
    bucketList: string[];
    setSelfie: (image: string) => void;
    setWish: (message: string) => void;
    setBucketList: (items: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentScene: 'welcome',
    isAudioMuted: false,
    userName: 'Nandini Jii',
    hasInteracted: false,
    completedScenes: [],

    selfieImage: null,
    wishMessage: '',
    bucketList: [],

    setScene: (scene) => set({ currentScene: scene }),
    toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
    setUserName: (name) => set({ userName: name }),
    setHasInteracted: (value) => set({ hasInteracted: value }),
    markSceneComplete: (scene) =>
        set((state) => ({
            completedScenes: state.completedScenes.includes(scene)
                ? state.completedScenes
                : [...state.completedScenes, scene],
        })),
    setSelfie: (image) => set({ selfieImage: image }),
    setWish: (message) => set({ wishMessage: message }),
    setBucketList: (items) => set({ bucketList: items }),
}));
