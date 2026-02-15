import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';

interface FlowerProps {
    position: [number, number, number];
    color: string;
    scale?: number;
    rotation?: [number, number, number];
    onClick?: () => void;
    isPicked?: boolean;
    type?: 'rose' | 'daisy' | 'tulip';
}

export const Flower = ({ position, color, scale = 1, rotation = [0, 0, 0], onClick, isPicked }: FlowerProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const stemRef = useRef<THREE.Mesh>(null);
    const flowerRef = useRef<THREE.Group>(null);

    // Randomize petal parameters slightly for uniqueness
    const petalCount = useMemo(() => Math.floor(Math.random() * 3) + 5, []); // 5-7 petals
    const petalAngle = (Math.PI * 2) / petalCount;

    useFrame((state) => {
        if (!groupRef.current) return;

        // Gentle wind animation
        const time = state.clock.getElapsedTime();
        if (!isPicked) {
            groupRef.current.rotation.z = rotation[2] + Math.sin(time * 2 + position[0]) * 0.05;
            groupRef.current.rotation.x = rotation[0] + Math.cos(time * 1.5 + position[1]) * 0.05;
        } else {
            // Bobbing animation when picked
            groupRef.current.position.y = position[1] + Math.sin(time * 3) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
            {/* Stem */}
            <mesh ref={stemRef} position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.05, 0.08, 3, 8]} />
                <meshStandardMaterial color="#4A7023" roughness={0.8} />
            </mesh>

            {/* Leaves */}
            <mesh position={[0.2, 1, 0]} rotation={[0, 0, -0.5]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="#5D8C3A" />
                <group scale={[2, 0.5, 1]} />
            </mesh>
            <mesh position={[-0.2, 1.8, 0]} rotation={[0, 0, 0.5]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color="#5D8C3A" />
                <group scale={[2, 0.5, 1]} />
            </mesh>

            {/* Bloom */}
            <group ref={flowerRef} position={[0, 3, 0]}>
                {/* Center */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.5} />
                </mesh>

                {/* Petals */}
                {Array.from({ length: petalCount }).map((_, i) => (
                    <mesh key={i} position={[0, 0, 0]} rotation={[0.5, i * petalAngle, 0]}>
                        {/* Petal shape: scaled sphere/cone */}
                        <group position={[0, 0.5, 0]}>
                            <sphereGeometry args={[0.3, 16, 16]} />
                            <meshStandardMaterial color={color} roughness={0.3} side={THREE.DoubleSide} />
                            <group scale={[1, 2.5, 0.2]} />
                        </group>
                    </mesh>
                ))}

                {/* Glow effect if picked */}
                {isPicked && <Sparkles count={10} scale={2} size={2} speed={0.4} opacity={0.5} color="#FFF" />}
            </group>
        </group>
    );
};
