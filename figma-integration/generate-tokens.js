#!/usr/bin/env node

/**
 * Figma 디자인 토큰을 CSS 변수로 변환하는 스크립트
 * Make.com에서 호출되어 자동으로 스타일을 업데이트
 */

const fs = require('fs');
const path = require('path');
const FigmaIntegration = require('./figma-api');

class DesignTokenGenerator {
  constructor(figmaToken, fileKey) {
    this.figma = new FigmaIntegration(figmaToken, fileKey);
    this.outputPath = path.join(__dirname, '../src/styles/figma-tokens.css');
  }

  /**
   * 메인 실행 함수
   */
  async generate() {
    try {
      console.log('🎨 Figma에서 디자인 토큰을 가져오는 중...');
      
      // Figma 파일 정보 가져오기
      const fileData = await this.figma.getFile();
      const styles = await this.figma.getStyles();
      
      // CSS 변수 생성
      const cssVariables = this.generateCSSVariables(styles.meta.styles);
      
      // 컴포넌트별 스타일 추출
      const componentStyles = this.extractComponentStyles(fileData.document);
      
      // CSS 파일 생성
      const cssContent = this.generateCSSFile(cssVariables, componentStyles);
      
      // 파일 저장
      fs.writeFileSync(this.outputPath, cssContent, 'utf8');
      
      console.log('✅ 디자인 토큰이 성공적으로 생성되었습니다!');
      console.log(`📁 저장 위치: ${this.outputPath}`);
      
      return {
        success: true,
        tokensCount: Object.keys(cssVariables).length,
        componentsCount: Object.keys(componentStyles).length
      };
      
    } catch (error) {
      console.error('❌ 디자인 토큰 생성 실패:', error);
      throw error;
    }
  }

  /**
   * CSS 변수 생성
   */
  generateCSSVariables(styles) {
    const variables = {};
    
    Object.values(styles).forEach(style => {
      const name = style.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      if (style.styleType === 'FILL') {
        // 색상 처리
        const fill = style.fills?.[0];
        if (fill?.type === 'SOLID') {
          const { r, g, b, a = 1 } = fill.color;
          variables[`--color-${name}`] = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        }
      } else if (style.styleType === 'TEXT') {
        // 텍스트 스타일 처리
        const textStyle = style.style;
        variables[`--font-${name}-size`] = `${textStyle.fontSize}px`;
        variables[`--font-${name}-weight`] = textStyle.fontWeight;
        variables[`--font-${name}-family`] = `"${textStyle.fontFamily}"`;
        
        if (textStyle.lineHeightPx) {
          variables[`--font-${name}-line-height`] = `${textStyle.lineHeightPx}px`;
        }
      } else if (style.styleType === 'EFFECT') {
        // 그림자 효과 처리
        const effect = style.effects?.[0];
        if (effect?.type === 'DROP_SHADOW') {
          const { r, g, b, a } = effect.color;
          variables[`--shadow-${name}`] = `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        }
      }
    });
    
    return variables;
  }

  /**
   * 컴포넌트별 스타일 추출
   */
  extractComponentStyles(document) {
    const componentStyles = {};
    
    const traverseNodes = (nodes) => {
      nodes.forEach(node => {
        if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
          const name = node.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          
          componentStyles[name] = {
            width: node.absoluteBoundingBox?.width,
            height: node.absoluteBoundingBox?.height,
            borderRadius: node.cornerRadius,
            padding: this.extractPadding(node),
            margin: this.extractMargin(node),
            backgroundColor: this.extractBackgroundColor(node),
            border: this.extractBorder(node)
          };
        }
        
        if (node.children) {
          traverseNodes(node.children);
        }
      });
    };
    
    traverseNodes(document.children);
    return componentStyles;
  }

  /**
   * CSS 파일 내용 생성
   */
  generateCSSFile(variables, componentStyles) {
    let css = `/**
 * PawStars Design Tokens
 * Figma에서 자동 생성된 디자인 토큰
 * 수정하지 마세요 - 자동으로 업데이트됩니다
 */

:root {
`;

    // CSS 변수 추가
    Object.entries(variables).forEach(([name, value]) => {
      css += `  ${name}: ${value};\n`;
    });

    css += `}\n\n`;

    // 컴포넌트 스타일 추가
    Object.entries(componentStyles).forEach(([name, styles]) => {
      css += `.figma-${name} {\n`;
      
      Object.entries(styles).forEach(([property, value]) => {
        if (value !== undefined && value !== null) {
          const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
          css += `  ${cssProperty}: ${value};\n`;
        }
      });
      
      css += `}\n\n`;
    });

    return css;
  }

  /**
   * 패딩 추출
   */
  extractPadding(node) {
    if (node.paddingLeft || node.paddingRight || node.paddingTop || node.paddingBottom) {
      return `${node.paddingTop || 0}px ${node.paddingRight || 0}px ${node.paddingBottom || 0}px ${node.paddingLeft || 0}px`;
    }
    return null;
  }

  /**
   * 마진 추출 (레이아웃 그리드 기반)
   */
  extractMargin(node) {
    // Figma의 Auto Layout 정보를 기반으로 마진 계산
    if (node.itemSpacing) {
      return `${node.itemSpacing}px`;
    }
    return null;
  }

  /**
   * 배경색 추출
   */
  extractBackgroundColor(node) {
    const fill = node.fills?.[0];
    if (fill?.type === 'SOLID') {
      const { r, g, b, a = 1 } = fill.color;
      return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
    }
    return null;
  }

  /**
   * 테두리 추출
   */
  extractBorder(node) {
    const stroke = node.strokes?.[0];
    if (stroke?.type === 'SOLID' && node.strokeWeight) {
      const { r, g, b, a = 1 } = stroke.color;
      return `${node.strokeWeight}px solid rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
    }
    return null;
  }
}

// CLI에서 실행될 때
if (require.main === module) {
  require('dotenv').config({ path: './config.env' });
  const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  
  if (!figmaToken || !fileKey) {
    console.error('❌ FIGMA_ACCESS_TOKEN과 FIGMA_FILE_KEY 환경변수가 필요합니다.');
    process.exit(1);
  }
  
  const generator = new DesignTokenGenerator(figmaToken, fileKey);
  generator.generate()
    .then(result => {
      console.log('📊 생성 결과:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 실행 실패:', error);
      process.exit(1);
    });
}

module.exports = DesignTokenGenerator;
