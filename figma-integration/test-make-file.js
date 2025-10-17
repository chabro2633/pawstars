#!/usr/bin/env node

/**
 * Figma Make 파일 테스트 스크립트
 * Make 파일의 특별한 구조를 분석합니다.
 */

require('dotenv').config({ path: './config.env' });
const FigmaMakeIntegration = require('./figma-make-api');

async function testMakeFile() {
  console.log('🎨 Pet Fortune App Make 파일 테스트를 시작합니다...\n');
  
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  
  if (!token || !fileKey) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  console.log('✅ 환경 변수 확인 완료');
  console.log(`📁 파일 키: ${fileKey.substring(0, 8)}...`);
  console.log(`🔑 토큰: ${token.substring(0, 12)}...\n`);
  
  try {
    const figmaMake = new FigmaMakeIntegration(token, fileKey);
    
    // Make 파일 분석 실행
    const report = await figmaMake.generateAnalysisReport();
    
    console.log('\n🎉 테스트 완료!');
    
    // 다음 단계 안내
    if (report.analysis.type === 'limited') {
      console.log('\n📋 Make 파일 한계로 인한 대안:');
      console.log('1. 🎨 수동 디자인 토큰 생성');
      console.log('2. 📸 스크린샷 기반 색상 추출');
      console.log('3. 🔄 일반 디자인 파일로 변환');
      
      // 수동 디자인 토큰 생성
      await generateManualTokens();
    } else {
      console.log('\n📋 다음 단계:');
      console.log('1. npm run generate-tokens');
      console.log('2. Make.com 시나리오 설정');
    }
    
  } catch (error) {
    console.error('\n❌ 테스트 실패:', error.message);
    
    // 대안 제시
    console.log('\n💡 대안:');
    console.log('1. Pet Fortune App을 일반 디자인 파일로 복사');
    console.log('2. 수동으로 디자인 토큰 정의');
    console.log('3. 기존 PawStars 스타일을 기반으로 토큰 생성');
    
    // 수동 토큰 생성 실행
    await generateManualTokens();
  }
}

/**
 * 수동 디자인 토큰 생성
 * Make 파일에서 직접 추출할 수 없을 때 사용
 */
async function generateManualTokens() {
  console.log('\n🎨 Pet Fortune App 기반 수동 디자인 토큰 생성 중...');
  
  const tokens = `/**
 * Pet Fortune App Design Tokens
 * Make 파일 기반으로 수동 생성된 디자인 토큰
 * 파일: Pet-Fortune-App-Prototype
 */

:root {
  /* 브랜드 색상 (PawStars 기반) */
  --color-brand-primary: #FFB347;     /* 따뜻한 오렌지 */
  --color-brand-secondary: #FFD700;   /* 별 노란색 */
  --color-brand-accent: #8B4513;      /* 강아지 갈색 */
  
  /* 배경 색상 */
  --color-background-primary: #000000;
  --color-background-surface: rgba(255, 255, 255, 0.05);
  --color-background-surface-hover: rgba(255, 255, 255, 0.1);
  --color-background-overlay: rgba(0, 0, 0, 0.8);
  
  /* 텍스트 색상 */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: rgba(255, 255, 255, 0.8);
  --color-text-muted: rgba(255, 255, 255, 0.6);
  --color-text-disabled: rgba(255, 255, 255, 0.4);
  
  /* 상태 색상 */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* 타이포그래피 */
  --font-family-primary: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: "SF Mono", Monaco, "Cascadia Code", monospace;
  
  /* 폰트 크기 */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 36px;
  
  /* 폰트 굵기 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 행간 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* 간격 시스템 */
  --spacing-0: 0px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  
  /* 둥근 모서리 */
  --border-radius-none: 0px;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-2xl: 24px;
  --border-radius-full: 9999px;
  
  /* 그림자 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* 애니메이션 */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
}

/* 컴포넌트별 스타일 */
.pet-fortune-card {
  background: var(--color-background-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  transition: var(--transition-normal);
}

.pet-fortune-card:hover {
  background: var(--color-background-surface-hover);
}

.pet-fortune-button {
  background: var(--color-brand-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-4) var(--spacing-6);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
}

.pet-fortune-button:hover {
  background: var(--color-brand-secondary);
}

.pet-fortune-input {
  background: var(--color-background-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-4);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

.pet-fortune-input:focus {
  border-color: var(--color-brand-primary);
  outline: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  :root {
    --font-size-3xl: 24px;
    --font-size-4xl: 30px;
    --spacing-6: 20px;
    --spacing-8: 24px;
  }
}`;

  const fs = require('fs');
  const path = require('path');
  
  // CSS 파일 저장
  const cssPath = path.join(__dirname, '../src/styles/pet-fortune-tokens.css');
  const cssDir = path.dirname(cssPath);
  
  // 디렉토리가 없으면 생성
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  fs.writeFileSync(cssPath, tokens, 'utf8');
  
  console.log(`✅ 수동 디자인 토큰 생성 완료!`);
  console.log(`📁 저장 위치: ${cssPath}`);
  
  // 사용 방법 안내
  console.log('\n📋 사용 방법:');
  console.log('1. globals.css에 import 추가:');
  console.log('   @import "./pet-fortune-tokens.css";');
  console.log('');
  console.log('2. 컴포넌트에서 CSS 변수 사용:');
  console.log('   background: var(--color-background-surface);');
  console.log('   color: var(--color-text-primary);');
  console.log('');
  console.log('3. 유틸리티 클래스 사용:');
  console.log('   <div className="pet-fortune-card">');
  console.log('   <button className="pet-fortune-button">');
}

// 실행
if (require.main === module) {
  testMakeFile();
}

module.exports = testMakeFile;

