#!/usr/bin/env python3
"""
PawStars FastAPI 서버 실행 스크립트
"""

import uvicorn
import sys
import os

# 현재 디렉토리를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🐾 PawStars 강아지 삼주 분석 서버 시작...")
    print("📊 API 문서: http://localhost:8000/docs")
    print("🔍 ReDoc: http://localhost:8000/redoc")
    print("⚡ 서버 주소: http://localhost:8000")
    print("-" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )

