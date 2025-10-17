#!/usr/bin/env node

/**
 * Figma API 연결 테스트 스크립트
 * 설정이 올바른지 확인합니다.
 */

require('dotenv').config({ path: './config.env' });
const FigmaIntegration = require('./figma-api');

async function testConnection() {
  console.log('🔍 Figma API 연결 테스트를 시작합니다...\n');
  
  // 환경 변수 확인
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  
  if (!token) {
    console.error('❌ FIGMA_ACCESS_TOKEN이 설정되지 않았습니다.');
    console.log('💡 npm run setup을 먼저 실행하세요.');
    process.exit(1);
  }
  
  if (!fileKey) {
    console.error('❌ FIGMA_FILE_KEY가 설정되지 않았습니다.');
    console.log('💡 npm run setup을 먼저 실행하세요.');
    process.exit(1);
  }
  
  console.log('✅ 환경 변수 확인 완료');
  console.log(`📁 파일 키: ${fileKey.substring(0, 8)}...`);
  console.log(`🔑 토큰: ${token.substring(0, 8)}...\n`);
  
  try {
    const figma = new FigmaIntegration(token, fileKey);
    
    // 1. 파일 정보 가져오기 테스트
    console.log('1️⃣ 파일 정보 가져오기...');
    const fileData = await figma.getFile();
    
    if (fileData.err) {
      throw new Error(`Figma API 오류: ${fileData.err}`);
    }
    
    console.log(`   ✅ 파일명: ${fileData.name}`);
    console.log(`   📄 페이지 수: ${fileData.document.children.length}`);
    console.log(`   👤 마지막 수정자: ${fileData.lastModified}`);
    
    // 2. 컴포넌트 정보 가져오기 테스트
    console.log('\n2️⃣ 컴포넌트 정보 가져오기...');
    const components = await figma.getComponents();
    
    if (components.err) {
      console.log('   ⚠️ 컴포넌트가 없거나 접근할 수 없습니다.');
    } else {
      const componentCount = Object.keys(components.meta.components || {}).length;
      console.log(`   ✅ 컴포넌트 수: ${componentCount}개`);
      
      if (componentCount > 0) {
        const firstComponent = Object.values(components.meta.components)[0];
        console.log(`   📦 첫 번째 컴포넌트: ${firstComponent.name}`);
      }
    }
    
    // 3. 스타일 정보 가져오기 테스트
    console.log('\n3️⃣ 스타일 정보 가져오기...');
    const styles = await figma.getStyles();
    
    if (styles.err) {
      console.log('   ⚠️ 스타일이 없거나 접근할 수 없습니다.');
    } else {
      const styleCount = Object.keys(styles.meta.styles || {}).length;
      console.log(`   ✅ 스타일 수: ${styleCount}개`);
      
      if (styleCount > 0) {
        const firstStyle = Object.values(styles.meta.styles)[0];
        console.log(`   🎨 첫 번째 스타일: ${firstStyle.name} (${firstStyle.styleType})`);
      }
    }
    
    console.log('\n🎉 모든 테스트가 성공했습니다!');
    console.log('\n📋 다음 단계:');
    console.log('1. npm run generate-tokens - 디자인 토큰 생성');
    console.log('2. Make.com 시나리오 설정');
    console.log('3. 자동화 테스트');
    
  } catch (error) {
    console.error('\n❌ 테스트 실패:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 해결 방법:');
      console.log('- Figma 토큰이 유효한지 확인하세요');
      console.log('- 파일에 대한 접근 권한이 있는지 확인하세요');
    } else if (error.message.includes('404')) {
      console.log('\n💡 해결 방법:');
      console.log('- 파일 키가 올바른지 확인하세요');
      console.log('- 파일이 삭제되지 않았는지 확인하세요');
    }
    
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;
