# PawStars Figma Token 설정 가이드

## 🔑 Personal Access Token 생성

### 1단계: Figma 토큰 생성 페이지 접속
- Figma → Settings → Account → Personal access tokens
- "Generate new token" 클릭

### 2단계: 토큰 정보 입력
- **토큰 이름**: `PawStars Design Integration`
- **만료일**: 2026년 1월 7일 (1년 후)

### 3단계: 권한 설정 (Scope)

#### ✅ 필수 권한 체크
```
☑️ file_content:read
   파일의 내용을 읽고 이미지를 렌더링합니다
   → 디자인 요소, 색상, 폰트 정보 추출에 필요

☑️ file_metadata:read  
   파일의 메타데이터를 읽습니다
   → 파일 이름, 수정 날짜 등 기본 정보

☑️ file_versions:read
   파일의 버전 기록을 읽습니다
   → 변경 사항 추적에 유용

☑️ library_assets:read
   개별 컴포넌트 및 스타일에 대한 데이터를 읽습니다
   → 컴포넌트 정보 추출에 필요

☑️ library_content:read
   개별 파일에서 게시된 컴포넌트의 스타일을 읽습니다
   → 디자인 시스템 토큰 추출에 필요
```

#### ⭕ 선택적 권한 (팀 협업시)
```
☑️ file_comments:read (선택사항)
   액세스 가능한 파일의 댓글을 읽습니다
   → 디자이너 피드백 확인용

☑️ webhooks:read (선택사항)
   웹훅을 읽고 나열합니다
   → Make.com 연동 고급 설정용
```

#### ❌ 불필요한 권한 (체크 안 함)
```
☐ current_user:read
☐ file_comments:write  
☐ file_dev_resources:write
☐ team_library_content:read
☐ projects:read
☐ webhooks:write
```

## 🔒 보안 권장사항

### 최소 권한 원칙
- **읽기 전용**: 쓰기 권한은 부여하지 않음
- **필요한 것만**: 실제 사용하는 기능에만 권한 부여
- **정기 검토**: 3-6개월마다 토큰 사용 현황 검토

### 토큰 관리
- **안전한 저장**: 환경 변수로만 저장
- **공유 금지**: GitHub 등 공개 저장소에 업로드 금지
- **만료 관리**: 만료 전 미리 갱신

## 🧪 권한 테스트

토큰 생성 후 다음 명령어로 권한을 테스트하세요:

```bash
cd figma-integration
npm run test-figma
```

### 예상 결과
```
✅ 환경 변수 확인 완료
📁 파일 키: APgySq6q...
🔑 토큰: figd_U2F...

1️⃣ 파일 정보 가져오기...
   ✅ 파일명: Pet-Fortune-App-Prototype
   📄 페이지 수: 3
   👤 마지막 수정자: 2024-01-07

2️⃣ 컴포넌트 정보 가져오기...
   ✅ 컴포넌트 수: 12개
   📦 첫 번째 컴포넌트: Primary Button

3️⃣ 스타일 정보 가져오기...
   ✅ 스타일 수: 8개
   🎨 첫 번째 스타일: Brand Orange (FILL)

🎉 모든 테스트가 성공했습니다!
```

## 🚨 문제 해결

### 403 Forbidden 오류
- **원인**: 권한 부족 또는 파일 접근 불가
- **해결**: 
  1. 필수 권한 재확인
  2. 파일 공유 설정 확인 (Anyone with link → Can view)
  3. 토큰 재생성

### 404 Not Found 오류  
- **원인**: 잘못된 파일 키
- **해결**: Figma URL에서 파일 키 재확인

### Rate Limit 오류
- **원인**: API 호출 한도 초과
- **해결**: 잠시 대기 후 재시도

## 📊 API 사용량 모니터링

### Figma API 제한
- **개인 토큰**: 시간당 1,000 요청
- **팀 토큰**: 시간당 10,000 요청

### 사용량 최적화
- **캐싱**: 동일한 요청 결과 재사용
- **배치 처리**: 여러 요청을 한 번에 처리
- **변경 감지**: 실제 변경이 있을 때만 요청

