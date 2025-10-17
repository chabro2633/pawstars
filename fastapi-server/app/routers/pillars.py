"""
만세력 삼주 조회 API 라우터
"""

from fastapi import APIRouter, HTTPException, status, Query
from typing import List
from app.models.schemas import PillarsQueryResponse, DateRangeResponse, ErrorResponse
from app.services.pillars_service import pillars_service
from app.utils.ganzi_parser import parse_solar_ganzi

router = APIRouter(prefix="/pillars", tags=["pillars"])

@router.get("/",
            response_model=PillarsQueryResponse,
            responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
            summary="특정 날짜의 삼주 조회",
            description="만세력 DB에서 특정 날짜의 년주, 월주, 일주 정보를 조회합니다.")
async def get_pillars_by_date(date: str = Query(..., description="조회할 날짜 (YYYY-MM-DD 형식)")):
    """
    특정 날짜의 삼주 정보 조회
    
    - **date**: 조회할 날짜 (YYYY-MM-DD 형식)
    
    만세력 DB에서 해당 날짜의 간지 정보를 조회하고,
    년주, 월주, 일주로 파싱하여 반환합니다.
    """
    try:
        # 만세력에서 해당 날짜 조회
        pillars_data = pillars_service.get_pillars_by_date(date)
        
        if not pillars_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"해당 날짜({date})의 만세력 정보를 찾을 수 없습니다."
            )
        
        # 간지 파싱
        pillars = parse_solar_ganzi(pillars_data["solar_ganzi"])
        
        return {
            "solar_date": pillars_data["solar_date"],
            "solar_ganzi": pillars_data["solar_ganzi"],
            "pillars": pillars,
            "jeolki": pillars_data.get("jeolki", "")
        }
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"삼주 조회 중 오류 발생: {str(e)}"
        )

@router.get("/date-range",
            response_model=DateRangeResponse,
            summary="사용 가능한 날짜 범위 조회",
            description="만세력 DB에서 조회 가능한 날짜 범위를 반환합니다.")
async def get_available_date_range():
    """
    사용 가능한 날짜 범위 조회
    
    만세력 DB에 저장된 데이터의 시작 날짜와 종료 날짜를 반환합니다.
    """
    try:
        date_range = pillars_service.get_available_date_range()
        return date_range
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"날짜 범위 조회 중 오류 발생: {str(e)}"
        )

@router.get("/search",
            response_model=List[str],
            summary="간지 패턴으로 날짜 검색",
            description="특정 간지 패턴이 포함된 날짜들을 검색합니다.")
async def search_dates_by_ganzi(
    pattern: str = Query(..., description="검색할 간지 패턴 (예: '癸未日', '辛丑年')")
):
    """
    간지 패턴으로 날짜 검색
    
    - **pattern**: 검색할 간지 패턴 (예: "癸未日", "辛丑年")
    
    만세력 DB에서 해당 패턴이 포함된 모든 날짜를 검색하여 반환합니다.
    """
    try:
        matching_dates = pillars_service.search_by_ganzi(pattern)
        return matching_dates
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"간지 패턴 검색 중 오류 발생: {str(e)}"
        )

