# Pet Fortune App 스타일 가이드

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
```css
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
```

#### Button Primary
```css
.pf-button-primary {
  background: #FFB347;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  font-weight: 500;
  transition: all 0.15s ease;
}
```

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
```css
background: var(--pf-color-brand-primary);
padding: var(--pf-spacing-lg);
border-radius: var(--pf-radius-lg);
```

### 컴포넌트 클래스 사용
```jsx
<div className="pf-feature-card">
  <button className="pf-button-primary">
    클릭하세요
  </button>
</div>
```
