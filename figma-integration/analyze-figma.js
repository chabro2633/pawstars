#!/usr/bin/env node

/**
 * Pet Fortune App Figma 파일 분석 스크립트
 * 실제 디자인에서 색상, 폰트, 컴포넌트 정보를 추출합니다.
 */

require('dotenv').config({ path: './config.env' });
const FigmaIntegration = require('./figma-api');

async function analyzePetFortuneApp() {
  console.log('🔍 Pet Fortune App Figma 파일을 분석합니다...\n');
  
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY; // APgySq6qee47NY7veXPFE1
  
  if (!token) {
    console.error('❌ FIGMA_ACCESS_TOKEN이 필요합니다.');
    console.log('💡 Figma → Settings → Account → Personal access tokens에서 생성하세요.');
    process.exit(1);
  }
  
  console.log(`📁 분석할 파일: Pet-Fortune-App-Prototype`);
  console.log(`🔑 파일 키: ${fileKey}\n`);
  
  try {
    const figma = new FigmaIntegration(token, fileKey);
    
    // 1. 파일 기본 정보
    console.log('📋 파일 정보 가져오는 중...');
    const fileData = await figma.getFile();
    
    if (fileData.err) {
      throw new Error(`Figma API 오류: ${fileData.err}`);
    }
    
    console.log(`✅ 파일명: ${fileData.name}`);
    console.log(`📅 마지막 수정: ${new Date(fileData.lastModified).toLocaleString('ko-KR')}`);
    console.log(`📄 페이지 수: ${fileData.document.children.length}\n`);
    
    // 2. 페이지별 분석
    console.log('📱 페이지 구조:');
    fileData.document.children.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page.name} (${page.children?.length || 0}개 요소)`);
    });
    console.log('');
    
    // 3. 색상 분석
    console.log('🎨 색상 분석 중...');
    const colors = extractColors(fileData.document);
    console.log(`   발견된 색상: ${colors.length}개`);
    colors.slice(0, 10).forEach(color => {
      console.log(`   • ${color.hex} (사용 횟수: ${color.count})`);
    });
    if (colors.length > 10) {
      console.log(`   ... 그 외 ${colors.length - 10}개 색상`);
    }
    console.log('');
    
    // 4. 텍스트 스타일 분석
    console.log('📝 텍스트 스타일 분석 중...');
    const textStyles = extractTextStyles(fileData.document);
    console.log(`   발견된 텍스트 스타일: ${textStyles.length}개`);
    textStyles.slice(0, 5).forEach(style => {
      console.log(`   • ${style.fontFamily} ${style.fontSize}px (${style.fontWeight})`);
    });
    console.log('');
    
    // 5. 컴포넌트 분석
    console.log('🧩 컴포넌트 분석 중...');
    const components = extractComponents(fileData.document);
    console.log(`   발견된 컴포넌트: ${components.length}개`);
    components.forEach(comp => {
      console.log(`   • ${comp.name} (${comp.width}x${comp.height}px)`);
    });
    console.log('');
    
    // 6. CSS 변수 생성
    console.log('⚡ CSS 변수 생성 중...');
    const cssVariables = generateCSSFromAnalysis(colors, textStyles, components);
    
    // 7. CSS 파일 저장
    const fs = require('fs');
    const cssPath = '../src/styles/pet-fortune-tokens.css';
    fs.writeFileSync(cssPath, cssVariables, 'utf8');
    
    console.log(`✅ CSS 파일 생성 완료: ${cssPath}`);
    console.log('\n🎉 분석이 완료되었습니다!');
    console.log('\n📋 다음 단계:');
    console.log('1. 생성된 CSS 파일을 프로젝트에 import');
    console.log('2. Make.com 시나리오 설정');
    console.log('3. 자동 동기화 테스트');
    
  } catch (error) {
    console.error('\n❌ 분석 실패:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 해결 방법:');
      console.log('1. Figma Personal Access Token이 유효한지 확인');
      console.log('2. 파일에 대한 접근 권한이 있는지 확인');
      console.log('3. 파일이 공개 설정되어 있는지 확인');
    }
    
    process.exit(1);
  }
}

/**
 * 문서에서 색상 추출
 */
function extractColors(node, colors = new Map()) {
  if (node.fills) {
    node.fills.forEach(fill => {
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        const hex = rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
        const key = a < 1 ? `${hex}-${Math.round(a * 100)}` : hex;
        colors.set(key, (colors.get(key) || 0) + 1);
      }
    });
  }
  
  if (node.children) {
    node.children.forEach(child => extractColors(child, colors));
  }
  
  return Array.from(colors.entries())
    .map(([hex, count]) => ({ hex, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 텍스트 스타일 추출
 */
function extractTextStyles(node, styles = new Set()) {
  if (node.type === 'TEXT' && node.style) {
    const style = {
      fontFamily: node.style.fontFamily || 'Inter',
      fontSize: node.style.fontSize || 16,
      fontWeight: node.style.fontWeight || 400,
      lineHeight: node.style.lineHeightPx || node.style.fontSize * 1.2
    };
    styles.add(JSON.stringify(style));
  }
  
  if (node.children) {
    node.children.forEach(child => extractTextStyles(child, styles));
  }
  
  return Array.from(styles).map(s => JSON.parse(s));
}

/**
 * 컴포넌트 추출
 */
function extractComponents(node, components = []) {
  if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    components.push({
      name: node.name,
      width: node.absoluteBoundingBox?.width || 0,
      height: node.absoluteBoundingBox?.height || 0,
      type: node.type
    });
  }
  
  if (node.children) {
    node.children.forEach(child => extractComponents(child, components));
  }
  
  return components;
}

/**
 * RGB를 HEX로 변환
 */
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * 분석 결과를 CSS 변수로 변환
 */
function generateCSSFromAnalysis(colors, textStyles, components) {
  let css = `/**
 * Pet Fortune App Design Tokens
 * Figma에서 자동 추출된 디자인 토큰
 * 파일: Pet-Fortune-App-Prototype
 */

:root {
  /* 색상 팔레트 */
`;

  // 주요 색상들을 CSS 변수로 변환
  colors.slice(0, 20).forEach((color, index) => {
    const name = getColorName(color.hex, index);
    css += `  --color-${name}: ${color.hex};\n`;
  });

  css += `\n  /* 텍스트 스타일 */\n`;
  
  // 텍스트 스타일을 CSS 변수로 변환
  textStyles.forEach((style, index) => {
    const name = getTextStyleName(style, index);
    css += `  --font-${name}-family: "${style.fontFamily}";\n`;
    css += `  --font-${name}-size: ${style.fontSize}px;\n`;
    css += `  --font-${name}-weight: ${style.fontWeight};\n`;
    css += `  --font-${name}-line-height: ${style.lineHeight}px;\n`;
  });

  css += `\n  /* 컴포넌트 크기 */\n`;
  
  // 컴포넌트 크기를 CSS 변수로 변환
  components.forEach(comp => {
    const name = comp.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    css += `  --${name}-width: ${comp.width}px;\n`;
    css += `  --${name}-height: ${comp.height}px;\n`;
  });

  css += `}\n\n`;
  
  // 유틸리티 클래스 생성
  css += `/* 유틸리티 클래스 */\n`;
  colors.slice(0, 10).forEach((color, index) => {
    const name = getColorName(color.hex, index);
    css += `.bg-${name} { background-color: var(--color-${name}); }\n`;
    css += `.text-${name} { color: var(--color-${name}); }\n`;
  });

  return css;
}

/**
 * 색상 이름 생성
 */
function getColorName(hex, index) {
  const colorNames = {
    '#000000': 'black',
    '#ffffff': 'white',
    '#ff0000': 'red',
    '#00ff00': 'green',
    '#0000ff': 'blue',
    '#ffff00': 'yellow',
    '#ff00ff': 'magenta',
    '#00ffff': 'cyan'
  };
  
  return colorNames[hex.toLowerCase()] || `color-${index + 1}`;
}

/**
 * 텍스트 스타일 이름 생성
 */
function getTextStyleName(style, index) {
  if (style.fontSize >= 32) return 'heading-xl';
  if (style.fontSize >= 24) return 'heading-lg';
  if (style.fontSize >= 20) return 'heading-md';
  if (style.fontSize >= 18) return 'heading-sm';
  if (style.fontSize >= 16) return 'body-lg';
  if (style.fontSize >= 14) return 'body-md';
  return 'body-sm';
}

// 실행
if (require.main === module) {
  analyzePetFortuneApp();
}

module.exports = analyzePetFortuneApp;

