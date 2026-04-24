import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CursorTracker() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth spring configuration
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  
  // Create animated spring values
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      
      // Update spring targets
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track when hovering over interactive elements
    const updateHoverState = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', updateHoverState);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', updateHoverState);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Small instant dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_8px_rgba(0,242,255,0.8)]"
        style={{ 
          transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)`,
          transition: 'width 0.2s, height 0.2s',
          width: isHovering ? '4px' : '8px',
          height: isHovering ? '4px' : '8px'
        }}
      />
      
      {/* Smooth trailing ring */}
      <motion.div 
        className="fixed top-0 left-0 border border-cyan-400/50 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{ 
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          backgroundColor: isHovering ? 'rgba(0,242,255,0.1)' : 'transparent',
          boxShadow: isHovering ? '0 0 20px rgba(0,242,255,0.2)' : 'none'
        }}
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
    </>
  );
}
