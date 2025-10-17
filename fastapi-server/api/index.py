"""
Vercel 배포용 엔트리포인트
"""

import sys
import os

# 현재 디렉토리를 Python 경로에 추가
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from app.main import app

# Vercel에서 사용할 handler
handler = app

