/**
 * Page Transition Component
 * Figma Make 프로토타입에서 추출된 트랜지션 효과
 */

import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'slide-right' | 'slide-left' | 'slide-up' | 'fade' | 'dissolve';
  duration?: number;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getTransitionStyle = () => {
    const baseStyle = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      opacity: isVisible ? 1 : 0,
    };

    switch (type) {
      case 'slide-right':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
        };
      case 'slide-left':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        };
      case 'slide-up':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        };
      case 'dissolve':
        return {
          ...baseStyle,
          filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div 
      className={`page-transition ${className}`}
      style={getTransitionStyle()}
    >
      {children}
    </div>
  );
};

export default PageTransition;
