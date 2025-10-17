# Make.com 시나리오 설정 가이드

## 🔗 1단계: Make.com 계정 생성

1. **Make.com 방문** → https://www.make.com
2. **"Start for free"** 클릭
3. **이메일 가입** 또는 Google 계정 연동
4. **무료 플랜 선택** (월 1,000 operations)

## 🎯 2단계: 새 시나리오 생성

1. **대시보드에서 "Create a new scenario"** 클릭
2. **시나리오 이름**: "PawStars Figma Sync"

## 📐 3단계: Figma 모듈 추가

### 3-1. 트리거 설정
1. **"+" 버튼** 클릭
2. **"Figma" 검색** → Figma 앱 선택
3. **"Watch File"** 모듈 선택
4. **Connection 생성**:
   - Name: "PawStars Figma"
   - Personal Access Token: [Figma 토큰 입력]
5. **File Key 입력**: [Figma 파일 키 입력]
6. **"OK"** 클릭

### 3-2. 웹훅 설정
1. **Webhook URL 복사** (자동 생성됨)
2. **`config.env`의 `MAKE_WEBHOOK_URL`에 붙여넣기**

## 🐙 4단계: GitHub 모듈 추가

### 4-1. GitHub 연결
1. **Figma 모듈 옆 "+" 클릭**
2. **"GitHub" 검색** → GitHub 앱 선택
3. **"Create a file"** 모듈 선택
4. **Connection 생성**:
   - GitHub 계정으로 로그인
   - Repository 접근 권한 허용

### 4-2. 파일 설정
- **Repository**: pawstars
- **File path**: `src/styles/figma-tokens.css`
- **Content**: `{{body}}` (Figma 데이터)
- **Commit message**: `Update design tokens from Figma`

## 💬 5단계: Slack 알림 (선택사항)

### 5-1. Slack 모듈 추가
1. **GitHub 모듈 옆 "+" 클릭**
2. **"Slack" 검색** → Slack 앱 선택
3. **"Send a Message"** 모듈 선택

### 5-2. 메시지 설정
- **Channel**: #dev-notifications
- **Message**: 
  ```
  🎨 Figma 디자인이 업데이트되었습니다!
  
  파일: {{1.name}}
  수정 시간: {{1.lastModified}}
  
  자동으로 코드에 반영되었습니다. ✅
  ```

## ⚡ 6단계: 시나리오 활성화

1. **좌하단 "ON/OFF" 스위치** 클릭
2. **"Turn on"** 확인
3. **"Save"** 버튼 클릭

## 🧪 7단계: 테스트

### 7-1. 수동 테스트
1. **"Run once"** 버튼 클릭
2. **실행 결과 확인**
3. **GitHub에 파일이 생성되었는지 확인**

### 7-2. 실제 테스트
1. **Figma 파일에서 색상 수정**
2. **1-2분 후 Make.com에서 자동 실행 확인**
3. **GitHub 커밋 확인**
4. **Slack 알림 확인**

## 📊 모니터링

### 실행 내역 확인
- **Make.com 대시보드** → "History" 탭
- **성공/실패 상태 확인**
- **오류 로그 분석**

### 사용량 확인
- **Settings** → "Plan & Billing"
- **월간 operations 사용량 확인**
- **필요시 플랜 업그레이드**

## 🚨 문제 해결

### 일반적인 오류
1. **403 Forbidden**: Figma 토큰 또는 권한 확인
2. **404 Not Found**: 파일 키 또는 GitHub 저장소 확인
3. **Rate Limit**: API 호출 빈도 조절

### 디버깅 팁
1. **각 모듈별로 개별 테스트**
2. **데이터 매핑 확인**
3. **로그 메시지 분석**

