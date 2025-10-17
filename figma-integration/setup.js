#!/usr/bin/env node

/**
 * PawStars Figma Integration 설정 스크립트
 * 대화형으로 필요한 설정을 수집하고 환경 파일을 생성합니다.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class SetupWizard {
  constructor() {
    this.config = {};
    this.envPath = path.join(__dirname, '.env');
  }

  async run() {
    console.log('🎨 PawStars Figma Integration 설정을 시작합니다!\n');
    
    try {
      await this.collectFigmaInfo();
      await this.collectMakeInfo();
      await this.collectGitHubInfo();
      await this.collectSlackInfo();
      
      this.generateEnvFile();
      this.showNextSteps();
      
    } catch (error) {
      console.error('❌ 설정 중 오류가 발생했습니다:', error);
    } finally {
      rl.close();
    }
  }

  async collectFigmaInfo() {
    console.log('📐 Figma 설정');
    console.log('─'.repeat(50));
    
    this.config.FIGMA_ACCESS_TOKEN = await this.ask(
      '1. Figma Personal Access Token을 입력하세요:\n   (Figma → Settings → Account → Personal access tokens)\n   토큰: '
    );
    
    this.config.FIGMA_FILE_KEY = await this.ask(
      '\n2. Figma File Key를 입력하세요:\n   (URL에서 추출: https://www.figma.com/file/{FILE_KEY}/...)\n   File Key: '
    );
    
    console.log('✅ Figma 설정 완료!\n');
  }

  async collectMakeInfo() {
    console.log('🔗 Make.com 설정');
    console.log('─'.repeat(50));
    
    const hasMake = await this.ask('Make.com 계정이 있으신가요? (y/n): ');
    
    if (hasMake.toLowerCase() !== 'y') {
      console.log('\n📝 Make.com 계정을 먼저 생성해주세요:');
      console.log('   1. https://www.make.com 방문');
      console.log('   2. "Sign up for free" 클릭');
      console.log('   3. 계정 생성 후 다시 실행해주세요\n');
      process.exit(0);
    }
    
    this.config.MAKE_WEBHOOK_URL = await this.ask(
      '\nMake.com 웹훅 URL을 입력하세요:\n   (시나리오 생성 후 제공됩니다)\n   웹훅 URL: '
    );
    
    console.log('✅ Make.com 설정 완료!\n');
  }

  async collectGitHubInfo() {
    console.log('🐙 GitHub 설정');
    console.log('─'.repeat(50));
    
    this.config.GITHUB_OWNER = await this.ask('GitHub 사용자명: ');
    this.config.GITHUB_REPO = 'pawstars'; // 고정값
    
    this.config.GITHUB_TOKEN = await this.ask(
      '\nGitHub Personal Access Token을 입력하세요:\n   (GitHub → Settings → Developer settings → Personal access tokens)\n   토큰: '
    );
    
    console.log('✅ GitHub 설정 완료!\n');
  }

  async collectSlackInfo() {
    console.log('💬 Slack 설정 (선택사항)');
    console.log('─'.repeat(50));
    
    const useSlack = await this.ask('Slack 알림을 사용하시겠습니까? (y/n): ');
    
    if (useSlack.toLowerCase() === 'y') {
      this.config.SLACK_WEBHOOK_URL = await this.ask(
        '\nSlack 웹훅 URL을 입력하세요:\n   (Slack → Apps → Incoming Webhooks)\n   웹훅 URL: '
      );
    }
    
    console.log('✅ Slack 설정 완료!\n');
  }

  generateEnvFile() {
    console.log('📝 환경 파일 생성 중...');
    
    let envContent = '# PawStars Figma Integration 환경 설정\n';
    envContent += '# 자동 생성된 파일 - 수동으로 수정 가능\n\n';
    
    envContent += '# Figma 설정\n';
    envContent += `FIGMA_ACCESS_TOKEN=${this.config.FIGMA_ACCESS_TOKEN}\n`;
    envContent += `FIGMA_FILE_KEY=${this.config.FIGMA_FILE_KEY}\n\n`;
    
    envContent += '# Make.com 설정\n';
    envContent += `MAKE_WEBHOOK_URL=${this.config.MAKE_WEBHOOK_URL || ''}\n\n`;
    
    envContent += '# GitHub 설정\n';
    envContent += `GITHUB_TOKEN=${this.config.GITHUB_TOKEN}\n`;
    envContent += `GITHUB_REPO=${this.config.GITHUB_REPO}\n`;
    envContent += `GITHUB_OWNER=${this.config.GITHUB_OWNER}\n\n`;
    
    if (this.config.SLACK_WEBHOOK_URL) {
      envContent += '# Slack 설정\n';
      envContent += `SLACK_WEBHOOK_URL=${this.config.SLACK_WEBHOOK_URL}\n\n`;
    }
    
    fs.writeFileSync(this.envPath, envContent, 'utf8');
    console.log(`✅ 환경 파일이 생성되었습니다: ${this.envPath}\n`);
  }

  showNextSteps() {
    console.log('🎉 설정이 완료되었습니다!');
    console.log('─'.repeat(50));
    console.log('\n📋 다음 단계:');
    console.log('1. Make.com에서 시나리오 생성');
    console.log('2. 테스트 실행: npm run test-figma');
    console.log('3. 첫 번째 디자인 토큰 생성: npm run generate-tokens');
    console.log('\n🔗 유용한 링크:');
    console.log('- Make.com 대시보드: https://www.make.com/en/scenarios');
    console.log('- Figma API 문서: https://www.figma.com/developers/api');
    console.log('- GitHub 토큰 관리: https://github.com/settings/tokens');
    console.log('\n💡 문제가 있으면 README.md를 참고하세요!');
  }

  ask(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}

// 실행
if (require.main === module) {
  const wizard = new SetupWizard();
  wizard.run();
}

module.exports = SetupWizard;

