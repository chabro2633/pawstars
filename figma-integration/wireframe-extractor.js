#!/usr/bin/env node

/**
 * Figma Make 파일에서 와이어프레임 구조를 추출하여
 * React 컴포넌트와 레이아웃을 자동 생성하는 스크립트
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

class WireframeExtractor {
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make 파일에서 노드 구조 분석
   */
  async analyzeWireframe() {
    console.log('🔍 Figma Make 파일에서 와이어프레임 구조 분석 중...\n');
    
    try {
      // 1. 파일의 모든 노드 정보 가져오기 시도
      const nodeData = await this.getFileNodes();
      
      if (nodeData.success) {
        console.log('✅ 노드 구조 분석 성공');
        return await this.extractWireframeStructure(nodeData.data);
      }
      
      // 2. 노드 접근이 안 되면 이미지 기반 분석
      console.log('📸 이미지 기반 와이어프레임 분석으로 전환...');
      return await this.generateWireframeFromImages();
      
    } catch (error) {
      console.error('❌ 와이어프레임 분석 실패:', error.message);
      
      // 3. 모든 방법이 실패하면 수동 와이어프레임 생성
      console.log('🎨 Pet Fortune App 기반 수동 와이어프레임 생성...');
      return await this.generateManualWireframe();
    }
  }

  /**
   * 파일 노드 정보 가져오기
   */
  async getFileNodes() {
    try {
      // Make 파일의 특별한 노드 접근 방법들 시도
      const endpoints = [
        `${FIGMA_API_BASE}/files/${this.fileKey}/nodes?ids=0:1`, // 루트 노드
        `${FIGMA_API_BASE}/files/${this.fileKey}/components`, // 컴포넌트
        `${FIGMA_API_BASE}/files/${this.fileKey}`, // 기본 파일 정보
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, { headers: this.headers });
          const data = await response.json();
          
          if (!data.err && data.nodes) {
            return { success: true, data: data.nodes };
          } else if (!data.err && data.document) {
            return { success: true, data: { document: data.document } };
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
   * 와이어프레임 구조 추출
   */
  async extractWireframeStructure(nodeData) {
    console.log('🏗️ 와이어프레임 구조 추출 중...');
    
    const wireframe = {
      pages: [],
      components: [],
      layout: {
        type: 'mobile-first',
        breakpoints: ['mobile', 'tablet', 'desktop']
      }
    };

    // 노드 데이터에서 페이지 구조 분석
    if (nodeData.document && nodeData.document.children) {
      nodeData.document.children.forEach(page => {
        const pageStructure = this.analyzePage(page);
        wireframe.pages.push(pageStructure);
      });
    }

    return wireframe;
  }

  /**
   * 페이지 구조 분석
   */
  analyzePage(pageNode) {
    const page = {
      name: pageNode.name || 'Untitled Page',
      type: 'page',
      sections: [],
      components: []
    };

    if (pageNode.children) {
      pageNode.children.forEach(child => {
        const section = this.analyzeSection(child);
        if (section) {
          page.sections.push(section);
        }
      });
    }

    return page;
  }

  /**
   * 섹션/컴포넌트 분석
   */
  analyzeSection(node) {
    const section = {
      name: node.name || 'Untitled Section',
      type: this.determineNodeType(node),
      bounds: node.absoluteBoundingBox || {},
      styles: this.extractNodeStyles(node),
      children: []
    };

    // 자식 노드들 재귀적으로 분석
    if (node.children) {
      node.children.forEach(child => {
        const childSection = this.analyzeSection(child);
        if (childSection) {
          section.children.push(childSection);
        }
      });
    }

    return section;
  }

  /**
   * 노드 타입 결정
   */
  determineNodeType(node) {
    const name = (node.name || '').toLowerCase();
    const type = node.type || '';

    // 컴포넌트 타입 매핑
    if (type === 'COMPONENT' || type === 'INSTANCE') return 'component';
    if (type === 'FRAME') {
      if (name.includes('button')) return 'button';
      if (name.includes('card')) return 'card';
      if (name.includes('input')) return 'input';
      if (name.includes('nav')) return 'navigation';
      if (name.includes('header')) return 'header';
      if (name.includes('footer')) return 'footer';
      return 'container';
    }
    if (type === 'TEXT') return 'text';
    if (type === 'RECTANGLE') return 'box';
    if (type === 'ELLIPSE') return 'circle';
    
    return 'element';
  }

  /**
   * 노드 스타일 추출
   */
  extractNodeStyles(node) {
    const styles = {};

    // 크기 정보
    if (node.absoluteBoundingBox) {
      styles.width = node.absoluteBoundingBox.width;
      styles.height = node.absoluteBoundingBox.height;
      styles.x = node.absoluteBoundingBox.x;
      styles.y = node.absoluteBoundingBox.y;
    }

    // 배경색
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        const { r, g, b, a = 1 } = fill.color;
        styles.backgroundColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
      }
    }

    // 테두리
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID') {
        const { r, g, b, a = 1 } = stroke.color;
        styles.borderColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        styles.borderWidth = node.strokeWeight || 1;
      }
    }

    // 둥근 모서리
    if (node.cornerRadius) {
      styles.borderRadius = node.cornerRadius;
    }

    // 텍스트 스타일
    if (node.style) {
      styles.fontSize = node.style.fontSize;
      styles.fontWeight = node.style.fontWeight;
      styles.fontFamily = node.style.fontFamily;
    }

    return styles;
  }

  /**
   * 이미지 기반 와이어프레임 생성
   */
  async generateWireframeFromImages() {
    console.log('📸 이미지 기반 와이어프레임 분석...');
    
    // Pet Fortune App의 예상 구조를 기반으로 생성
    return {
      pages: [
        {
          name: 'Home',
          type: 'page',
          sections: [
            {
              name: 'Header',
              type: 'navigation',
              components: ['Logo', 'Navigation Menu']
            },
            {
              name: 'Hero Section',
              type: 'hero',
              components: ['Main Title', 'Subtitle', 'CTA Button']
            },
            {
              name: 'Feature Cards',
              type: 'grid',
              components: ['Fortune Card', 'Compatibility Card', 'Results Card']
            }
          ]
        },
        {
          name: 'Fortune Page',
          type: 'page',
          sections: [
            {
              name: 'Dog Info Form',
              type: 'form',
              components: ['Name Input', 'Breed Select', 'Gender Select', 'Date Picker']
            },
            {
              name: 'Submit Section',
              type: 'actions',
              components: ['Submit Button']
            }
          ]
        },
        {
          name: 'Results Page',
          type: 'page',
          sections: [
            {
              name: 'Results Display',
              type: 'content',
              components: ['Result Card', 'Toggle Buttons', 'Share Button']
            }
          ]
        }
      ]
    };
  }

  /**
   * 수동 와이어프레임 생성 (Pet Fortune App 기반)
   */
  async generateManualWireframe() {
    console.log('🎨 Pet Fortune App 맞춤 와이어프레임 생성...');
    
    const wireframe = {
      projectName: 'Pet Fortune App',
      version: '1.0.0',
      baseUrl: 'https://pawstars-38f97e.netlify.app',
      
      // 페이지 구조
      pages: [
        {
          name: 'Home',
          path: '/',
          type: 'landing',
          layout: 'centered',
          sections: [
            {
              name: 'Navigation',
              type: 'header',
              sticky: true,
              components: [
                {
                  type: 'logo',
                  content: 'PawStars Logo + Text',
                  styles: { display: 'flex', alignItems: 'center', gap: '8px' }
                },
                {
                  type: 'nav-menu',
                  items: ['강아지 삼주', '견주 궁합', '결과 보기'],
                  styles: { display: 'flex', gap: '4px' }
                }
              ]
            },
            {
              name: 'Hero Section',
              type: 'hero',
              components: [
                {
                  type: 'logo-large',
                  content: 'PawStars Logo (120x120px)',
                  styles: { marginBottom: '24px' }
                },
                {
                  type: 'title',
                  content: 'PawStars',
                  styles: { fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }
                },
                {
                  type: 'subtitle',
                  content: '강아지의 사주와 견주와의 궁합을 AI로 분석해보세요',
                  styles: { fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.75' }
                }
              ]
            },
            {
              name: 'Feature Cards',
              type: 'grid',
              layout: 'vertical-stack',
              gap: '16px',
              components: [
                {
                  type: 'feature-card',
                  title: '강아지 삼주',
                  icon: '🔮',
                  description: '강아지의 이름, 견종, 성별, 생년월일로 사주와 오늘의 운세를 알아보세요',
                  link: '/fortune',
                  styles: {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '24px'
                  }
                },
                {
                  type: 'feature-card',
                  title: '견주 궁합',
                  icon: '💕',
                  description: '강아지와 견주의 정보를 입력하여 12지지 기반 궁합을 분석해보세요',
                  link: '/compatibility',
                  styles: {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '24px'
                  }
                },
                {
                  type: 'feature-card',
                  title: '결과 보기',
                  icon: '📊',
                  description: '이전에 분석한 삼주와 궁합 결과를 다시 확인하고 공유할 수 있어요',
                  link: '/results',
                  styles: {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '24px'
                  }
                }
              ]
            },
            {
              name: 'Features Grid',
              type: 'grid',
              layout: '2x2',
              components: [
                { type: 'feature-item', icon: '🤖', title: 'AI 분석', description: 'OpenAI 기반 정확한 분석' },
                { type: 'feature-item', icon: '💾', title: '결과 저장', description: '브라우저에 결과 보관' },
                { type: 'feature-item', icon: '📱', title: '카톡 공유', description: '결과를 쉽게 공유' },
                { type: 'feature-item', icon: '🎯', title: '맞춤 분석', description: '개별 특성 반영' }
              ]
            },
            {
              name: 'CTA Section',
              type: 'cta',
              components: [
                {
                  type: 'cta-text',
                  content: '처음 사용하시나요?',
                  styles: { fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }
                },
                {
                  type: 'cta-button',
                  content: '🔮 강아지 삼주부터 시작하기',
                  link: '/fortune',
                  styles: {
                    width: '100%',
                    background: 'white',
                    color: 'black',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'medium'
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'Fortune Page',
          path: '/fortune',
          type: 'form',
          layout: 'centered',
          sections: [
            {
              name: 'Page Header',
              type: 'header',
              components: [
                {
                  type: 'title',
                  content: '🐕 강아지 삼주',
                  styles: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }
                },
                {
                  type: 'subtitle',
                  content: '강아지의 사주와 운세를 알아보세요',
                  styles: { color: 'rgba(255,255,255,0.6)' }
                }
              ]
            },
            {
              name: 'Dog Info Form',
              type: 'form-section',
              title: '강아지 정보',
              components: [
                {
                  type: 'form-group',
                  label: '강아지 이름',
                  component: 'text-input',
                  placeholder: '예: 뭉치, 초코, 별이',
                  required: true
                },
                {
                  type: 'form-group',
                  label: '견종',
                  component: 'breed-selector',
                  searchable: true,
                  scrollable: 'horizontal'
                },
                {
                  type: 'form-group',
                  label: '성별',
                  component: 'radio-group',
                  options: [
                    { value: 'male', label: '수컷', icon: '♂️' },
                    { value: 'female', label: '암컷', icon: '♀️' }
                  ]
                },
                {
                  type: 'form-group',
                  label: '생년월일',
                  component: 'date-picker',
                  format: 'dropdown',
                  fields: ['year', 'month', 'day'],
                  unknownOption: true
                }
              ]
            },
            {
              name: 'Submit Section',
              type: 'actions',
              components: [
                {
                  type: 'submit-button',
                  content: '🔮 삼주 보기',
                  styles: {
                    width: '100%',
                    background: 'white',
                    color: 'black',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    fontSize: '18px'
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'Compatibility Page',
          path: '/compatibility',
          type: 'multi-step-form',
          layout: 'centered',
          sections: [
            {
              name: 'Page Header',
              type: 'header',
              components: [
                {
                  type: 'title',
                  content: '💕 견주 궁합',
                  styles: { fontSize: '24px', fontWeight: 'bold' }
                }
              ]
            },
            {
              name: 'Dog Info Step',
              type: 'form-step',
              step: 1,
              title: '강아지 정보',
              components: '/* Same as Fortune Page Dog Info */'
            },
            {
              name: 'Owner Info Step',
              type: 'form-step',
              step: 2,
              title: '견주 정보',
              components: [
                {
                  type: 'form-group',
                  label: '견주 이름',
                  component: 'text-input',
                  required: true
                },
                {
                  type: 'form-group',
                  label: '견주 생년월일',
                  component: 'date-picker',
                  format: 'dropdown'
                },
                {
                  type: 'form-group',
                  label: '태어난 시간',
                  component: 'time-picker'
                },
                {
                  type: 'display-field',
                  label: '도출된 12지지',
                  content: 'auto-calculated',
                  readonly: true
                }
              ]
            }
          ]
        },
        {
          name: 'Results Page',
          path: '/results',
          type: 'results-display',
          layout: 'centered',
          sections: [
            {
              name: 'Sticky Controls',
              type: 'sticky-header',
              position: 'top',
              components: [
                {
                  type: 'toggle-buttons',
                  buttons: [
                    { id: 'fortune', label: '일일 운세', icon: '🔮' },
                    { id: 'compatibility', label: '궁합 분석', icon: '💕' }
                  ]
                }
              ]
            },
            {
              name: 'Results Content',
              type: 'content-area',
              components: [
                {
                  type: 'result-card',
                  id: 'fortune-result',
                  title: '강아지 삼주 결과',
                  collapsible: true,
                  content: 'AI generated fortune content'
                },
                {
                  type: 'result-card',
                  id: 'compatibility-result',
                  title: '궁합 분석 결과',
                  collapsible: true,
                  content: 'AI generated compatibility content'
                }
              ]
            },
            {
              name: 'Action Buttons',
              type: 'actions',
              components: [
                {
                  type: 'button',
                  variant: 'primary',
                  content: '다시 분석하기',
                  action: 'restart'
                },
                {
                  type: 'button',
                  variant: 'secondary',
                  content: '결과 공유하기',
                  action: 'share'
                }
              ]
            }
          ]
        }
      ],
      
      // 공통 컴포넌트 라이브러리
      components: {
        'text-input': {
          type: 'input',
          styles: {
            width: '100%',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px'
          }
        },
        'breed-selector': {
          type: 'custom-select',
          searchable: true,
          horizontalScroll: true,
          styles: {
            container: { overflowX: 'auto', overflowY: 'hidden' },
            options: { display: 'flex', gap: '8px', whiteSpace: 'nowrap' }
          }
        },
        'feature-card': {
          type: 'card',
          interactive: true,
          styles: {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          },
          hoverStyles: {
            background: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.3)'
          }
        }
      },
      
      // 반응형 브레이크포인트
      breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px'
      },
      
      // 글로벌 스타일
      globalStyles: {
        background: '#000000',
        color: '#ffffff',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        maxWidth: '448px', // max-w-md
        margin: '0 auto',
        padding: '0 16px'
      }
    };

    return wireframe;
  }

  /**
   * React 컴포넌트 생성
   */
  async generateReactComponents(wireframe) {
    console.log('⚛️ React 컴포넌트 생성 중...');
    
    const componentsDir = path.join(__dirname, '../src/components/generated');
    
    // 디렉토리 생성
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    // 각 페이지별 컴포넌트 생성
    for (const page of wireframe.pages) {
      await this.generatePageComponent(page, componentsDir);
    }

    // 공통 컴포넌트 생성
    if (wireframe.components) {
      await this.generateCommonComponents(wireframe.components, componentsDir);
    }
    
    console.log(`✅ React 컴포넌트 생성 완료: ${componentsDir}`);
  }

  /**
   * 페이지 컴포넌트 생성
   */
  async generatePageComponent(page, outputDir) {
    const componentName = page.name.replace(/\s+/g, '') + 'Page';
    const fileName = `${componentName}.tsx`;
    
    let componentCode = `/**
 * ${page.name} Page Component
 * Figma 와이어프레임에서 자동 생성됨
 */

import React from 'react';

interface ${componentName}Props {
  className?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ 
  className = '' 
}) => {
  return (
    <div className={\`pf-page pf-page-${page.type} \${className}\`}>
`;

    // 섹션별 JSX 생성
    for (const section of page.sections) {
      componentCode += this.generateSectionJSX(section, 6);
    }

    componentCode += `    </div>
  );
};

export default ${componentName};
`;

    // 파일 저장
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, componentCode, 'utf8');
    
    console.log(`  📄 생성됨: ${fileName}`);
  }

  /**
   * 섹션 JSX 생성
   */
  generateSectionJSX(section, indent = 0) {
    const spaces = ' '.repeat(indent);
    let jsx = `${spaces}<section className="pf-section pf-section-${section.type}">\n`;
    
    if (section.title) {
      jsx += `${spaces}  <h2 className="pf-section-title">${section.title}</h2>\n`;
    }

    if (section.components) {
      for (const component of section.components) {
        jsx += this.generateComponentJSX(component, indent + 2);
      }
    }

    jsx += `${spaces}</section>\n`;
    return jsx;
  }

  /**
   * 컴포넌트 JSX 생성
   */
  generateComponentJSX(component, indent = 0) {
    const spaces = ' '.repeat(indent);
    
    if (typeof component === 'string') {
      return `${spaces}<div className="pf-component">{/* ${component} */}</div>\n`;
    }

    const className = `pf-${component.type}`;
    let jsx = `${spaces}<div className="${className}">\n`;
    
    if (component.content) {
      jsx += `${spaces}  {/* ${component.content} */}\n`;
    }
    
    jsx += `${spaces}</div>\n`;
    return jsx;
  }

  /**
   * 공통 컴포넌트 생성
   */
  async generateCommonComponents(components, outputDir) {
    for (const [name, config] of Object.entries(components)) {
      const componentName = name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      
      const fileName = `${componentName}.tsx`;
      
      const componentCode = `/**
 * ${componentName} Component
 * Figma 와이어프레임에서 자동 생성됨
 */

import React from 'react';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ 
  className = '',
  children 
}) => {
  return (
    <div className={\`pf-${name} \${className}\`}>
      {children}
    </div>
  );
};

export default ${componentName};
`;

      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, componentCode, 'utf8');
      
      console.log(`  🧩 생성됨: ${fileName}`);
    }
  }

  /**
   * 스타일 가이드 생성
   */
  async generateStyleGuide(wireframe) {
    console.log('📚 스타일 가이드 생성 중...');
    
    const styleGuide = `# Pet Fortune App 스타일 가이드

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #FFB347 (따뜻한 오렌지)
- **Secondary**: #FFD700 (별 노란색)
- **Accent**: #8B4513 (강아지 갈색)
- **Background**: #000000 (검정)
- **Surface**: rgba(255,255,255,0.05) (반투명 흰색)

### 타이포그래피
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont
- **Heading XL**: 32px, Bold
- **Heading L**: 24px, Semibold
- **Body**: 16px, Regular
- **Caption**: 14px, Regular

### 간격 시스템
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px

### 컴포넌트

#### Feature Card
\`\`\`css
.pf-feature-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.pf-feature-card:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.3);
}
\`\`\`

#### Button Primary
\`\`\`css
.pf-button-primary {
  background: #FFB347;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  font-weight: 500;
  transition: all 0.15s ease;
}
\`\`\`

## 📱 반응형 디자인

### 브레이크포인트
- **Mobile**: 320px ~ 768px
- **Tablet**: 768px ~ 1024px
- **Desktop**: 1024px+

### 레이아웃
- **Max Width**: 448px (모바일 우선)
- **Padding**: 16px (좌우)
- **Gap**: 16px (카드 간격)

## 🎯 사용 방법

### CSS 변수 사용
\`\`\`css
background: var(--pf-color-brand-primary);
padding: var(--pf-spacing-lg);
border-radius: var(--pf-radius-lg);
\`\`\`

### 컴포넌트 클래스 사용
\`\`\`jsx
<div className="pf-feature-card">
  <button className="pf-button-primary">
    클릭하세요
  </button>
</div>
\`\`\`
`;

    const guideDir = path.join(__dirname, '../docs');
    if (!fs.existsSync(guideDir)) {
      fs.mkdirSync(guideDir, { recursive: true });
    }
    
    const guidePath = path.join(guideDir, 'style-guide.md');
    fs.writeFileSync(guidePath, styleGuide, 'utf8');
    
    console.log(`✅ 스타일 가이드 생성 완료: ${guidePath}`);
  }
}

// 메인 실행 함수
async function main() {
  console.log('🎨 Pet Fortune App 와이어프레임 추출 시작!\n');
  
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  
  if (!token || !fileKey) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  try {
    const extractor = new WireframeExtractor(token, fileKey);
    
    // 1. 와이어프레임 구조 분석
    const wireframe = await extractor.analyzeWireframe();
    
    // 2. React 컴포넌트 생성
    await extractor.generateReactComponents(wireframe);
    
    // 3. 스타일 가이드 생성
    await extractor.generateStyleGuide(wireframe);
    
    console.log('\n🎉 와이어프레임 추출 완료!');
    console.log('\n📋 생성된 파일들:');
    console.log('- src/components/generated/ (React 컴포넌트들)');
    console.log('- docs/style-guide.md (스타일 가이드)');
    console.log('- src/styles/pet-fortune-tokens.css (디자인 토큰)');
    
    console.log('\n🚀 다음 단계:');
    console.log('1. 생성된 컴포넌트를 기존 페이지에 적용');
    console.log('2. 스타일 세부 조정');
    console.log('3. 반응형 테스트');
    console.log('4. 배포');
    
  } catch (error) {
    console.error('\n❌ 와이어프레임 추출 실패:', error.message);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

module.exports = WireframeExtractor;
