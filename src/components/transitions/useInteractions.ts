/**
 * Interaction Hooks
 * Figma Make 프로토타입의 인터랙션을 React 훅으로 구현
 */

import { useEffect, useRef, useState } from 'react';

// 호버 효과 훅
export const useHoverEffect = (effects: React.CSSProperties, duration = 200) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      transition: `all ${duration}ms ease`,
      ...(isHovered ? effects : {})
    }
  };
  
  return { isHovered, hoverProps };
};

// 클릭 효과 훅
export const useClickEffect = (effects: React.CSSProperties, duration = 150) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const clickProps = {
    onMouseDown: () => setIsClicked(true),
    onMouseUp: () => setIsClicked(false),
    onMouseLeave: () => setIsClicked(false),
    style: {
      transition: `all ${duration}ms ease`,
      ...(isClicked ? effects : {})
    }
  };
  
  return { isClicked, clickProps };
};

// 스크롤 스냅 훅
export const useScrollSnap = (direction: 'x' | 'y' = 'x') => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    
    element.style.scrollSnapType = `${direction} mandatory`;
    element.style.scrollBehavior = 'smooth';
    
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      (children[i] as HTMLElement).style.scrollSnapAlign = 'start';
    }
  }, [direction]);
  
  return scrollRef;
};

// 토글 애니메이션 훅
export const useToggleAnimation = (duration = 300) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleProps = {
    style: {
      maxHeight: isOpen ? '1000px' : '0',
      opacity: isOpen ? 1 : 0,
      overflow: 'hidden',
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
    }
  };
  
  const toggle = () => setIsOpen(!isOpen);
  
  return { isOpen, toggle, toggleProps };
};

// 로딩 상태 훅
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
    
    // 진행률 시뮬레이션
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 500);
  };
  
  return { isLoading, progress, startLoading };
};
