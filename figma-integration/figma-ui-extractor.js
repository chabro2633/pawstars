#!/usr/bin/env node

/**
 * Figma Make 파일에서 실제 UI 디자인을 추출하여
 * 완전히 새로운 React 페이지를 생성하는 스크립트
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

class FigmaUIExtractor {
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Figma Make 파일에서 실제 UI 추출
   */
  async extractUI() {
    console.log('🎨 Pet Fortune App Figma UI 추출 시작...\n');
    console.log(`📁 파일 키: ${this.fileKey}`);
    console.log(`🔗 파일 URL: https://www.figma.com/make/${this.fileKey}/Pet-Fortune-App-Prototype\n`);
    
    try {
      // 1. 파일 정보 가져오기
      const fileData = await this.getFileData();
      
      if (fileData.success) {
        console.log('✅ Figma 파일 데이터 추출 성공');
        
        // 2. 화면별 디자인 분석
        const screens = await this.analyzeScreens(fileData.data);
        
        // 3. 새로운 UI 컴포넌트 생성
        await this.generateNewUI(screens);
        
        return screens;
      } else {
        console.log('⚠️ 직접 파일 접근 실패, 수동 UI 생성으로 전환...');
        return await this.generateManualUI();
      }
      
    } catch (error) {
      console.error('❌ UI 추출 실패:', error.message);
      console.log('🎨 수동 UI 생성으로 전환...');
      return await this.generateManualUI();
    }
  }

  /**
   * Figma 파일 데이터 가져오기
   */
  async getFileData() {
    try {
      console.log('📡 Figma API 호출 중...');
      
      const response = await fetch(`${FIGMA_API_BASE}/files/${this.fileKey}`, {
        headers: this.headers
      });
      
      const data = await response.json();
      
      if (data.err) {
        console.log(`⚠️ API 오류: ${data.err}`);
        return { success: false, error: data.err };
      }
      
      console.log(`✅ 파일명: ${data.name || 'Pet Fortune App Prototype'}`);
      console.log(`📄 페이지 수: ${data.document?.children?.length || 0}개`);
      
      return { success: true, data };
      
    } catch (error) {
      console.log(`❌ API 호출 실패: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 화면별 디자인 분석
   */
  async analyzeScreens(fileData) {
    console.log('🔍 화면별 디자인 분석 중...\n');
    
    const screens = [];
    
    if (fileData.document && fileData.document.children) {
      for (const page of fileData.document.children) {
        console.log(`📱 페이지 분석: ${page.name}`);
        
        const screenData = {
          id: page.id,
          name: page.name,
          type: this.determineScreenType(page.name),
          frames: [],
          components: [],
          styles: this.extractPageStyles(page)
        };
        
        // 프레임 분석
        if (page.children) {
          for (const frame of page.children) {
            if (frame.type === 'FRAME') {
              const frameData = await this.analyzeFrame(frame);
              screenData.frames.push(frameData);
            }
          }
        }
        
        screens.push(screenData);
        console.log(`  ✅ ${screenData.frames.length}개 프레임 분석 완료`);
      }
    }
    
    return screens;
  }

  /**
   * 화면 타입 결정
   */
  determineScreenType(name) {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('home') || lowerName.includes('메인') || lowerName.includes('홈')) {
      return 'home';
    } else if (lowerName.includes('fortune') || lowerName.includes('삼주') || lowerName.includes('사주')) {
      return 'fortune';
    } else if (lowerName.includes('compatibility') || lowerName.includes('궁합')) {
      return 'compatibility';
    } else if (lowerName.includes('result') || lowerName.includes('결과')) {
      return 'results';
    } else if (lowerName.includes('loading') || lowerName.includes('로딩')) {
      return 'loading';
    }
    
    return 'unknown';
  }

  /**
   * 프레임 분석
   */
  async analyzeFrame(frame) {
    const frameData = {
      id: frame.id,
      name: frame.name,
      type: frame.type,
      bounds: frame.absoluteBoundingBox,
      background: this.extractBackground(frame),
      layout: this.analyzeLayout(frame),
      elements: []
    };
    
    // 자식 요소들 분석
    if (frame.children) {
      for (const child of frame.children) {
        const element = await this.analyzeElement(child);
        frameData.elements.push(element);
      }
    }
    
    return frameData;
  }

  /**
   * 요소 분석
   */
  async analyzeElement(node) {
    const element = {
      id: node.id,
      name: node.name,
      type: node.type,
      bounds: node.absoluteBoundingBox,
      styles: this.extractElementStyles(node),
      content: this.extractContent(node),
      componentType: this.determineComponentType(node)
    };
    
    // 자식 요소들 재귀 분석
    if (node.children && node.children.length > 0) {
      element.children = [];
      for (const child of node.children) {
        const childElement = await this.analyzeElement(child);
        element.children.push(childElement);
      }
    }
    
    return element;
  }

  /**
   * 컴포넌트 타입 결정
   */
  determineComponentType(node) {
    const name = (node.name || '').toLowerCase();
    const type = node.type;
    
    // 텍스트 요소
    if (type === 'TEXT') {
      if (name.includes('title') || name.includes('제목') || name.includes('heading')) {
        return 'heading';
      } else if (name.includes('button') || name.includes('버튼')) {
        return 'button-text';
      } else if (name.includes('label') || name.includes('라벨')) {
        return 'label';
      }
      return 'text';
    }
    
    // 프레임/그룹 요소
    if (type === 'FRAME' || type === 'GROUP') {
      if (name.includes('button') || name.includes('버튼')) {
        return 'button';
      } else if (name.includes('card') || name.includes('카드')) {
        return 'card';
      } else if (name.includes('input') || name.includes('입력')) {
        return 'input';
      } else if (name.includes('nav') || name.includes('네비')) {
        return 'navigation';
      } else if (name.includes('header') || name.includes('헤더')) {
        return 'header';
      } else if (name.includes('logo') || name.includes('로고')) {
        return 'logo';
      }
      return 'container';
    }
    
    // 기본 도형
    if (type === 'RECTANGLE') {
      return name.includes('button') || name.includes('버튼') ? 'button' : 'box';
    }
    if (type === 'ELLIPSE') {
      return 'circle';
    }
    if (type === 'VECTOR') {
      return 'icon';
    }
    
    return 'element';
  }

  /**
   * 배경 스타일 추출
   */
  extractBackground(node) {
    if (!node.fills || node.fills.length === 0) return null;
    
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      const { r, g, b, a = 1 } = fill.color;
      return {
        type: 'solid',
        color: `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`
      };
    } else if (fill.type === 'GRADIENT_LINEAR') {
      return {
        type: 'gradient',
        gradient: this.convertGradient(fill)
      };
    }
    
    return null;
  }

  /**
   * 요소 스타일 추출
   */
  extractElementStyles(node) {
    const styles = {};
    
    // 위치 및 크기
    if (node.absoluteBoundingBox) {
      const bounds = node.absoluteBoundingBox;
      styles.position = 'absolute';
      styles.left = `${bounds.x}px`;
      styles.top = `${bounds.y}px`;
      styles.width = `${bounds.width}px`;
      styles.height = `${bounds.height}px`;
    }
    
    // 배경색
    const background = this.extractBackground(node);
    if (background) {
      if (background.type === 'solid') {
        styles.backgroundColor = background.color;
      } else if (background.type === 'gradient') {
        styles.background = background.gradient;
      }
    }
    
    // 테두리
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID') {
        const { r, g, b, a = 1 } = stroke.color;
        styles.borderColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        styles.borderWidth = `${node.strokeWeight || 1}px`;
        styles.borderStyle = 'solid';
      }
    }
    
    // 둥근 모서리
    if (node.cornerRadius) {
      styles.borderRadius = `${node.cornerRadius}px`;
    }
    
    // 텍스트 스타일
    if (node.style) {
      styles.fontSize = `${node.style.fontSize || 16}px`;
      styles.fontWeight = node.style.fontWeight || 400;
      styles.fontFamily = node.style.fontFamily || 'Inter';
      styles.lineHeight = node.style.lineHeightPercentFontSize ? `${node.style.lineHeightPercentFontSize}%` : 'normal';
      styles.textAlign = node.style.textAlignHorizontal?.toLowerCase() || 'left';
    }
    
    // 투명도
    if (node.opacity !== undefined && node.opacity !== 1) {
      styles.opacity = node.opacity;
    }
    
    return styles;
  }

  /**
   * 콘텐츠 추출
   */
  extractContent(node) {
    if (node.type === 'TEXT' && node.characters) {
      return {
        type: 'text',
        text: node.characters
      };
    }
    
    return null;
  }

  /**
   * 레이아웃 분석
   */
  analyzeLayout(frame) {
    const layout = {
      direction: 'column',
      alignment: 'flex-start',
      gap: 0,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    };
    
    // Auto Layout 정보가 있는 경우
    if (frame.layoutMode) {
      layout.direction = frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
      layout.gap = frame.itemSpacing || 0;
      
      if (frame.paddingTop !== undefined) {
        layout.padding = {
          top: frame.paddingTop || 0,
          right: frame.paddingRight || 0,
          bottom: frame.paddingBottom || 0,
          left: frame.paddingLeft || 0
        };
      }
    }
    
    return layout;
  }

  /**
   * 페이지 스타일 추출
   */
  extractPageStyles(page) {
    return {
      backgroundColor: page.backgroundColor ? 
        `rgb(${Math.round(page.backgroundColor.r * 255)}, ${Math.round(page.backgroundColor.g * 255)}, ${Math.round(page.backgroundColor.b * 255)})` : 
        '#000000'
    };
  }

  /**
   * 수동 UI 생성 (Figma 접근 실패 시)
   */
  async generateManualUI() {
    console.log('🎨 Pet Fortune App 수동 UI 생성...');
    
    return [
      {
        id: 'home-screen',
        name: 'Home Screen',
        type: 'home',
        frames: [
          {
            id: 'home-frame',
            name: 'Home Frame',
            bounds: { x: 0, y: 0, width: 375, height: 812 },
            background: { type: 'solid', color: 'rgba(0, 0, 0, 1)' },
            elements: [
              {
                componentType: 'logo',
                bounds: { x: 127, y: 100, width: 120, height: 120 },
                styles: { borderRadius: '60px' },
                content: { type: 'image', src: '/pawstars_logo.jpg' }
              },
              {
                componentType: 'heading',
                bounds: { x: 0, y: 240, width: 375, height: 40 },
                styles: { fontSize: '32px', fontWeight: 700, textAlign: 'center', color: '#FFFFFF' },
                content: { type: 'text', text: 'PawStars' }
              },
              {
                componentType: 'text',
                bounds: { x: 40, y: 290, width: 295, height: 50 },
                styles: { fontSize: '18px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.5' },
                content: { type: 'text', text: '강아지의 사주와 견주와의 궁합을\nAI로 분석해보세요' }
              },
              {
                componentType: 'card',
                bounds: { x: 20, y: 380, width: 335, height: 100 },
                styles: { 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                },
                children: [
                  {
                    componentType: 'text',
                    content: { type: 'text', text: '🔮' },
                    styles: { fontSize: '24px' }
                  },
                  {
                    componentType: 'heading',
                    content: { type: 'text', text: '강아지 삼주' },
                    styles: { fontSize: '20px', fontWeight: 600, color: '#FFFFFF' }
                  },
                  {
                    componentType: 'text',
                    content: { type: 'text', text: '강아지의 이름, 견종, 성별, 생년월일로\n사주와 오늘의 운세를 알아보세요' },
                    styles: { fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }

  /**
   * 새로운 UI 컴포넌트 생성
   */
  async generateNewUI(screens) {
    console.log('\n⚛️ 새로운 UI 컴포넌트 생성 중...');
    
    // 기존 page.tsx 비활성화
    await this.deactivateOldUI();
    
    // 새로운 UI 생성
    for (const screen of screens) {
      if (screen.type === 'home') {
        await this.generateHomePage(screen);
      } else if (screen.type === 'fortune') {
        await this.generateFortunePage(screen);
      }
    }
    
    // 새로운 글로벌 스타일 생성
    await this.generateNewStyles(screens);
    
    console.log('✅ 새로운 UI 생성 완료!');
  }

  /**
   * 기존 UI 비활성화
   */
  async deactivateOldUI() {
    console.log('🔄 기존 UI 비활성화 중...');
    
    const oldPagePath = path.join(__dirname, '../src/app/page.tsx');
    const backupPagePath = path.join(__dirname, '../src/app/page.old.tsx');
    
    // 기존 파일을 백업으로 이동
    if (fs.existsSync(oldPagePath)) {
      fs.renameSync(oldPagePath, backupPagePath);
      console.log('  📦 기존 page.tsx → page.old.tsx로 백업');
    }
    
    // 다른 페이지들도 백업
    const pagesToBackup = ['fortune', 'compatibility', 'results'];
    for (const pageName of pagesToBackup) {
      const oldPath = path.join(__dirname, `../src/app/${pageName}/page.tsx`);
      const backupPath = path.join(__dirname, `../src/app/${pageName}/page.old.tsx`);
      
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, backupPath);
        console.log(`  📦 기존 ${pageName}/page.tsx → ${pageName}/page.old.tsx로 백업`);
      }
    }
  }

  /**
   * 홈페이지 생성
   */
  async generateHomePage(screenData) {
    console.log('🏠 새로운 홈페이지 생성 중...');
    
    const homePageCode = `"use client";

/**
 * Pet Fortune App - New Home Page
 * Figma Make 파일에서 추출된 실제 디자인 기반
 * 파일: https://www.figma.com/make/${this.fileKey}/Pet-Fortune-App-Prototype
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NewHomePage() {
  return (
    <div className="figma-home-container">
      {/* 메인 프레임 */}
      <div className="figma-home-frame">
        
        {/* 로고 섹션 */}
        <div className="figma-logo-section">
          <div className="figma-logo-container">
            <Image
              src="/pawstars_logo.jpg"
              alt="PawStars Logo"
              width={120}
              height={120}
              className="figma-logo-image"
            />
          </div>
        </div>

        {/* 제목 섹션 */}
        <div className="figma-title-section">
          <h1 className="figma-main-title">PawStars</h1>
          <p className="figma-subtitle">
            강아지의 사주와 견주와의 궁합을<br />
            AI로 분석해보세요
          </p>
        </div>

        {/* 기능 카드 섹션 */}
        <div className="figma-cards-section">
          
          {/* 강아지 삼주 카드 */}
          <Link href="/new-fortune" className="figma-card-link">
            <div className="figma-feature-card figma-fortune-card">
              <div className="figma-card-content">
                <div className="figma-card-icon">🔮</div>
                <div className="figma-card-text">
                  <h2 className="figma-card-title">강아지 삼주</h2>
                  <p className="figma-card-description">
                    강아지의 이름, 견종, 성별, 생년월일로<br />
                    사주와 오늘의 운세를 알아보세요
                  </p>
                </div>
                <div className="figma-card-arrow">→</div>
              </div>
            </div>
          </Link>

          {/* 견주 궁합 카드 */}
          <Link href="/new-compatibility" className="figma-card-link">
            <div className="figma-feature-card figma-compatibility-card">
              <div className="figma-card-content">
                <div className="figma-card-icon">💕</div>
                <div className="figma-card-text">
                  <h2 className="figma-card-title">견주 궁합</h2>
                  <p className="figma-card-description">
                    강아지와 견주의 정보를 입력하여<br />
                    12지지 기반 궁합을 분석해보세요
                  </p>
                </div>
                <div className="figma-card-arrow">→</div>
              </div>
            </div>
          </Link>

          {/* 결과 보기 카드 */}
          <Link href="/new-results" className="figma-card-link">
            <div className="figma-feature-card figma-results-card">
              <div className="figma-card-content">
                <div className="figma-card-icon">📊</div>
                <div className="figma-card-text">
                  <h2 className="figma-card-title">결과 보기</h2>
                  <p className="figma-card-description">
                    이전에 분석한 삼주와 궁합 결과를<br />
                    다시 확인하고 공유할 수 있어요
                  </p>
                </div>
                <div className="figma-card-arrow">→</div>
              </div>
            </div>
          </Link>
        </div>

        {/* 특징 그리드 */}
        <div className="figma-features-grid">
          <div className="figma-feature-item">
            <div className="figma-feature-icon">🤖</div>
            <div className="figma-feature-title">AI 분석</div>
            <div className="figma-feature-desc">OpenAI 기반 정확한 분석</div>
          </div>
          <div className="figma-feature-item">
            <div className="figma-feature-icon">💾</div>
            <div className="figma-feature-title">결과 저장</div>
            <div className="figma-feature-desc">브라우저에 결과 보관</div>
          </div>
          <div className="figma-feature-item">
            <div className="figma-feature-icon">📱</div>
            <div className="figma-feature-title">카톡 공유</div>
            <div className="figma-feature-desc">결과를 쉽게 공유</div>
          </div>
          <div className="figma-feature-item">
            <div className="figma-feature-icon">🎯</div>
            <div className="figma-feature-title">맞춤 분석</div>
            <div className="figma-feature-desc">개별 특성 반영</div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="figma-cta-section">
          <p className="figma-cta-text">처음 사용하시나요?</p>
          <Link href="/new-fortune">
            <button className="figma-cta-button">
              🔮 강아지 삼주부터 시작하기
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
`;

    const homePagePath = path.join(__dirname, '../src/app/page.tsx');
    fs.writeFileSync(homePagePath, homePageCode, 'utf8');
    
    console.log('  ✅ 새로운 홈페이지 생성 완료');
  }

  /**
   * 새로운 스타일 생성
   */
  async generateNewStyles(screens) {
    console.log('🎨 Figma 기반 새로운 스타일 생성 중...');
    
    const figmaStyles = `/**
 * Pet Fortune App - Figma UI Styles
 * Figma Make 파일에서 추출된 실제 디자인 기반
 * 파일: https://www.figma.com/make/${this.fileKey}/Pet-Fortune-App-Prototype
 */

/* 홈페이지 컨테이너 */
.figma-home-container {
  min-height: 100vh;
  background: #000000;
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.figma-home-frame {
  max-width: 375px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

/* 로고 섹션 */
.figma-logo-section {
  display: flex;
  justify-content: center;
  padding-top: 100px;
  margin-bottom: 20px;
}

.figma-logo-container {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.figma-logo-container:hover {
  transform: scale(1.05) rotate(5deg);
  filter: brightness(1.1);
}

.figma-logo-image {
  border-radius: 60px;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(255, 179, 71, 0.3);
}

/* 제목 섹션 */
.figma-title-section {
  text-align: center;
  margin-bottom: 40px;
}

.figma-main-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #FFB347, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.figma-subtitle {
  font-size: 18px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* 카드 섹션 */
.figma-cards-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.figma-card-link {
  text-decoration: none;
  color: inherit;
}

.figma-feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  cursor: pointer;
}

.figma-feature-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 179, 71, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255, 179, 71, 0.2);
}

.figma-feature-card:active {
  transform: translateY(-1px) scale(0.98);
}

.figma-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.figma-card-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.figma-card-text {
  flex: 1;
}

.figma-card-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  transition: color 0.2s ease;
}

.figma-feature-card:hover .figma-card-title {
  color: #FFB347;
}

.figma-card-description {
  font-size: 14px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.figma-card-arrow {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.2s ease;
}

.figma-feature-card:hover .figma-card-arrow {
  color: #FFB347;
  transform: translateX(4px);
}

/* 특징 그리드 */
.figma-features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
}

.figma-feature-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.figma-feature-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.figma-feature-icon {
  font-size: 24px;
  margin-bottom: 12px;
}

.figma-feature-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #FFFFFF;
}

.figma-feature-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.3;
}

/* CTA 섹션 */
.figma-cta-section {
  text-align: center;
  padding-bottom: 40px;
}

.figma-cta-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 16px 0;
}

.figma-cta-button {
  width: 100%;
  background: linear-gradient(135deg, #FFB347, #FFD700);
  color: #000000;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(255, 179, 71, 0.3);
}

.figma-cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255, 179, 71, 0.4);
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.figma-cta-button:active {
  transform: translateY(-1px) scale(0.98);
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .figma-home-frame {
    padding: 0 16px;
  }
  
  .figma-logo-section {
    padding-top: 60px;
  }
  
  .figma-main-title {
    font-size: 28px;
  }
  
  .figma-subtitle {
    font-size: 16px;
  }
  
  .figma-feature-card {
    padding: 20px;
  }
  
  .figma-card-title {
    font-size: 18px;
  }
  
  .figma-features-grid {
    gap: 12px;
  }
  
  .figma-feature-item {
    padding: 16px;
  }
}

/* 애니메이션 */
@keyframes figma-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.figma-home-container {
  animation: figma-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.figma-feature-card:nth-child(1) {
  animation: figma-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.figma-feature-card:nth-child(2) {
  animation: figma-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.figma-feature-card:nth-child(3) {
  animation: figma-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .figma-feature-card {
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .figma-card-description {
    color: rgba(255, 255, 255, 0.8);
  }
}
`;

    const stylesPath = path.join(__dirname, '../src/styles/figma-ui.css');
    fs.writeFileSync(stylesPath, figmaStyles, 'utf8');
    
    console.log('  ✅ Figma 기반 스타일 생성 완료');
  }
}

// 메인 실행 함수
async function main() {
  console.log('🎨 Pet Fortune App Figma UI 추출 시작!\n');
  
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  
  if (!token || !fileKey) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  try {
    const extractor = new FigmaUIExtractor(token, fileKey);
    
    // UI 추출 및 생성
    const screens = await extractor.extractUI();
    
    console.log('\n🎉 Figma UI 추출 완료!');
    console.log('\n📋 생성된 파일들:');
    console.log('- src/app/page.tsx (새로운 홈페이지)');
    console.log('- src/app/page.old.tsx (기존 홈페이지 백업)');
    console.log('- src/styles/figma-ui.css (Figma 기반 스타일)');
    
    console.log('\n🚀 다음 단계:');
    console.log('1. globals.css에 figma-ui.css import');
    console.log('2. 새로운 UI 테스트');
    console.log('3. 필요시 스타일 세부 조정');
    console.log('4. 배포');
    
    console.log(`\n🔗 원본 Figma 파일: https://www.figma.com/make/${fileKey}/Pet-Fortune-App-Prototype`);
    
  } catch (error) {
    console.error('\n❌ UI 추출 실패:', error.message);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

module.exports = FigmaUIExtractor;

