"""
Netlify Functions용 FastAPI 핸들러
"""

import sys
import os
import json
from urllib.parse import unquote

# 현재 디렉토리를 Python 경로에 추가
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, "..", "..")
sys.path.insert(0, project_root)

from app.main import app

def handler(event, context):
    """
    Netlify Functions 핸들러
    """
    try:
        # HTTP 메서드와 경로 추출
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        
        # 쿼리 파라미터 처리
        query_params = event.get('queryStringParameters') or {}
        query_string = '&'.join([f"{k}={v}" for k, v in query_params.items()])
        if query_string:
            path += f"?{query_string}"
        
        # 헤더 처리
        headers = event.get('headers', {})
        
        # 바디 처리
        body = event.get('body', '')
        if event.get('isBase64Encoded', False):
            import base64
            body = base64.b64decode(body).decode('utf-8')
        
        # ASGI 스코프 생성
        scope = {
            'type': 'http',
            'method': http_method,
            'path': path.split('?')[0],
            'query_string': query_string.encode() if query_string else b'',
            'headers': [[k.lower().encode(), v.encode()] for k, v in headers.items()],
        }
        
        # 간단한 응답 처리 (실제로는 더 복잡한 ASGI 구현이 필요)
        if path == '/' or path.startswith('/?'):
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                'body': json.dumps({
                    "message": "🐾 PawStars 강아지 삼주 분석 API",
                    "version": "1.0.0",
                    "status": "running on Netlify",
                    "endpoints": {
                        "pet_register": "/pet/register",
                        "pillars_query": "/pillars/?date=YYYY-MM-DD",
                        "compatibility": "/pet/compatibility",
                        "docs": "/docs"
                    }
                })
            }
        
        # 다른 경로들은 기본 응답
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                "message": "PawStars API on Netlify",
                "path": path,
                "method": http_method
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                "error": "Internal Server Error",
                "detail": str(e)
            })
        }

