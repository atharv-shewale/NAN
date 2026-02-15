import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Float, Stars } from '@react-three/drei';
import { useAppStore } from '../../store/useAppStore';
import { Flower } from './Flower';
import { ArrowRight, Gift } from 'lucide-react';
import * as THREE from 'three';

// -- COMPONENT: Ground --
const GardenGround = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#7BC8A4" roughness={1} />
        </mesh>
    );
};

// -- COMPONENT: Scene Content --
type FlowerType = 'rose' | 'daisy' | 'tulip';

const BouquetScene = ({ gatheredCount, totalNeeded, isFinished, onSelect, selectedIds }: {
    gatheredCount: number,
    totalNeeded: number,
    isFinished: boolean,
    onSelect: (id: number, color: string, type: FlowerType) => void,
    selectedIds: number[]
}) => {
    // Generate random flower positions for the garden
    const gardenFlowers = useRef<{ id: number; pos: [number, number, number]; color: string; scale: number; type: FlowerType }[]>([]);

    if (gardenFlowers.current.length === 0) {
        const colors = ['#FF69B4', '#FFB7B2', '#FF9AA2', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F48FB1', '#CE93D8'];
        const types: FlowerType[] = ['rose', 'daisy', 'tulip'];

        for (let i = 0; i < 50; i++) {
            gardenFlowers.current.push({
                id: i,
                pos: [(Math.random() - 0.5) * 18, 0, (Math.random() - 0.5) * 12 - 2],
                color: colors[Math.floor(Math.random() * colors.length)],
                scale: 1.2 + Math.random() * 0.5, // Increased scale for visibility
                type: types[Math.floor(Math.random() * types.length)]
            });
        }
    }

    // State for picked flowers (for bouquet display)
    const [bouquet, setBouquet] = useState<{ id: number; color: string; type: FlowerType }[]>([]);

    // Update local bouquet state when parent selectedIds changes
    useEffect(() => {
        const newBouquet = gardenFlowers.current
            .filter(f => selectedIds.includes(f.id))
            .map(f => ({ id: f.id, color: f.color, type: f.type }));
        setBouquet(newBouquet);
    }, [selectedIds]);

    // Camera adjustment based on state
    useThree(({ camera }) => {
        if (isFinished) {
            // Updated camera position: Zoomed out and centered to see text + bouquet
            camera.position.set(0, 2, 14);
        } else {
            camera.position.set(0, 8, 14); // High angle for garden view
        }
        camera.lookAt(0, 0, 0);
    });

    return (
        <group>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="sunset" />

            {!isFinished && <GardenGround />}

            {/* Garden Flowers - Only show if not finished */}
            {!isFinished && gardenFlowers.current.map((flower) => {
                const isSelected = selectedIds.includes(flower.id);

                return (
                    <Flower
                        key={flower.id}
                        position={[flower.pos[0], isSelected ? flower.pos[1] + 1 : flower.pos[1], flower.pos[2]]}
                        color={flower.color}
                        scale={flower.scale}
                        rotation={[0, Math.random() * Math.PI, 0]}
                        type={flower.type}
                        isPicked={isSelected}
                        onClick={() => onSelect(flower.id, flower.color, flower.type)}
                    />
                );
            })}

            {/* The Final Bouquet (Floating) */}
            {isFinished && (
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                    {/* Lower the whole group so it stays under the text */}
                    <group position={[0, -2.5, 0]} rotation={[0, 0, 0]}>

                        {/* Wrapping Paper - Cone (Point Down) */}
                        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
                            {/* Point goes DOWN, Opening goes UP */}
                            <coneGeometry args={[1.5, 3.5, 32, 1, true]} />
                            <meshStandardMaterial color="#FFF" side={THREE.DoubleSide} transparent opacity={0.95} />
                        </mesh>

                        {/* The Knot (Ribbon) - Lowered to be near the hand-hold area */}
                        <mesh position={[0, -0.8, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.3, 0.08, 16, 32]} />
                            <meshStandardMaterial color="#FF69B4" />
                        </mesh>
                        <mesh position={[0.3, -1.2, 0.7]} rotation={[0, 0, -0.4]}>
                            <boxGeometry args={[0.15, 1, 0.02]} />
                            <meshStandardMaterial color="#FF69B4" />
                        </mesh>
                        <mesh position={[-0.3, -1.2, 0.7]} rotation={[0, 0, 0.4]}>
                            <boxGeometry args={[0.15, 1, 0.02]} />
                            <meshStandardMaterial color="#FF69B4" />
                        </mesh>

                        {/* Flowers - Positioned inside the cone opening */}
                        {bouquet.map((flower, index) => {
                            // Arrange tightly in a bunch
                            const angle = (index / bouquet.length) * Math.PI * 2;
                            const radius = Math.random() * 0.5; // Constrained radius to stay inside cone

                            // Y position logic: Lowered to look "inside" the cone
                            // Cone is at [0,0,0] in this group. 0 is the center.
                            // The opening is at +1.75. We want flowers to look like they are sitting in it.
                            const yPos = 1.2 + Math.random() * 0.4; // Lowered from 1.8 to 1.2

                            return (
                                <Flower
                                    key={`bouquet-${flower.id}`}
                                    position={[Math.sin(angle) * radius, yPos, Math.cos(angle) * radius]}
                                    rotation={[Math.random() * 0.2, -angle, 0]}
                                    color={flower.color}
                                    type={flower.type}
                                    scale={0.9} // Good size
                                    isPicked={true}
                                />
                            );
                        })}
                    </group>
                </Float>
            )}

            {/* 3D Text Instructions - Moved UP and forward for visibility */}
            <group position={[0, 4, 0]}>
                <Text
                    fontSize={isFinished ? 1.5 : 1.2}
                    color="#FF69B4" // Hot pink
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.05}
                    outlineColor="#FFF"
                >
                    {isFinished
                        ? "For You, Nandini Ji ❤️" // Explicit name request handled
                        : gatheredCount === 0
                            ? "Click flowers to select them"
                            : `${gatheredCount} / ${totalNeeded} selected`
                    }
                </Text>
            </group>
        </group>
    );
};


export const VirtualBouquet = () => {
    const { setScene } = useAppStore();
    const [selectedFlowers, setSelectedFlowers] = useState<number[]>([]);
    const [isCreated, setIsCreated] = useState(false); // Step 1: Bouquet Assembled
    const [isPresenting, setIsPresenting] = useState(false); // Step 2: Presented with Knot
    const totalNeeded = 7; // Increased to 7

    const handleSelect = (id: number) => {
        if (selectedFlowers.includes(id)) {
            setSelectedFlowers(prev => prev.filter(fid => fid !== id));
        } else {
            if (selectedFlowers.length >= totalNeeded) return; // Max limit 7
            setSelectedFlowers(prev => [...prev, id]);
        }
    };

    const handleCreateBouquet = () => {
        setIsCreated(true);
    };

    const handlePresentBouquet = () => {
        setIsPresenting(true);
    };

    const handleNext = () => {
        setScene('wish');
    };

    return (
        <div className="min-h-screen relative bg-gradient-to-b from-sky-200 to-green-100">
            {/* UI Overlay */}
            <div className="absolute top-8 left-0 right-0 z-10 text-center pointer-events-none">
                <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {isPresenting ? "A Gift of Love" : isCreated ? "Your Bouquet is Ready" : "Pick Your Favorites"}
                </h2>
                {!isCreated && (
                    <p className="text-xl text-green-900 font-medium bg-white/30 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
                        Tap flowers to add to your bouquet
                    </p>
                )}
            </div>

            {/* 3D Scene */}
            <div className="w-full h-full absolute inset-0">
                <Canvas shadows camera={{ position: [0, 8, 14], fov: 50 }}>
                    <Suspense fallback={null}>
                        <BouquetScene
                            gatheredCount={selectedFlowers.length}
                            totalNeeded={totalNeeded}
                            isFinished={isCreated && isPresenting}
                            onSelect={handleSelect}
                            selectedIds={selectedFlowers}
                        />
                        <OrbitControls
                            enableZoom={false}
                            minPolarAngle={Math.PI / 3}
                            maxPolarAngle={Math.PI / 2.2}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* Buttons - Bottom Center */}
            {!isCreated && selectedFlowers.length > 0 && (
                <div className="absolute bottom-12 left-0 right-0 z-20 text-center animate-fade-in flex justify-center">
                    <button
                        onClick={handleCreateBouquet}
                        disabled={selectedFlowers.length < totalNeeded}
                        className={`glass-effect px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-xl border-2 border-pink-300 ${selectedFlowers.length < totalNeeded
                            ? 'bg-gray-200/50 text-gray-500 cursor-not-allowed'
                            : 'bg-white/90 text-rose-900 hover:scale-110'
                            }`}
                    >
                        {selectedFlowers.length < totalNeeded
                            ? `Pick ${totalNeeded - selectedFlowers.length} more`
                            : `Create Bouquet 💐 (${selectedFlowers.length})`}
                    </button>
                </div>
            )}

            {isCreated && !isPresenting && (
                <div className="absolute bottom-12 left-0 right-0 z-20 text-center animate-fade-in flex justify-center">
                    <button
                        onClick={handlePresentBouquet}
                        className="glass-effect px-8 py-4 rounded-full text-xl font-bold text-rose-900 hover:scale-110 transition-all duration-300 flex items-center gap-2 mx-auto bg-white/90 shadow-xl border-2 border-pink-300"
                    >
                        Present Bouquet <Gift className="w-6 h-6" />
                    </button>
                </div>
            )}

            {isPresenting && (
                <div className="absolute bottom-12 left-0 right-0 z-20 text-center animate-fade-in flex justify-center">
                    <button
                        onClick={handleNext}
                        className="glass-effect px-8 py-4 rounded-full text-xl font-bold text-rose-900 hover:scale-110 transition-all duration-300 flex items-center gap-2 mx-auto bg-white/80"
                    >
                        Make a Wish <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};
