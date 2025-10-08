# 🐾 PawStars 강아지 삼주 분석 FastAPI 서버

만세력 DB를 기반으로 강아지의 삼주(三柱)를 분석하고 오행, 성향, 신살을 판정하는 FastAPI 서비스입니다.

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
pip install -r requirements.txt
```

### 2. 서버 실행
```bash
python run_server.py
```

### 3. API 문서 확인
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📊 주요 기능

### 🔮 반려견 삼주 분석
```bash
POST /pet/register
```
```json
{
  "name": "몽실이",
  "breed": "말티즈",
  "gender": "female",
  "birth_date": "2021-12-01"
}
```

**응답 예시:**
```json
{
  "name": "몽실이",
  "breed": "말티즈",
  "gender": "female",
  "birth_date": "2021-12-01",
  "pillars": {
    "year": "辛丑",
    "month": "己亥", 
    "day": "癸未"
  },
  "five_element": "수(水)",
  "temperament": "감수성이 풍부하고 적응력이 뛰어나며 교감을 중시하며, 사람을 좋아하고 감정 교류에 민감한 타입",
  "activity_tip": "물놀이, 변화가 있는 활동, 조용한 교감을 좋아합니다 💧",
  "shinsal": {
    "역마살": true,
    "도화살": false,
    "화개살": true,
    "문창귀인": true,
    "천덕귀인": false
  },
  "shinsal_summary": "활동적이고 변화를 추구하며, 여행이나 산책을 특히 좋아합니다 독특한 매력이 있고 예술적 감각이 뛰어나며, 혼자만의 시간도 즐깁니다"
}
```

### 📅 만세력 조회
```bash
GET /pillars/?date=2021-12-01
```

### 💕 궁합 분석
```bash
POST /pet/compatibility
```

### 🌟 일일 운세
```bash
GET /pet/daily-fortune/{pet_name}?birth_date=2021-12-01
```

## 🏗️ 프로젝트 구조

```
fastapi-server/
├── app/
│   ├── main.py              # FastAPI 앱 메인
│   ├── models/
│   │   └── schemas.py       # Pydantic 스키마
│   ├── routers/
│   │   ├── pets.py          # 반려견 관련 API
│   │   └── pillars.py       # 만세력 조회 API
│   ├── services/
│   │   ├── pillars_service.py   # 만세력 조회 서비스
│   │   ├── pet_service.py       # 반려견 분석 서비스
│   │   ├── five_elements.py     # 오행 분석
│   │   └── shinsal_service.py   # 신살 판정
│   └── utils/
│       ├── ganzi_parser.py      # 간지 파싱
│       └── mapping_tables.py    # 매핑 테이블
├── data/
│   └── final_crawled_df_만세력.csv  # 만세력 DB
├── requirements.txt
├── run_server.py
└── README.md
```

## 📋 API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| POST | `/pet/register` | 반려견 등록 및 삼주 분석 |
| POST | `/pet/compatibility` | 두 반려견 궁합 분석 |
| GET | `/pet/daily-fortune/{name}` | 일일 운세 조회 |
| GET | `/pillars/` | 특정 날짜 삼주 조회 |
| GET | `/pillars/date-range` | 사용 가능한 날짜 범위 |
| GET | `/pillars/search` | 간지 패턴 검색 |
| GET | `/health` | 서버 상태 확인 |

## 🔍 신살(神殺) 종류

- **역마살(驛馬殺)**: 이동과 변화를 좋아하는 성향
- **도화살(桃花殺)**: 매력적이고 사교적인 성향  
- **화개살(華蓋殺)**: 예술적이고 독특한 성향
- **문창귀인(文昌貴人)**: 학습능력이 뛰어난 성향
- **천덕귀인(天德貴人)**: 복이 많고 건강한 성향

## 🎯 오행(五行) 분석

| 오행 | 성향 | 특징 |
|------|------|------|
| 목(木) | 성장하고 확장하려는 성향 | 활발함, 호기심, 성장욕구 |
| 화(火) | 밝고 활발하며 사교적 | 활발함, 사교성, 표현력 |
| 토(土) | 안정적이고 신중함 | 안정성, 충성심, 보호본능 |
| 금(金) | 규칙적이고 독립적 | 독립성, 규칙성, 의지력 |
| 수(水) | 감수성이 풍부하고 적응력 뛰어남 | 감수성, 적응력, 교감능력 |

## 🛠️ 개발 환경

- **Python**: 3.10+
- **FastAPI**: 0.104.1
- **Pandas**: 2.1.3
- **Uvicorn**: 0.24.0

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
