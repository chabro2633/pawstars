/**
 * Figma Make 파일 전용 API 연동
 * Make 파일은 일반 디자인 파일과 다른 API를 사용합니다.
 */

// Node.js 환경에서 fetch 사용을 위한 설정
let fetch;
if (typeof window === 'undefined') {
  fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
} else {
  fetch = window.fetch;
}

const FIGMA_API_BASE = 'https://api.figma.com/v1';

class FigmaMakeIntegration {
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make 파일 정보 가져오기 (특별한 엔드포인트 사용)
   */
  async getMakeFile() {
    try {
      // Make 파일을 위한 특별한 엔드포인트 시도
      const endpoints = [
        `${FIGMA_API_BASE}/files/${this.fileKey}/nodes`, // 노드 기반 접근
        `${FIGMA_API_BASE}/files/${this.fileKey}/images`, // 이미지 기반 접근
        `${FIGMA_API_BASE}/files/${this.fileKey}/components`, // 컴포넌트 기반 접근
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: this.headers
          });
          const data = await response.json();
          
          if (!data.err) {
            console.log(`✅ 성공한 엔드포인트: ${endpoint}`);
            return { success: true, data, endpoint };
          }
        } catch (error) {
          console.log(`❌ 실패한 엔드포인트: ${endpoint} - ${error.message}`);
        }
      }

      // 모든 엔드포인트가 실패한 경우, 파일 메타데이터만 시도
      return await this.getFileMetadata();
      
    } catch (error) {
      console.error('Make 파일 접근 실패:', error);
      throw error;
    }
  }

  /**
   * 파일 메타데이터만 가져오기
   */
  async getFileMetadata() {
    try {
      // 파일의 기본 정보만 가져오는 가벼운 요청
      const response = await fetch(`${FIGMA_API_BASE}/files/${this.fileKey}`, {
        method: 'HEAD', // HEAD 요청으로 메타데이터만
        headers: this.headers
      });

      if (response.ok) {
        return {
          success: true,
          metadata: {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            fileKey: this.fileKey
          }
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('메타데이터 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * Make 파일에서 사용 가능한 정보 추출
   */
  async extractAvailableInfo() {
    try {
      console.log('🔍 Make 파일에서 사용 가능한 정보를 찾는 중...');
      
      // 1. 컴포넌트 정보 시도
      try {
        const response = await fetch(`${FIGMA_API_BASE}/files/${this.fileKey}/components`, {
          headers: this.headers
        });
        const data = await response.json();
        
        if (!data.err && data.meta) {
          console.log('✅ 컴포넌트 정보 접근 가능');
          return {
            type: 'components',
            data: data.meta.components || {},
            count: Object.keys(data.meta.components || {}).length
          };
        }
      } catch (error) {
        console.log('❌ 컴포넌트 정보 접근 불가');
      }

      // 2. 스타일 정보 시도
      try {
        const response = await fetch(`${FIGMA_API_BASE}/files/${this.fileKey}/styles`, {
          headers: this.headers
        });
        const data = await response.json();
        
        if (!data.err && data.meta) {
          console.log('✅ 스타일 정보 접근 가능');
          return {
            type: 'styles',
            data: data.meta.styles || {},
            count: Object.keys(data.meta.styles || {}).length
          };
        }
      } catch (error) {
        console.log('❌ 스타일 정보 접근 불가');
      }

      // 3. 이미지 정보 시도 (노드 ID 없이)
      try {
        const response = await fetch(`${FIGMA_API_BASE}/images/${this.fileKey}`, {
          headers: this.headers
        });
        const data = await response.json();
        
        if (!data.err) {
          console.log('✅ 이미지 엔드포인트 접근 가능');
          return {
            type: 'images',
            data: data,
            available: true
          };
        }
      } catch (error) {
        console.log('❌ 이미지 정보 접근 불가');
      }

      return {
        type: 'limited',
        message: 'Make 파일은 제한된 API 접근만 가능합니다.',
        suggestions: [
          '1. Make 파일을 일반 디자인 파일로 복사',
          '2. 수동으로 디자인 토큰 정의',
          '3. 스크린샷 기반 분석 사용'
        ]
      };

    } catch (error) {
      console.error('정보 추출 실패:', error);
      throw error;
    }
  }

  /**
   * Make 파일 분석 보고서 생성
   */
  async generateAnalysisReport() {
    console.log('📊 Make 파일 분석 보고서 생성 중...\n');
    
    const report = {
      fileKey: this.fileKey,
      fileType: 'Figma Make File',
      timestamp: new Date().toISOString(),
      analysis: {}
    };

    try {
      // 사용 가능한 정보 추출
      const availableInfo = await this.extractAvailableInfo();
      report.analysis = availableInfo;

      // 보고서 출력
      console.log('📋 분석 결과:');
      console.log(`   파일 키: ${report.fileKey}`);
      console.log(`   파일 타입: ${report.fileType}`);
      console.log(`   분석 시간: ${new Date(report.timestamp).toLocaleString('ko-KR')}`);
      console.log(`   접근 가능한 데이터: ${availableInfo.type}`);
      
      if (availableInfo.count !== undefined) {
        console.log(`   데이터 개수: ${availableInfo.count}개`);
      }

      if (availableInfo.suggestions) {
        console.log('\n💡 권장사항:');
        availableInfo.suggestions.forEach((suggestion, index) => {
          console.log(`   ${suggestion}`);
        });
      }

      return report;

    } catch (error) {
      report.error = error.message;
      console.error('❌ 분석 실패:', error.message);
      return report;
    }
  }
}

module.exports = FigmaMakeIntegration;

