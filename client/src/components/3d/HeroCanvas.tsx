import { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/usePerformance';

// Memoized particle field - Fix #4: Reduce particles on mobile
const ParticleField = memo(function ParticleField({ count }: { count: number }) {
    const ref = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        if (ref.current) {
            // Slower rotation for better performance
            ref.current.rotation.x = state.clock.elapsedTime * 0.01;
            ref.current.rotation.y = state.clock.elapsedTime * 0.015;
        }
    });

    return (
        <Points ref={ref} positions={particles} stride={3} frustumCulled>
            <PointMaterial
                transparent
                color="#8b5cf6"
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
});

// Memoized floating shape
const FloatingShape = memo(function FloatingShape({
    position,
    color
}: {
    position: [number, number, number];
    color: string
}) {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
            ref.current.rotation.x += 0.005;
            ref.current.rotation.y += 0.005;
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
                color={color}
                wireframe
                transparent
                opacity={0.4}
            />
        </mesh>
    );
});

export function HeroCanvas() {
    const isMobile = useIsMobile();
    const prefersReducedMotion = usePrefersReducedMotion();

    // Fix #4 & #6: Disable 3D on mobile or reduced motion
    if (isMobile || prefersReducedMotion) {
        return (
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--primary)]/5 to-transparent" />
        );
    }

    // Reduced particle count for better performance
    const particleCount = 1000;

    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                dpr={[1, 1.5]} // Cap DPR for performance
                gl={{
                    antialias: false, // Disable antialiasing for performance
                    powerPreference: 'high-performance'
                }}
                frameloop="demand" // Only render when needed
            >
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#8b5cf6" />

                <ParticleField count={particleCount} />

                {/* Reduced number of shapes */}
                <FloatingShape position={[-2, 1, -2]} color="#8b5cf6" />
                <FloatingShape position={[2, -1, -1]} color="#06b6d4" />
                <FloatingShape position={[0, 2, -3]} color="#f472b6" />
            </Canvas>
        </div>
    );
}
