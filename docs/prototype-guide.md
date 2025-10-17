# Pet Fortune App 프로토타입 가이드

## 🎯 화면 플로우

### 주요 화면

#### 홈 화면 (`/`)
- **타입**: landing
- **컴포넌트**: logo, title, subtitle, feature-cards, cta-button

#### 강아지 삼주 (`/fortune`)
- **타입**: form
- **컴포넌트**: header, form-section, input, select, radio, date-picker, submit-button

#### 견주 궁합 (`/compatibility`)
- **타입**: multi-step-form
- **컴포넌트**: N/A

#### 결과 화면 (`/results`)
- **타입**: results
- **컴포넌트**: sticky-header, result-card, result-card, action-buttons

#### 로딩 화면 (`/loading`)
- **타입**: loading
- **컴포넌트**: spinner, progress-bar


## 🔄 화면 전환

### 플로우 다이어그램
```
홈 화면 → 강아지 삼주 → 로딩 → 결과 화면
    ↓         ↓
견주 궁합 → 로딩 → 결과 화면
    ↓
결과 화면 ← → 재분석
```

### 트랜지션 효과

- **home → fortune**: slide-right (300ms)
  - 트리거: click
  - 요소: fortune-card

- **home → compatibility**: slide-right (300ms)
  - 트리거: click
  - 요소: compatibility-card

- **home → results**: slide-right (300ms)
  - 트리거: click
  - 요소: results-card

- **fortune → loading**: fade (200ms)
  - 트리거: submit
  - 요소: submit-button

- **loading → results**: slide-up (400ms)
  - 트리거: auto
  - 요소: N/A

- **compatibility → loading**: fade (200ms)
  - 트리거: submit
  - 요소: submit-button

- **results → fortune**: slide-left (300ms)
  - 트리거: click
  - 요소: reanalyze-button


## ✨ 인터랙션

### 호버 효과
- **카드**: 배경 밝아짐, 테두리 강조, 그림자 효과, 살짝 위로 이동
- **버튼**: 색상 변화, 그림자 효과

### 클릭 효과
- **버튼**: 스케일 축소 (0.98), 색상 변화
- **카드**: 클릭 시 페이지 이동

### 포커스 효과
- **입력 필드**: 테두리 색상 변화, 글로우 효과

## 🎨 애니메이션

### 페이지 진입
- **fadeIn**: 투명도 0 → 1, 아래에서 위로 20px 이동
- **slideRight**: 왼쪽에서 오른쪽으로 슬라이드

### 상호작용
- **bounce**: 버튼 클릭 시 탄성 효과
- **pulse**: 로딩 중 맥박 효과

## 📱 상태 관리

### 로딩 상태
- 커서: wait
- 포인터 이벤트: 비활성화
- 투명도: 0.7

### 에러 상태
- 테두리: 빨간색
- 배경: 연한 빨간색

### 성공 상태
- 테두리: 초록색
- 배경: 연한 초록색

## 🛠️ 구현 방법

### 1. 컴포넌트에서 사용
```jsx
import { PageTransition } from '@/components/transitions/PageTransition';
import { useHoverEffect } from '@/components/transitions/useInteractions';

export default function HomePage() {
  const { hoverProps } = useHoverEffect({
    transform: 'translateY(-2px)',
    boxShadow: 'var(--pf-shadow-glow)'
  });

  return (
    <PageTransition type="fadeIn">
      <div className="pf-card" {...hoverProps}>
        카드 내용
      </div>
    </PageTransition>
  );
}
```

### 2. CSS 클래스 사용
```jsx
<div className="pf-card pf-hover-lift pf-click-scale">
  <button className="pf-button-primary pf-animation-bounce">
    클릭하세요
  </button>
</div>
```

### 3. 애니메이션 트리거
```jsx
const { isLoading, startLoading } = useLoadingState();

<button 
  className={`pf-button-primary ${isLoading ? 'pf-state-loading' : ''}`}
  onClick={startLoading}
>
  {isLoading ? '분석 중...' : '분석 시작'}
</button>
```

## 🎯 접근성

- **키보드 네비게이션**: Tab 키로 모든 요소 접근 가능
- **스크린 리더**: ARIA 라벨 및 역할 정의
- **모션 감소**: prefers-reduced-motion 지원
- **고대비**: 색상 대비 4.5:1 이상 유지

## 📊 성능 최적화

- **애니메이션**: GPU 가속 사용 (transform, opacity)
- **트랜지션**: 60fps 유지를 위한 최적화
- **메모리**: 불필요한 애니메이션 정리
- **배터리**: 백그라운드에서 애니메이션 일시정지
