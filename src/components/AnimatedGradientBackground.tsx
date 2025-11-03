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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    const handleMouseClick = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: rippleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
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
