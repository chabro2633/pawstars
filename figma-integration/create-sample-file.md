# PawStars Figma 파일 생성 가이드

## 🎨 새 Figma 파일 만들기

### 1. 기본 설정
1. Figma에서 "New design file" 클릭
2. 파일명: "PawStars Design System" 입력
3. 첫 번째 페이지명: "Components" 변경

### 2. 색상 스타일 생성

**Local styles 패널에서:**

1. **Primary Colors**
   - 색상: #FFB347 → 이름: "Brand Orange"
   - 색상: #FFD700 → 이름: "Brand Yellow"  
   - 색상: #8B4513 → 이름: "Brand Brown"

2. **Background Colors**
   - 색상: #000000 → 이름: "Dark Background"
   - 색상: rgba(255,255,255,0.05) → 이름: "Surface"
   - 색상: rgba(255,255,255,0.1) → 이름: "Surface Hover"

3. **Text Colors**
   - 색상: #FFFFFF → 이름: "Primary Text"
   - 색상: rgba(255,255,255,0.6) → 이름: "Secondary Text"

### 3. 텍스트 스타일 생성

1. **Heading Large**
   - 폰트: Inter Bold 32px
   - 이름: "H1 Main Title"

2. **Heading Medium**
   - 폰트: Inter Semibold 24px
   - 이름: "H2 Section"

3. **Body Text**
   - 폰트: Inter Regular 16px
   - 이름: "Body Regular"

### 4. 컴포넌트 생성

1. **Primary Button**
   - 크기: 320x48px
   - 배경: Brand Orange
   - 텍스트: "버튼 텍스트"
   - 둥근 모서리: 8px

2. **Card Component**
   - 크기: 320x120px
   - 배경: Surface
   - 테두리: 1px rgba(255,255,255,0.1)
   - 둥근 모서리: 12px
   - 패딩: 24px

3. **Input Field**
   - 크기: 320x48px
   - 배경: Surface
   - 테두리: 1px rgba(255,255,255,0.1)
   - 둥근 모서리: 8px

### 5. 파일 공유 설정

1. 우상단 "Share" 버튼 클릭
2. "Anyone with the link" → "can view" 설정
3. "Copy link" 클릭
4. URL에서 FILE_KEY 추출

### 6. 완료 후

파일이 생성되면:
1. URL에서 FILE_KEY 복사
2. `config.env` 파일에 입력
3. `npm run test-figma` 실행하여 연결 테스트

