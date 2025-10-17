/**
 * Figma API 연동을 위한 설정
 * Figma 디자인 파일에서 컴포넌트와 스타일 정보를 추출
 */

const FIGMA_API_BASE = 'https://api.figma.com/v1';

// Node.js 환경에서 fetch 사용을 위한 설정
let fetch;
if (typeof window === 'undefined') {
  // Node.js 환경
  fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
} else {
  // 브라우저 환경
  fetch = window.fetch;
}

class FigmaIntegration {
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Figma 파일 정보 가져오기
   */
  async getFile() {
    try {
      const response = await fetch(`${FIGMA_API_BASE}/files/${this.fileKey}`, {
        headers: this.headers
      });
      return await response.json();
    } catch (error) {
      console.error('Figma 파일 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * 컴포넌트 정보 추출
   */
  async getComponents() {
    try {
      const response = await fetch(`${FIGMA_API_BASE}/files/${this.fileKey}/components`, {
        headers: this.headers
      });
      return await response.json();
    } catch (error) {
      console.error('컴포넌트 정보 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * 스타일 정보 추출 (색상, 폰트 등)
   */
  async getStyles() {
    try {
      const response = await fetch(`${FIGMA_API_BASE}/files/${this.fileKey}/styles`, {
        headers: this.headers
      });
      return await response.json();
    } catch (error) {
      console.error('스타일 정보 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * 이미지 URL 가져오기
   */
  async getImages(nodeIds) {
    try {
      const response = await fetch(
        `${FIGMA_API_BASE}/images/${this.fileKey}?ids=${nodeIds.join(',')}&format=png&scale=2`,
        { headers: this.headers }
      );
      return await response.json();
    } catch (error) {
      console.error('이미지 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * CSS 변수 생성
   */
  generateCSSVariables(styles) {
    const cssVars = {};
    
    styles.forEach(style => {
      if (style.styleType === 'FILL') {
        // 색상 스타일
        const color = style.fills?.[0];
        if (color && color.type === 'SOLID') {
          const { r, g, b, a = 1 } = color.color;
          cssVars[`--${style.name.toLowerCase().replace(/\s+/g, '-')}`] = 
            `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        }
      } else if (style.styleType === 'TEXT') {
        // 텍스트 스타일
        const textStyle = style.style;
        cssVars[`--font-${style.name.toLowerCase().replace(/\s+/g, '-')}-size`] = `${textStyle.fontSize}px`;
        cssVars[`--font-${style.name.toLowerCase().replace(/\s+/g, '-')}-weight`] = textStyle.fontWeight;
        cssVars[`--font-${style.name.toLowerCase().replace(/\s+/g, '-')}-family`] = textStyle.fontFamily;
      }
    });

    return cssVars;
  }

  /**
   * React 컴포넌트 템플릿 생성
   */
  generateReactComponent(componentData) {
    const { name, description, properties } = componentData;
    
    return `
import React from 'react';

interface ${name}Props {
  ${properties.map(prop => `${prop.name}?: ${prop.type};`).join('\n  ')}
}

/**
 * ${description || name}
 * Figma에서 자동 생성된 컴포넌트
 */
export const ${name}: React.FC<${name}Props> = ({
  ${properties.map(prop => prop.name).join(',\n  ')}
}) => {
  return (
    <div className="${name.toLowerCase()}">
      {/* 컴포넌트 내용 */}
    </div>
  );
};

export default ${name};
    `.trim();
  }
}

module.exports = FigmaIntegration;
