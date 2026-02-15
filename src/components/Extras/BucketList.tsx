import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check, ArrowRight } from 'lucide-react';
import { useConfetti } from '../../hooks/useConfetti';

interface BucketItem {
    id: string;
    text: string;
    icon: React.ReactNode;
    checked: boolean;
}

export const BucketList = () => {
    const { setScene } = useAppStore();
    const { fire } = useConfetti();
    const [items, setItems] = useState<BucketItem[]>([
        { id: 'japan', text: 'Travel to Japan 🇯🇵', icon: <span className="text-4xl">🌸</span>, checked: false },
        { id: 'brownie', text: 'Eat Brownies 🍫', icon: <span className="text-4xl">😋</span>, checked: false },
        { id: 'rasmalai', text: 'Rasmalai 🍮', icon: <span className="text-4xl">🥣</span>, checked: false },
        { id: 'stargaze', text: 'Stargazing Night ✨', icon: <span className="text-4xl">🌌</span>, checked: false },
        { id: 'drive', text: 'Long Drive & Music 🚗', icon: <span className="text-4xl">🎵</span>, checked: false },
        { id: 'cooking', text: 'Cooking Together 👨‍🍳', icon: <span className="text-4xl">🍳</span>, checked: false },
    ]);

    const [customItem, setCustomItem] = useState('');
    const [isAddingCustom, setIsAddingCustom] = useState(false);

    const toggleItem = (id: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const newChecked = !item.checked;
                if (newChecked) {
                    fire({ particleCount: 30, spread: 50, origin: { x: 0.5, y: 0.7 } });
                }
                return { ...item, checked: newChecked };
            }
            return item;
        }));
    };

    const addCustomItem = () => {
        if (customItem.trim()) {
            const newItem: BucketItem = {
                id: `custom-${Date.now()}`,
                text: customItem,
                icon: <span className="text-4xl">✨</span>,
                checked: true
            };
            setItems([...items, newItem]);
            setCustomItem('');
            setIsAddingCustom(false);
            fire({ particleCount: 30, spread: 50, origin: { x: 0.5, y: 0.7 } });
        }
    };

    const handleNext = () => {
        const checkedItems = items.filter(i => i.checked).map(i => i.text);
        useAppStore.getState().setBucketList(checkedItems);

        fire({ particleCount: 100, spread: 100 });
        setTimeout(() => {
            setScene('scrapbook');
        }, 800);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-2xl w-full bg-white p-8 rounded-3xl shadow-2xl border-4 border-purple-100 z-10 animate-fade-in relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-100 rounded-full blur-2xl opacity-50 pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-100 rounded-full blur-2xl opacity-50 pointer-events-none" />

                <h2 className="text-3xl font-bold text-center mb-2 text-purple-900 font-handwriting" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Our Bucket List 📝
                </h2>
                <p className="text-center text-gray-500 mb-8 font-medium">
                    Adventures for a kind & beautiful soul...
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`
                                group relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1
                                flex flex-col items-center text-center gap-2 overflow-hidden
                                ${item.checked
                                    ? 'bg-purple-50 border-purple-400 shadow-xl'
                                    : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-lg'
                                }
                            `}
                        >
                            {/* Background decoration for checked state */}
                            {item.checked && (
                                <div className="absolute inset-0 bg-purple-100/30 z-0" />
                            )}

                            <div className={`
                                resize-none w-12 h-12 rounded-full flex items-center justify-center text-2xl z-10 transition-transform duration-500
                                ${item.checked ? 'scale-110 rotate-12 bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white'}
                            `}>
                                {item.icon}
                            </div>

                            <span className={`text-base font-bold z-10 transition-colors ${item.checked ? 'text-purple-900' : 'text-gray-700'}`}>
                                {item.text}
                            </span>

                            {/* Checkmark Badge */}
                            <div className={`
                                absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 z-10
                                ${item.checked ? 'bg-green-500 scale-100' : 'bg-gray-200 scale-0'}
                            `}>
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    ))}

                    {/* Add Custom Item Button */}
                    {!isAddingCustom ? (
                        <button
                            onClick={() => setIsAddingCustom(true)}
                            className="p-4 rounded-2xl border-2 border-dashed border-purple-300 text-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center gap-2 h-full min-h-[140px]"
                        >
                            <span className="text-4xl">+</span>
                            <span className="font-bold">Write Your Own</span>
                        </button>
                    ) : (
                        <div className="p-4 rounded-2xl border-2 border-purple-400 bg-white shadow-lg flex flex-col gap-3">
                            <input
                                autoFocus
                                type="text"
                                value={customItem}
                                onChange={(e) => setCustomItem(e.target.value)}
                                placeholder="What's your wish?"
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-center"
                                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                            />
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={addCustomItem}
                                    className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm font-bold hover:bg-purple-700"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setIsAddingCustom(false)}
                                    className="text-gray-500 px-3 py-1 text-sm hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleNext}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                    >
                        Let's Make it Happen! <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <p className="mt-8 text-purple-800/60 font-medium animate-pulse">
                Click to add them to our story ✨
            </p>
        </div>
    );
};
