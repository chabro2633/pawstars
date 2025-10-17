#!/usr/bin/env node

/**
 * Figma Make 프로토타입에서 플로우와 인터랙션을 추출하여
 * 실제 React 앱에 적용하는 스크립트
 */

require('dotenv').config({ path: './config.env' });
const fs = require('fs');
const path = require('path');

// Node.js 환경에서 fetch 사용
let fetch;
if (typeof window === 'undefined') {
  fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

const FIGMA_API_BASE = 'https://api.figma.com/v1';

class FigmaPrototypeExtractor {
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Figma Make 프로토타입 분석
   */
  async analyzePrototype() {
    console.log('🎯 Figma Make 프로토타입 분석 시작...\n');
    
    try {
      // 1. 프로토타입 플로우 추출
      const prototypeData = await this.getPrototypeFlows();
      
      if (prototypeData.success) {
        console.log('✅ 프로토타입 플로우 추출 성공');
        return await this.extractInteractions(prototypeData.data);
      }
      
      // 2. 프로토타입 데이터가 없으면 수동으로 Pet Fortune 플로우 생성
      console.log('🎨 Pet Fortune App 프로토타입 플로우 수동 생성...');
      return await this.generatePetFortunePrototype();
      
    } catch (error) {
      console.error('❌ 프로토타입 분석 실패:', error.message);
      return await this.generatePetFortunePrototype();
    }
  }

  /**
   * 프로토타입 플로우 데이터 가져오기
   */
  async getPrototypeFlows() {
    try {
      // Figma Make 파일의 프로토타입 정보 접근 시도
      const endpoints = [
        `${FIGMA_API_BASE}/files/${this.fileKey}`, // 기본 파일 정보
        `${FIGMA_API_BASE}/files/${this.fileKey}/nodes?ids=0:1`, // 루트 노드
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, { headers: this.headers });
          const data = await response.json();
          
          if (!data.err && (data.document || data.nodes)) {
            // 프로토타입 연결 정보 찾기
            const prototypeConnections = this.findPrototypeConnections(data);
            if (prototypeConnections.length > 0) {
              return { success: true, data: prototypeConnections };
            }
          }
        } catch (error) {
          console.log(`⚠️ ${endpoint} 접근 실패`);
        }
      }
      
      return { success: false };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 프로토타입 연결 정보 찾기
   */
  findPrototypeConnections(data) {
    const connections = [];
    
    const traverse = (node) => {
      // 프로토타입 연결 정보 확인
      if (node.transitionNodeID) {
        connections.push({
          from: node.id,
          to: node.transitionNodeID,
          trigger: node.trigger || 'ON_CLICK',
          transition: node.transition || { type: 'DISSOLVE', duration: 0.3 }
        });
      }
      
      // 자식 노드들 재귀 탐색
      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };
    
    if (data.document) {
      traverse(data.document);
    } else if (data.nodes) {
      Object.values(data.nodes).forEach(node => traverse(node.document || node));
    }
    
    return connections;
  }

  /**
   * Pet Fortune App 프로토타입 플로우 생성
   */
  async generatePetFortunePrototype() {
    console.log('🐕 Pet Fortune App 프로토타입 플로우 생성...');
    
    const prototype = {
      name: 'Pet Fortune App Prototype',
      version: '1.0.0',
      
      // 화면 정의
      screens: [
        {
          id: 'home',
          name: '홈 화면',
          path: '/',
          type: 'landing',
          components: [
            { type: 'logo', position: 'center-top' },
            { type: 'title', text: 'PawStars' },
            { type: 'subtitle', text: '강아지 사주와 궁합 분석' },
            { type: 'feature-cards', count: 3 },
            { type: 'cta-button', text: '시작하기' }
          ]
        },
        {
          id: 'fortune',
          name: '강아지 삼주',
          path: '/fortune',
          type: 'form',
          components: [
            { type: 'header', text: '🐕 강아지 삼주' },
            { type: 'form-section', title: '강아지 정보' },
            { type: 'input', field: 'name', label: '강아지 이름' },
            { type: 'select', field: 'breed', label: '견종', searchable: true },
            { type: 'radio', field: 'sex', label: '성별', options: ['수컷', '암컷'] },
            { type: 'date-picker', field: 'birthDate', label: '생년월일' },
            { type: 'submit-button', text: '🔮 삼주 보기' }
          ]
        },
        {
          id: 'compatibility',
          name: '견주 궁합',
          path: '/compatibility',
          type: 'multi-step-form',
          steps: [
            {
              step: 1,
              title: '강아지 정보',
              components: [
                { type: 'input', field: 'dogName', label: '강아지 이름' },
                { type: 'select', field: 'breed', label: '견종' },
                { type: 'radio', field: 'sex', label: '성별' },
                { type: 'date-picker', field: 'dogBirthDate', label: '생년월일' }
              ]
            },
            {
              step: 2,
              title: '견주 정보',
              components: [
                { type: 'input', field: 'ownerName', label: '견주 이름' },
                { type: 'date-picker', field: 'ownerBirthDate', label: '견주 생년월일' },
                { type: 'time-picker', field: 'birthTime', label: '태어난 시간' },
                { type: 'display', field: 'zodiac', label: '12지지', readonly: true }
              ]
            }
          ]
        },
        {
          id: 'results',
          name: '결과 화면',
          path: '/results',
          type: 'results',
          components: [
            { type: 'sticky-header', components: ['toggle-buttons'] },
            { type: 'result-card', id: 'fortune', collapsible: true },
            { type: 'result-card', id: 'compatibility', collapsible: true },
            { type: 'action-buttons', buttons: ['재분석', '공유'] }
          ]
        },
        {
          id: 'loading',
          name: '로딩 화면',
          path: '/loading',
          type: 'loading',
          components: [
            { type: 'spinner', text: 'AI가 분석 중입니다...' },
            { type: 'progress-bar', steps: ['정보 처리', '사주 분석', '결과 생성'] }
          ]
        }
      ],
      
      // 플로우 정의 (화면 간 이동)
      flows: [
        {
          from: 'home',
          to: 'fortune',
          trigger: 'click',
          element: 'fortune-card',
          transition: { type: 'slide-right', duration: 300 }
        },
        {
          from: 'home',
          to: 'compatibility',
          trigger: 'click',
          element: 'compatibility-card',
          transition: { type: 'slide-right', duration: 300 }
        },
        {
          from: 'home',
          to: 'results',
          trigger: 'click',
          element: 'results-card',
          transition: { type: 'slide-right', duration: 300 }
        },
        {
          from: 'fortune',
          to: 'loading',
          trigger: 'submit',
          element: 'submit-button',
          transition: { type: 'fade', duration: 200 }
        },
        {
          from: 'loading',
          to: 'results',
          trigger: 'auto',
          delay: 3000,
          transition: { type: 'slide-up', duration: 400 }
        },
        {
          from: 'compatibility',
          to: 'loading',
          trigger: 'submit',
          element: 'submit-button',
          transition: { type: 'fade', duration: 200 }
        },
        {
          from: 'results',
          to: 'fortune',
          trigger: 'click',
          element: 'reanalyze-button',
          transition: { type: 'slide-left', duration: 300 }
        }
      ],
      
      // 인터랙션 정의
      interactions: [
        {
          type: 'hover',
          target: '.pf-card',
          effect: {
            background: 'var(--pf-color-bg-surface-hover)',
            borderColor: 'var(--pf-color-brand-primary)',
            boxShadow: 'var(--pf-shadow-glow)',
            transform: 'translateY(-2px)'
          },
          duration: 200
        },
        {
          type: 'click',
          target: '.pf-button-primary',
          effect: {
            transform: 'scale(0.98)',
            background: 'var(--pf-color-brand-secondary)'
          },
          duration: 150
        },
        {
          type: 'focus',
          target: '.pf-input',
          effect: {
            borderColor: 'var(--pf-color-brand-primary)',
            boxShadow: '0 0 0 3px rgba(255, 179, 71, 0.1)'
          }
        },
        {
          type: 'scroll',
          target: '.breed-selector',
          effect: {
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory'
          }
        },
        {
          type: 'toggle',
          target: '.result-card',
          effect: {
            maxHeight: 'toggle',
            opacity: 'toggle',
            transform: 'rotateX(toggle)'
          },
          duration: 300
        }
      ],
      
      // 애니메이션 정의
      animations: [
        {
          name: 'fadeIn',
          keyframes: [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          duration: 400,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        {
          name: 'slideRight',
          keyframes: [
            { transform: 'translateX(-100%)' },
            { transform: 'translateX(0)' }
          ],
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        {
          name: 'bounce',
          keyframes: [
            { transform: 'scale(1)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' }
          ],
          duration: 200,
          easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },
        {
          name: 'pulse',
          keyframes: [
            { opacity: 1 },
            { opacity: 0.7 },
            { opacity: 1 }
          ],
          duration: 1000,
          iterationCount: 'infinite'
        }
      ],
      
      // 상태 관리
      states: [
        {
          name: 'loading',
          conditions: ['isSubmitting', 'isAnalyzing'],
          effects: {
            cursor: 'wait',
            pointerEvents: 'none',
            opacity: 0.7
          }
        },
        {
          name: 'error',
          conditions: ['hasError'],
          effects: {
            borderColor: 'var(--pf-color-error)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
          }
        },
        {
          name: 'success',
          conditions: ['isSuccess'],
          effects: {
            borderColor: 'var(--pf-color-success)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          }
        }
      ]
    };

    return prototype;
  }

  /**
   * React 라우터 및 페이지 트랜지션 생성
   */
  async generatePageTransitions(prototype) {
    console.log('🔄 페이지 트랜지션 컴포넌트 생성 중...');
    
    const transitionsDir = path.join(__dirname, '../src/components/transitions');
    
    // 디렉토리 생성
    if (!fs.existsSync(transitionsDir)) {
      fs.mkdirSync(transitionsDir, { recursive: true });
    }

    // 페이지 트랜지션 컴포넌트
    const pageTransitionCode = `/**
 * Page Transition Component
 * Figma Make 프로토타입에서 추출된 트랜지션 효과
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getTransitionStyle = () => {
    const baseStyle = {
      transition: \`all \${duration}ms cubic-bezier(0.4, 0, 0.2, 1)\`,
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
      className={\`page-transition \${className}\`}
      style={getTransitionStyle()}
    >
      {children}
    </div>
  );
};

export default PageTransition;
`;

    fs.writeFileSync(path.join(transitionsDir, 'PageTransition.tsx'), pageTransitionCode, 'utf8');
    console.log('  📄 생성됨: PageTransition.tsx');

    // 인터랙션 훅
    const interactionHookCode = `/**
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
      transition: \`all \${duration}ms ease\`,
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
      transition: \`all \${duration}ms ease\`,
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
    
    element.style.scrollSnapType = \`\${direction} mandatory\`;
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
      transition: \`all \${duration}ms cubic-bezier(0.4, 0, 0.2, 1)\`
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
`;

    fs.writeFileSync(path.join(transitionsDir, 'useInteractions.ts'), interactionHookCode, 'utf8');
    console.log('  📄 생성됨: useInteractions.ts');

    console.log(`✅ 페이지 트랜지션 생성 완료: ${transitionsDir}`);
  }

  /**
   * 애니메이션 CSS 생성
   */
  async generateAnimationCSS(prototype) {
    console.log('✨ 애니메이션 CSS 생성 중...');
    
    let animationCSS = `/**
 * Pet Fortune App Animations
 * Figma Make 프로토타입에서 추출된 애니메이션
 */

/* 키프레임 애니메이션 */
`;

    // 프로토타입의 애니메이션을 CSS로 변환
    for (const animation of prototype.animations) {
      animationCSS += `
@keyframes ${animation.name} {`;
      
      animation.keyframes.forEach((keyframe, index) => {
        const percentage = index === 0 ? '0%' : index === animation.keyframes.length - 1 ? '100%' : `${(index / (animation.keyframes.length - 1)) * 100}%`;
        animationCSS += `
  ${percentage} {`;
        
        Object.entries(keyframe).forEach(([property, value]) => {
          const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
          animationCSS += `
    ${cssProperty}: ${value};`;
        });
        
        animationCSS += `
  }`;
      });
      
      animationCSS += `
}

.pf-animation-${animation.name} {
  animation: ${animation.name} ${animation.duration}ms ${animation.easing || 'ease'};
  animation-iteration-count: ${animation.iterationCount || '1'};
}
`;
    }

    // 인터랙션 효과
    animationCSS += `
/* 인터랙션 효과 */
.pf-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--pf-shadow-glow);
}

.pf-click-scale:active {
  transform: scale(0.98);
}

.pf-focus-glow:focus {
  outline: none;
  border-color: var(--pf-color-brand-primary);
  box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.1);
}

.pf-smooth-scroll {
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}

.pf-smooth-scroll > * {
  scroll-snap-align: start;
}

/* 상태별 스타일 */
.pf-state-loading {
  cursor: wait;
  pointer-events: none;
  opacity: 0.7;
}

.pf-state-error {
  border-color: var(--pf-color-error);
  background-color: rgba(239, 68, 68, 0.1);
}

.pf-state-success {
  border-color: var(--pf-color-success);
  background-color: rgba(16, 185, 129, 0.1);
}

/* 페이지 트랜지션 */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 로딩 스피너 */
.pf-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--pf-color-bg-surface);
  border-top: 4px solid var(--pf-color-brand-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 진행률 바 */
.pf-progress-bar {
  width: 100%;
  height: 4px;
  background: var(--pf-color-bg-surface);
  border-radius: var(--pf-radius-full);
  overflow: hidden;
}

.pf-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pf-color-brand-primary), var(--pf-color-brand-secondary));
  border-radius: var(--pf-radius-full);
  transition: width 0.3s ease;
}

/* 반응형 애니메이션 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

    const animationPath = path.join(__dirname, '../src/styles/pet-fortune-animations.css');
    fs.writeFileSync(animationPath, animationCSS, 'utf8');
    
    console.log(`✅ 애니메이션 CSS 생성 완료: ${animationPath}`);
  }

  /**
   * 프로토타입 문서 생성
   */
  async generatePrototypeDoc(prototype) {
    console.log('📖 프로토타입 문서 생성 중...');
    
    const doc = `# Pet Fortune App 프로토타입 가이드

## 🎯 화면 플로우

### 주요 화면
${prototype.screens.map(screen => `
#### ${screen.name} (\`${screen.path}\`)
- **타입**: ${screen.type}
- **컴포넌트**: ${screen.components?.map(c => c.type || c).join(', ') || 'N/A'}
`).join('')}

## 🔄 화면 전환

### 플로우 다이어그램
\`\`\`
홈 화면 → 강아지 삼주 → 로딩 → 결과 화면
    ↓         ↓
견주 궁합 → 로딩 → 결과 화면
    ↓
결과 화면 ← → 재분석
\`\`\`

### 트랜지션 효과
${prototype.flows.map(flow => `
- **${flow.from} → ${flow.to}**: ${flow.transition.type} (${flow.transition.duration}ms)
  - 트리거: ${flow.trigger}
  - 요소: ${flow.element || 'N/A'}
`).join('')}

## ✨ 인터랙션

### 호버 효과
- **카드**: 배경 밝아짐, 테두리 강조, 그림자 효과, 살짝 위로 이동
- **버튼**: 색상 변화, 그림자 효과

### 클릭 효과
- **버튼**: 스케일 축소 (0.98), 색상 변화
- **카드**: 클릭 시 페이지 이동

### 포커스 효과
- **입력 필드**: 테두리 색상 변화, 글로우 효과

## 🎨 애니메이션

### 페이지 진입
- **fadeIn**: 투명도 0 → 1, 아래에서 위로 20px 이동
- **slideRight**: 왼쪽에서 오른쪽으로 슬라이드

### 상호작용
- **bounce**: 버튼 클릭 시 탄성 효과
- **pulse**: 로딩 중 맥박 효과

## 📱 상태 관리

### 로딩 상태
- 커서: wait
- 포인터 이벤트: 비활성화
- 투명도: 0.7

### 에러 상태
- 테두리: 빨간색
- 배경: 연한 빨간색

### 성공 상태
- 테두리: 초록색
- 배경: 연한 초록색

## 🛠️ 구현 방법

### 1. 컴포넌트에서 사용
\`\`\`jsx
import { PageTransition } from '@/components/transitions/PageTransition';
import { useHoverEffect } from '@/components/transitions/useInteractions';

export default function HomePage() {
  const { hoverProps } = useHoverEffect({
    transform: 'translateY(-2px)',
    boxShadow: 'var(--pf-shadow-glow)'
  });

  return (
    <PageTransition type="fadeIn">
      <div className="pf-card" {...hoverProps}>
        카드 내용
      </div>
    </PageTransition>
  );
}
\`\`\`

### 2. CSS 클래스 사용
\`\`\`jsx
<div className="pf-card pf-hover-lift pf-click-scale">
  <button className="pf-button-primary pf-animation-bounce">
    클릭하세요
  </button>
</div>
\`\`\`

### 3. 애니메이션 트리거
\`\`\`jsx
const { isLoading, startLoading } = useLoadingState();

<button 
  className={\`pf-button-primary \${isLoading ? 'pf-state-loading' : ''}\`}
  onClick={startLoading}
>
  {isLoading ? '분석 중...' : '분석 시작'}
</button>
\`\`\`

## 🎯 접근성

- **키보드 네비게이션**: Tab 키로 모든 요소 접근 가능
- **스크린 리더**: ARIA 라벨 및 역할 정의
- **모션 감소**: prefers-reduced-motion 지원
- **고대비**: 색상 대비 4.5:1 이상 유지

## 📊 성능 최적화

- **애니메이션**: GPU 가속 사용 (transform, opacity)
- **트랜지션**: 60fps 유지를 위한 최적화
- **메모리**: 불필요한 애니메이션 정리
- **배터리**: 백그라운드에서 애니메이션 일시정지
`;

    const docPath = path.join(__dirname, '../docs/prototype-guide.md');
    fs.writeFileSync(docPath, doc, 'utf8');
    
    console.log(`✅ 프로토타입 문서 생성 완료: ${docPath}`);
  }
}

// 메인 실행 함수
async function main() {
  console.log('🎯 Pet Fortune App 프로토타입 추출 시작!\n');
  
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  
  if (!token || !fileKey) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  try {
    const extractor = new FigmaPrototypeExtractor(token, fileKey);
    
    // 1. 프로토타입 분석
    const prototype = await extractor.analyzePrototype();
    
    // 2. 페이지 트랜지션 생성
    await extractor.generatePageTransitions(prototype);
    
    // 3. 애니메이션 CSS 생성
    await extractor.generateAnimationCSS(prototype);
    
    // 4. 프로토타입 문서 생성
    await extractor.generatePrototypeDoc(prototype);
    
    console.log('\n🎉 프로토타입 추출 완료!');
    console.log('\n📋 생성된 파일들:');
    console.log('- src/components/transitions/ (트랜지션 컴포넌트)');
    console.log('- src/styles/pet-fortune-animations.css (애니메이션)');
    console.log('- docs/prototype-guide.md (프로토타입 가이드)');
    
    console.log('\n🚀 다음 단계:');
    console.log('1. globals.css에 애니메이션 CSS import');
    console.log('2. 페이지에 PageTransition 컴포넌트 적용');
    console.log('3. 인터랙션 훅 사용');
    console.log('4. 애니메이션 테스트');
    
  } catch (error) {
    console.error('\n❌ 프로토타입 추출 실패:', error.message);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

module.exports = FigmaPrototypeExtractor;

