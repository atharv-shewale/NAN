import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sparkles as DreiSparkles, Text } from '@react-three/drei';
// import { XR, ARButton, Interactive } from '@react-three/xr';
import { useAppStore } from '../../store/useAppStore';
import { useConfetti } from '../../hooks/useConfetti';
import * as THREE from 'three';
import { Cake, ArrowRight, Sparkles, Wind, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';
import cakeAudio from '../Audio/cake-cutting.mp3';

// Animated candle with realistic flame
const Candle = ({ position, isLit, onClick }: { position: [number, number, number]; isLit: boolean; onClick: () => void }) => {
    const flameRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (flameRef.current && isLit) {
            const time = state.clock.elapsedTime;
            flameRef.current.position.y = 0.4 + Math.sin(time * 5) * 0.03;
            flameRef.current.scale.set(
                1 + Math.sin(time * 3) * 0.15,
                1 + Math.sin(time * 4) * 0.2,
                1 + Math.sin(time * 3) * 0.15
            );
        }
        if (glowRef.current && isLit) {
            glowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
        }
    });

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            {/* Candle stick with stripes */}
            <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
                <meshStandardMaterial
                    color="#FFB3C1"
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>

            {/* Candle top */}
            <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.09, 0.08, 0.05, 16]} />
                <meshStandardMaterial color="#FFC2D1" />
            </mesh>

            {/* Flame - only show if lit */}
            {isLit && (
                <>
                    <mesh ref={flameRef} position={[0, 0.5, 0]}>
                        <sphereGeometry args={[0.12, 16, 16]} />
                        <meshStandardMaterial
                            color="#FFD700"
                            emissive="#FF6B00"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                    <pointLight ref={glowRef} position={[0, 0.5, 0]} color="#FF9AA2" intensity={1.5} distance={3} />
                </>
            )}

            {/* Smoke when blown out */}
            {!isLit && (
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial
                        color="#999999"
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            )}
        </group>
    );
};

// Realistic knife
const Knife = ({ visible, position }: { visible: boolean; position: [number, number, number] }) => {
    const knifeRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (knifeRef.current && visible) {
            knifeRef.current.rotation.z = -Math.PI / 4 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    if (!visible) return null;

    return (
        <group ref={knifeRef} position={position} rotation={[0, Math.PI / 6, -Math.PI / 4]}>
            {/* Blade with magical glow */}
            <mesh castShadow>
                <boxGeometry args={[0.08, 1.2, 0.02]} />
                <meshStandardMaterial
                    color="#F0F0F0"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#E6E6FA"
                    emissiveIntensity={0.2}
                />
            </mesh>
            {/* Magical aura light */}
            <pointLight position={[0, 0, 0]} color="#E6E6FA" intensity={0.5} distance={1} />

            {/* Blade edge */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.02, 1.2, 0.02]} />
                <meshStandardMaterial color="#FFFFFF" metalness={1} roughness={0} emissive="#FFF" emissiveIntensity={0.5} />
            </mesh>
            {/* Handle - gold/royal */}
            <mesh position={[0, -0.7, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
                <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Handle grip */}
            {[0, 0.1, -0.1].map((offset, i) => (
                <mesh key={i} position={[0, -0.7 + offset, 0]}>
                    <torusGeometry args={[0.07, 0.01, 8, 16]} />
                    <meshStandardMaterial color="#DAA520" metalness={0.8} />
                </mesh>
            ))}
        </group>
    );
};

// Plate with slice
const PlateWithSlice = ({ visible }: { visible: boolean }) => {
    const plateRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (visible && plateRef.current) {
            gsap.from(plateRef.current.position, {
                y: -5,
                duration: 1,
                ease: 'bounce.out'
            });
            gsap.from(plateRef.current.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <group ref={plateRef} position={[3.5, 0.1, 0]}>
            {/* Plate */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Plate rim */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
                <torusGeometry args={[0.75, 0.05, 16, 32]} />
                <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.5} />
            </mesh>

            {/* Cake slice - layered */}
            <group position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                {/* Bottom chocolate layer */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.5, 0.4, 0.6]} />
                    <meshStandardMaterial color="#8B4513" roughness={0.6} />
                </mesh>
                {/* Cream layer */}
                <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[0.5, 0.1, 0.6]} />
                    <meshStandardMaterial color="#FFFACD" roughness={0.3} />
                </mesh>
                {/* Middle vanilla layer */}
                <mesh position={[0, 0.7, 0]}>
                    <boxGeometry args={[0.5, 0.3, 0.6]} />
                    <meshStandardMaterial color="#FFF8DC" roughness={0.6} />
                </mesh>
                {/* Cream layer */}
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[0.5, 0.1, 0.6]} />
                    <meshStandardMaterial color="#FFE5D9" roughness={0.3} />
                </mesh>
                {/* Top strawberry layer */}
                <mesh position={[0, 1.3, 0]}>
                    <boxGeometry args={[0.5, 0.3, 0.6]} />
                    <meshStandardMaterial color="#FFB6C1" roughness={0.6} />
                </mesh>
                {/* Top frosting */}
                <mesh position={[0, 1.6, 0]}>
                    <boxGeometry args={[0.5, 0.1, 0.6]} />
                    <meshStandardMaterial color="#E8D5F2" roughness={0.2} />
                </mesh>

                {/* Strawberry on top */}
                <mesh position={[0, 1.8, 0]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="#FF0000" roughness={0.4} />
                </mesh>
            </group>

            {/* Fork */}
            <group position={[0.5, 0.05, 0.3]} rotation={[0, 0, 0]}>
                <mesh>
                    <boxGeometry args={[0.03, 0.6, 0.01]} />
                    <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
                </mesh>
                {[0, 0.05, -0.05].map((offset, i) => (
                    <mesh key={i} position={[offset, 0.35, 0]}>
                        <boxGeometry args={[0.015, 0.15, 0.01]} />
                        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
                    </mesh>
                ))}
            </group>
        </group>
    );
};

// Enhanced realistic cake with Music Box rotation
const RealisticCake = ({ candlesLit, onCandleClick, showKnife, isCut, userName }: {
    candlesLit: boolean[];
    onCandleClick: (index: number) => void;
    showKnife: boolean;
    isCut: boolean;
    userName: string;
}) => {
    const groupRef = useRef<THREE.Group>(null);

    // Music Box Rotation Effect
    useFrame((state) => {
        if (groupRef.current && !isCut) {
            // Rotate slowly, slow down as candles are blown
            const litCount = candlesLit.filter(l => l).length;
            const speed = 0.2 + (litCount * 0.1);
            groupRef.current.rotation.y += state.clock.getDelta() * speed * 0.5;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Bottom tier - chocolate with texture */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[2, 2, 1.2, 64]} />
                <meshStandardMaterial
                    color="#6B4423"
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Bottom frosting - wavy edge */}
            {[...Array(32)].map((_, i) => {
                const angle = (i / 32) * Math.PI * 2;
                const radius = 2.05;
                return (
                    <mesh
                        key={`wave-bottom-${i}`}
                        position={[Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius]}
                        rotation={[0, angle, 0]}
                    >
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshStandardMaterial color="#FFB3C1" roughness={0.3} />
                    </mesh>
                );
            })}

            {/* Middle tier - vanilla */}
            <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.5, 1.5, 1, 64]} />
                <meshStandardMaterial
                    color="#F5DEB3"
                    roughness={0.7}
                />
            </mesh>

            {/* Middle frosting waves */}
            {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const radius = 1.55;
                return (
                    <mesh
                        key={`wave-middle-${i}`}
                        position={[Math.cos(angle) * radius, 1.8, Math.sin(angle) * radius]}
                        rotation={[0, angle, 0]}
                    >
                        <sphereGeometry args={[0.07, 8, 8]} />
                        <meshStandardMaterial color="#FFE5D9" roughness={0.3} />
                    </mesh>
                );
            })}

            {/* Top tier - strawberry */}
            <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.1, 1.1, 0.8, 64]} />
                <meshStandardMaterial
                    color="#FFB6C1"
                    roughness={0.6}
                />
            </mesh>

            {/* Top frosting */}
            <mesh position={[0, 3.2, 0]} castShadow>
                <cylinderGeometry args={[1.15, 1.15, 0.15, 64]} />
                <meshStandardMaterial color="#E8D5F2" roughness={0.2} />
            </mesh>

            {/* Engraved Name on Top Tier (3rd Floor) */}
            <group position={[0, 2.8, 1.12]} rotation={[0, 0, 0]}>
                <Text
                    fontSize={0.25}
                    color="#FFD700"
                    anchorX="center"
                    anchorY="middle"
                    characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!&? "
                >
                    {userName}
                    <meshStandardMaterial attach="material" color="#FFD700" roughness={0.1} metalness={0.8} />
                </Text>
            </group>

            {/* Cake Topper */}
            <group position={[0, 4.2, -0.5]}>
                <Text
                    fontSize={0.35}
                    color="#FF1493"
                    anchorX="center"
                    anchorY="middle"

                    outlineWidth={0.02}
                    outlineColor="#FFFFFF"
                >
                    Happy Birthday
                </Text>
                {/* Topper sticks */}
                <mesh position={[-0.8, -0.6, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.2]} />
                    <meshStandardMaterial color="#FFF" />
                </mesh>
                <mesh position={[0.8, -0.6, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.2]} />
                    <meshStandardMaterial color="#FFF" />
                </mesh>
            </group>

            {/* Decorative roses around tiers */}
            {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 1.8;
                return (
                    <group key={`rose-bottom-${i}`} position={[Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius]}>
                        <mesh>
                            <sphereGeometry args={[0.12, 12, 12]} />
                            <meshStandardMaterial color="#FF1493" roughness={0.5} />
                        </mesh>
                        {/* Petals */}
                        {[0, 1, 2, 3].map((j) => {
                            const petalAngle = (j / 4) * Math.PI * 2;
                            return (
                                <mesh
                                    key={j}
                                    position={[Math.cos(petalAngle) * 0.08, 0, Math.sin(petalAngle) * 0.08]}
                                >
                                    <sphereGeometry args={[0.06, 8, 8]} />
                                    <meshStandardMaterial color="#FF69B4" roughness={0.4} />
                                </mesh>
                            );
                        })}
                    </group>
                );
            })}

            {/* Chocolate drips */}
            {[...Array(16)].map((_, i) => {
                const angle = (i / 16) * Math.PI * 2;
                const radius = 1.95;
                const dripLength = 0.3 + Math.random() * 0.2;
                return (
                    <mesh
                        key={`drip-${i}`}
                        position={[Math.cos(angle) * radius, 0.2 - dripLength / 2, Math.sin(angle) * radius]}
                    >
                        <cylinderGeometry args={[0.05, 0.02, dripLength, 8]} />
                        <meshStandardMaterial color="#8B4513" roughness={0.6} />
                    </mesh>
                );
            })}

            {/* Candles */}
            {candlesLit.map((isLit, i) => {
                const angle = (i / 5) * Math.PI * 2;
                const radius = 0.7;
                return (
                    <Candle
                        key={i}
                        position={[Math.cos(angle) * radius, 3.7, Math.sin(angle) * radius]}
                        isLit={isLit}
                        onClick={() => onCandleClick(i)}
                    />
                );
            })}

            {/* Sparkles around cake */}
            <DreiSparkles
                count={50}
                scale={[6, 6, 6]}
                size={2}
                speed={0.3}
                color="#FFB3C1"
            />

            {/* Knife */}
            <Knife visible={showKnife} position={[2.2, 2.5, 0]} />

            {/* Cut mark on cake */}
            {isCut && (
                <mesh position={[0.8, 1.5, 0]} rotation={[0, Math.PI / 6, 0]}>
                    <boxGeometry args={[0.05, 2, 1.5]} />
                    <meshStandardMaterial color="#4A4A4A" transparent opacity={0.3} />
                </mesh>
            )}
        </group>
    );
};

// Animated 3D Butterfly
const Butterfly = ({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const leftWingRef = useRef<THREE.Mesh>(null);
    const rightWingRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!groupRef.current || !leftWingRef.current || !rightWingRef.current) return;

        const time = state.clock.elapsedTime;

        // Fly up and around
        groupRef.current.position.y += 0.02;
        groupRef.current.position.x += Math.sin(time * 2 + delay) * 0.02;
        groupRef.current.position.z += Math.cos(time * 1.5 + delay) * 0.02;
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.5;

        // Flap wings
        const flap = Math.sin(time * 15);
        leftWingRef.current.rotation.z = flap * 0.5;
        rightWingRef.current.rotation.z = -flap * 0.5;
    });

    return (

        <group ref={groupRef} position={position} scale={[0.2, 0.2, 0.2]}>
            {/* Body */}
            <mesh>
                <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Wings */}
            <group>
                <mesh ref={leftWingRef} position={[-0.4, 0, 0]} rotation={[0, 0, 0.2]}>
                    <planeGeometry args={[0.8, 1]} />
                    <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
                </mesh>
                <mesh ref={rightWingRef} position={[0.4, 0, 0]} rotation={[0, 0, -0.2]}>
                    <planeGeometry args={[0.8, 1]} />
                    <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
                </mesh>
            </group>
        </group>
    );
};

// 3D Balloon Component
const Balloon = ({ position, color, delay = 0, scale = 1 }: { position: [number, number, number]; color: string; delay?: number; scale?: number }) => {
    const ref = useRef<THREE.Group>(null);
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);

    useFrame((state) => {
        if (!ref.current) return;
        const time = state.clock.elapsedTime;
        ref.current.position.y = position[1] + Math.sin(time + delay) * 0.2;
        ref.current.rotation.z = Math.sin(time * 0.5 + delay) * 0.1;
    });

    return (
        <group ref={ref} position={position} scale={[scale, scale, scale]}>
            <mesh geometry={geometry} castShadow>
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Knot */}
            <mesh position={[0, -0.55, 0]}>
                <coneGeometry args={[0.1, 0.1, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* String */}
            <mesh position={[0, -1.5, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 2, 8]} />
                <meshStandardMaterial color="#FFF" />
            </mesh>
        </group>
    );
};

// 3D Gift Box
const GiftBox = ({ position, color, size = 1, rotation = [0, 0, 0] }: { position: [number, number, number]; color: string; size?: number; rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation as [number, number, number]} scale={[size, size, size]}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
            {/* Ribbon - Vertical */}
            <mesh position={[0, 0, 0]} scale={[1.05, 1.05, 0.2]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#FFF" />
            </mesh>
            {/* Ribbon - Horizontal */}
            <mesh position={[0, 0, 0]} scale={[0.2, 1.05, 1.05]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#FFF" />
            </mesh>
            {/* Bow */}
            <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[0.15, 0.05, 8, 16]} />
                <meshStandardMaterial color="#FFF" />
            </mesh>
            <mesh position={[0, 0.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <torusGeometry args={[0.15, 0.05, 8, 16]} />
                <meshStandardMaterial color="#FFF" />
            </mesh>
        </group>
    );
};

// 3D Hanging Banner
const Banner = ({ position, color }: { position: [number, number, number]; color: string }) => {
    return (
        <group position={position}>
            {/* String */}
            <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 8, 8]} />
                <meshStandardMaterial color="#C0C0C0" />
            </mesh>
            {/* Flags */}
            {[...Array(7)].map((_, i) => (
                <mesh key={i} position={[(i - 3) * 1.1, 0, 0]} rotation={[0, 0, 0]}>
                    <planeGeometry args={[0.8, 1]} />
                    <meshStandardMaterial color={i % 2 === 0 ? color : "#FFF"} side={THREE.DoubleSide} />
                </mesh>
            ))}
        </group>
    );
};

// Helper to capture the scene
const SceneCapturer = ({ onCapture }: { onCapture: (dataUrl: string) => void }) => {
    const { gl, scene, camera } = useThree();
    useEffect(() => {
        // Render once to ensure latest frame
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL('image/png');
        onCapture(dataUrl);
    }, [gl, scene, camera, onCapture]);
    return null;
};

export const InteractiveCake = () => {
    const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
    const [allBlown, setAllBlown] = useState(false);
    const [isCut, setIsCut] = useState(false);
    const [showPlate, setShowPlate] = useState(false);
    const [twilightMode, setTwilightMode] = useState(false);
    const [butterflies, setButterflies] = useState<{ id: number; pos: [number, number, number]; color: string; delay: number }[]>([]);
    const [showPolaroid, setShowPolaroid] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const [cakeImage, setCakeImage] = useState<string | null>(null);
    const [captureTrigger, setCaptureTrigger] = useState(false);

    const { setScene, userName, selfieImage } = useAppStore();
    const { fire } = useConfetti();
    const sparklesContainerRef = useRef<HTMLDivElement>(null);

    // Fairy Wand Sparkle Effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sparklesContainerRef.current) return;

            if (Math.random() > 0.8) { // Don't create on every frame
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-trail';
                sparkle.style.left = `${e.clientX}px`;
                sparkle.style.top = `${e.clientY}px`;

                // Random slight offset
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

                sparklesContainerRef.current.appendChild(sparkle);

                // Remove after animation
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const audioRef = useRef(new Audio(cakeAudio));
    const [audioStarted, setAudioStarted] = useState(false);

    const handleCandleBlow = (index: number) => {
        if (!candlesLit[index]) return;

        // Trigger Twilight Ambience on first candle interaction
        if (!twilightMode) setTwilightMode(true);

        // Start audio on first blow
        if (!audioStarted) {
            audioRef.current.play().catch(e => console.log('Audio play failed', e));
            setAudioStarted(true);
        }

        const newCandlesLit = [...candlesLit];
        newCandlesLit[index] = false;
        setCandlesLit(newCandlesLit);

        // Small puff effect
        fire({ particleCount: 10, spread: 30, colors: ['#CCCCCC', '#FFFFFF'] });

        if (newCandlesLit.every(lit => !lit)) {
            setTimeout(() => {
                setAllBlown(true);
            }, 500);
        }
    };

    const handleCakeCut = () => {
        if (!allBlown || isCut) return;

        setIsCut(true);
        // Audio already playing from candle blow
        // fire({ particleCount: 60, spread: 70 }); // Replaced with Butterflies

        // Release Butterflies
        const newButterflies = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            pos: [(Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2] as [number, number, number],
            color: ['#FFB7B2', '#FF9AA2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'][Math.floor(Math.random() * 6)],
            delay: Math.random() * 2
        }));
        setButterflies(newButterflies);

        setTimeout(() => {
            setShowPlate(true);
        }, 800);
    };

    const capturePolaroid = () => {
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 500);
        // We use a small timeout to let the flash appear, then trigger the capture from the MAIN canvas
        // NOTE: The separate 'SceneCapturer' component solution above is for a *virtual* canvas. 
        // We actually want to capture the MAIN canvas.
        // So we will trigger a state that the Main Canvas listens to.
        setCaptureTrigger(true);
    };

    const handleNext = () => {
        setScene('bouquet');
    };

    const candlesRemaining = candlesLit.filter(lit => lit).length;

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center relative px-4 floral-bg cursor-wand ${twilightMode ? 'twilight-active' : ''}`}>
            {/* Sparkle Trail Container */}
            <div ref={sparklesContainerRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />



            {/* Scene Capturer Helper */}
            {captureTrigger && (
                <div className="absolute opacity-0 pointer-events-none">
                    <Canvas>
                        <SceneCapturer
                            onCapture={(dataUrl) => {
                                setCakeImage(dataUrl);
                                setCaptureTrigger(false);
                                setShowPolaroid(true);
                            }}
                        />
                    </Canvas>
                </div>
            )}

            {/* Flash Effect */}
            {flashActive && <div className="polaroid-flash flash-animation" />}

            {/* Polaroid Modal */}
            {showPolaroid && cakeImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4" onClick={() => setShowPolaroid(false)}>
                    <div
                        id="final-card"
                        className="bg-white p-6 pb-20 shadow-2xl transform rotate-2 transition-transform duration-300 scale-90 md:scale-100 max-w-lg w-full relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Main Cake Image */}
                        <div className="w-full aspect-square bg-gray-100 mb-4 overflow-hidden border-2 border-gray-100 relative">
                            <img src={cakeImage} alt="Birthday Cake" className="w-full h-full object-cover" />

                            {/* Selfie Overlay - Picture in Picture */}
                            {selfieImage && (
                                <div className="absolute bottom-4 right-4 w-1/3 aspect-video border-4 border-white shadow-lg transform -rotate-3 hover:scale-110 transition-transform">
                                    <img src={selfieImage} alt="You!" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="absolute top-4 left-4 text-white drop-shadow-md">
                                <span className="text-sm font-bold opacity-80">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            <h3 className="font-handwriting text-3xl md:text-4xl text-rose-600 font-bold mb-2" style={{ fontFamily: '"Indie Flower", cursive' }}>
                                Happy Birthday {userName}!
                            </h3>
                            <p className="text-gray-500 font-medium">Making memories... ✨</p>
                        </div>

                        {/* Action Buttons (Not part of download) */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-6 no-print">
                            <button
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition font-bold"
                                onClick={() => setShowPolaroid(false)}
                            >
                                Close
                            </button>
                            <button
                                className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                onClick={async () => {
                                    const element = document.getElementById('final-card');
                                    if (element) {
                                        // Temporarily hide buttons for capture
                                        const buttons = element.querySelector('.no-print');
                                        if (buttons) buttons.classList.add('hidden');

                                        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });

                                        if (buttons) buttons.classList.remove('hidden');

                                        const link = document.createElement('a');
                                        link.download = `Birthday-Memory-${userName}.png`;
                                        link.href = canvas.toDataURL();
                                        link.click();
                                    }
                                }}
                            >
                                Save Memory 📥
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-8 z-10 transition-colors duration-1000">
                <div className="flex justify-center gap-3 mb-4">
                    <Sparkles className={`w-12 h-12 animate-sparkle ${twilightMode ? 'text-yellow-200' : 'text-coral'}`} />
                    <Cake className={`w-12 h-12 ${twilightMode ? 'text-pink-300' : 'text-rose-blush'}`} />
                    <Sparkles className={`w-12 h-12 animate-sparkle ${twilightMode ? 'text-yellow-200' : 'text-coral'}`} />
                </div>

                <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-colors duration-1000 ${twilightMode ? 'text-white text-shadow-glow' : 'text-gradient'}`} style={{ fontFamily: '"Playfair Display", serif' }}>
                    {showPlate ? `A Slice Just For You! 💝` :
                        isCut ? `Happy Birthday ${userName}! 🎂` :
                            allBlown ? 'Time to Cut the Cake! 🔪' :
                                'Blow Out the Candles! 🕯️'}
                </h2>

                <p className={`text-xl font-medium transition-colors duration-1000 ${twilightMode ? 'text-pink-200' : 'text-rose-800'}`}>
                    {showPlate ? 'Enjoy your special birthday treat! 🍰' :
                        isCut ? 'Watch the magic happen... ✨' :
                            allBlown ? 'Click anywhere on the cake to cut it!' :
                                `${candlesRemaining} candle${candlesRemaining !== 1 ? 's' : ''} left - Click each flame! 💨`}
                </p>
            </div>

            {/* 3D Canvas */}
            <div className="relative w-full max-w-6xl">
                {/* Name overlay */}


                {/* "For You" message on plate */}
                {showPlate && (
                    <div className="absolute top-[35%] right-[15%] z-10 pointer-events-none animate-fade-in">
                        <div className="card px-6 py-3 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-coral fill-coral" />
                            <span className="text-2xl font-bold text-rose-900" style={{ fontFamily: '"Playfair Display", serif' }}>
                                For You
                            </span>
                            <Heart className="w-6 h-6 text-coral fill-coral" />
                        </div>
                    </div>
                )}

                {/* AR Button Removed for Debugging */}

                <div className={`w-full h-[650px] rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-1000 ${twilightMode ? 'border-purple-300 bg-opacity-10 bg-black' : 'border-rose-200 glass-effect'}`}>
                    <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
                        <PerspectiveCamera makeDefault position={[0, 5, 12]} />
                        <OrbitControls
                            enableZoom={true}
                            maxPolarAngle={Math.PI / 2.2}
                            minPolarAngle={Math.PI / 6}
                            maxDistance={18}
                            minDistance={8}
                            autoRotate={!allBlown}
                            autoRotateSpeed={0.5}
                        />

                        {/* Enhanced Lighting used for Twilight */}
                        <ambientLight intensity={twilightMode ? 0.2 : 0.6} />
                        <directionalLight
                            position={[8, 12, 8]}
                            intensity={twilightMode ? 0.5 : 1.5}
                            castShadow
                            shadow-mapSize-width={4096}
                            shadow-mapSize-height={4096}
                        />
                        <pointLight position={[0, 8, 0]} intensity={twilightMode ? 1.5 : 1} color="#FFB3C1" distance={10} />
                        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#E8D5F2" />
                        <spotLight
                            position={[0, 10, 0]}
                            angle={0.6}
                            penumbra={0.5}
                            intensity={twilightMode ? 2 : 1.2}
                            castShadow
                        />

                        {/* Cake */}
                        <group onClick={allBlown && !isCut ? handleCakeCut : undefined}>
                            <Suspense fallback={null}>
                                <RealisticCake
                                    candlesLit={candlesLit}
                                    onCandleClick={handleCandleBlow}
                                    showKnife={allBlown && !isCut}
                                    isCut={isCut}
                                    userName={userName}
                                />
                            </Suspense>
                        </group>

                        {/* Capture Helper */}
                        {captureTrigger && (
                            <SceneCapturer
                                onCapture={(dataUrl) => {
                                    setCakeImage(dataUrl);
                                    setCaptureTrigger(false);
                                    setShowPolaroid(true);
                                }}
                            />
                        )}

                        {/* Butterflies */}
                        {butterflies.map(b => (
                            <Butterfly key={b.id} position={b.pos} color={b.color} delay={b.delay} />
                        ))}

                        {/* Balloons - Gold & Silver Theme */}
                        <Balloon position={[-4, 3, -4]} color="#FFD700" delay={0} />
                        <Balloon position={[4, 4, -3]} color="#C0C0C0" delay={1} />
                        <Balloon position={[-5, 5, 2]} color="#E5E4E2" delay={2} />
                        <Balloon position={[5, 2, 4]} color="#FFD700" delay={1.5} />
                        <Balloon position={[0, 6, -5]} color="#FFF" delay={0.5} />

                        {/* Gift Boxes - Luxury */}
                        <GiftBox position={[-3, 0.5, 2]} color="#000" rotation={[0, 0.5, 0]} />
                        <GiftBox position={[3.5, 0.5, -2]} color="#FFD700" size={0.8} rotation={[0, -0.2, 0]} />
                        <GiftBox position={[-2.5, 0.4, 3]} color="#FFF" size={0.6} rotation={[0, 0.8, 0]} />

                        {/* Gold/Silver Confetti on table */}
                        {[...Array(50)].map((_, i) => (
                            <mesh key={i} position={[(Math.random() - 0.5) * 8, 0.02, (Math.random() - 0.5) * 8]} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
                                <planeGeometry args={[0.08, 0.15]} />
                                <meshStandardMaterial
                                    color={['#FFD700', '#C0C0C0', '#E5E4E2'][i % 3]}
                                    metalness={1}
                                    roughness={0.2}
                                />
                            </mesh>
                        ))}

                        {/* Hanging Banners */}
                        <Banner position={[0, 8, -5]} color="#FFD700" />
                        <Banner position={[-2, 9, -2]} color="#C0C0C0" />

                        {/* Plate with slice */}
                        <PlateWithSlice visible={showPlate} />

                        {/* Marble Table */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                            <planeGeometry args={[40, 40]} />
                            <meshStandardMaterial
                                color={twilightMode ? "#1a1a2e" : "#FFF"}
                                roughness={0.1}
                                metalness={0.1}
                            />
                        </mesh>

                        {/* Table cloth pattern */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                            <circleGeometry args={[8, 64]} />
                            <meshStandardMaterial
                                color={twilightMode ? "#301934" : "#FFE5D9"}
                                transparent
                                opacity={0.3}
                            />
                        </mesh>
                    </Canvas>
                </div>

                {/* Instructions */}
                {
                    !allBlown && !isCut && (
                        <div className="mt-8 card px-8 py-4 flex items-center gap-3 animate-bounce-soft max-w-2xl">
                            <Wind className="w-6 h-6 text-coral" />
                            <span className="text-rose-800 font-semibold text-lg">
                                Click on each glowing candle flame to blow it out! 🕯️ → 💨
                            </span>
                        </div>
                    )
                }

                {/* Buttons Container */}
                <div className="flex gap-4 mt-8">
                    {/* Capture Button */}
                    {showPlate && (
                        <button
                            onClick={capturePolaroid}
                            className="btn-secondary text-xl flex items-center gap-2 animate-fade-in bg-white/50"
                        >
                            Capture Moment 📸
                        </button>
                    )}

                    {/* Next button */}
                    {showPlate && (
                        <button
                            onClick={handleNext}
                            className="btn-primary text-xl flex items-center gap-2 animate-fade-in"
                        >
                            Make a Wish <ArrowRight className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Floating decorations - Minimalist/Elite */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 left-10 text-4xl animate-bounce-soft opacity-30">✨</div>
                    <div className="absolute top-20 right-20 text-4xl animate-bounce-soft opacity-30" style={{ animationDelay: '0.5s' }}>🥂</div>
                </div>
            </div>
        </div>
    );
};
