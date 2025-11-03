import React, { useState, useEffect, useRef } from 'react';
import './AnimatedGradientBackground.css';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const AnimatedGradientBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);
  const timeoutIdsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse move updates using requestAnimationFrame
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth) * 100;
          const y = (e.clientY / window.innerHeight) * 100;
          setMousePosition({ x, y });
          rafIdRef.current = null;
        });
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: rippleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation completes, track timeout for cleanup
      const timeoutId = setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        timeoutIdsRef.current.delete(timeoutId);
      }, 1500);
      timeoutIdsRef.current.add(timeoutId);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      
      // Clean up pending timeouts
      timeoutIdsRef.current.forEach(id => clearTimeout(id));
      timeoutIdsRef.current.clear();
      
      // Clean up pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Calculate gradient colors based on mouse position
  const calculateGradient = () => {
    // Using a monochromatic blue palette
    const baseHue = 220; // Blue hue
    const saturation = 70;
    
    // Vary lightness based on mouse position
    const lightness1 = 15 + (mousePosition.x / 100) * 20; // 15-35%
    const lightness2 = 25 + (mousePosition.y / 100) * 25; // 25-50%
    const lightness3 = 20 + ((mousePosition.x + mousePosition.y) / 200) * 30; // 20-50%
    
    return `
      radial-gradient(
        circle at ${mousePosition.x}% ${mousePosition.y}%,
        hsl(${baseHue}, ${saturation}%, ${lightness1}%) 0%,
        hsl(${baseHue}, ${saturation - 10}%, ${lightness2}%) 40%,
        hsl(${baseHue}, ${saturation - 20}%, ${lightness3}%) 100%
      )
    `;
  };

  return (
    <>
      <div 
        className="animated-gradient-background"
        style={{
          background: calculateGradient(),
        }}
      />
      <div className="ripples-container">
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AnimatedGradientBackground;
