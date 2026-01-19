import React, { useEffect, useState, memo } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const PARTICLE_COUNT = 8;

const CursorParticle = memo(({ index, mouseX, mouseY }: { index: number; mouseX: any; mouseY: any }) => {
  const size = 20 - index * 2;
  const opacity = 0.5 - index * 0.05;
  
  const springConfig = { damping: 20 + index * 5, stiffness: 200 - index * 10 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--primary)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: opacity,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(4px)',
      }}
    />
  );
});

export const CursorTrail = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {[...Array(PARTICLE_COUNT)].map((_, i) => (
        <CursorParticle key={i} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </>
  );
};
