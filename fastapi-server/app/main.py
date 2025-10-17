"""
PawStars 만세력 기반 강아지 삼주 분석 FastAPI 서버
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime

from app.routers import pets, pillars

# FastAPI 앱 생성
app = FastAPI(
    title="PawStars 강아지 삼주 분석 API",
    description="""
    🐾 **PawStars** - 만세력 기반 강아지 삼주 분석 서비스
    
    ## 주요 기능
    
    ### 🔮 반려견 삼주 분석
    - 생년월일 기반 삼주(년주/월주/일주) 계산
    - 오행(五行) 분석 및 성향 진단
    - 신살(神殺) 자동 판정 (역마살, 도화살, 화개살 등)
    - 견종별 특성과 결합한 종합 분석
    
    ### 📊 만세력 조회
    - 특정 날짜의 간지 정보 조회
    - 간지 패턴 검색
    - 사용 가능한 날짜 범위 확인
    
    ### 💕 추가 기능
    - 두 반려견 궁합 분석
    - 일일 운세 조회
    
    ## 데이터 소스
    - **만세력 DB**: `final_crawled_df_만세력.csv` (약 56,000일 데이터)
    - **지원 기간**: 1896년 이후 ~ 현재
    
    ## 사용법
    1. `/pet/register` - 반려견 등록 및 종합 분석
    2. `/pillars/` - 특정 날짜의 삼주 조회
    3. `/pet/compatibility` - 두 반려견 궁합 분석
    """,
    version="1.0.0",
    contact={
        "name": "PawStars Team",
        "url": "https://github.com/your-repo/pawstars",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영시에는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(pets.router)
app.include_router(pillars.router)

@app.get("/", tags=["root"])
async def root():
    """
    API 루트 엔드포인트
    서버 상태 및 기본 정보 반환
    """
    return {
        "message": "🐾 PawStars 강아지 삼주 분석 API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "pet_register": "/pet/register",
            "pillars_query": "/pillars/?date=YYYY-MM-DD",
            "compatibility": "/pet/compatibility",
            "daily_fortune": "/pet/daily-fortune/{pet_name}",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

@app.get("/health", tags=["health"])
async def health_check():
    """
    헬스 체크 엔드포인트
    서버 상태 및 의존성 확인
    """
    try:
        # 만세력 서비스 상태 확인
        from app.services.pillars_service import pillars_service
        date_range = pillars_service.get_available_date_range()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "pillars_service": "ok",
                "data_range": date_range
            }
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }
        )

# 전역 예외 처리
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    전역 예외 처리기
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    # 개발 서버 실행
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

