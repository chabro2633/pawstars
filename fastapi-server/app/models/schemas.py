"""
API 요청/응답 스키마 정의
"""

from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List
from datetime import datetime

class PetRegistrationRequest(BaseModel):
    """반려견 등록 요청 스키마"""
    name: str = Field(..., min_length=1, max_length=50, description="반려견 이름")
    breed: str = Field(..., min_length=1, max_length=100, description="견종")
    gender: str = Field(..., description="성별 (male 또는 female)")
    birth_date: str = Field(..., description="생년월일 (YYYY-MM-DD 형식)")
    
    @validator('gender')
    def validate_gender(cls, v):
        if v not in ['male', 'female']:
            raise ValueError('성별은 male 또는 female이어야 합니다')
        return v
    
    @validator('birth_date')
    def validate_birth_date(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError('생년월일은 YYYY-MM-DD 형식이어야 합니다')
        return v

class PillarsInfo(BaseModel):
    """삼주 정보 스키마"""
    year: str = Field(..., description="년주")
    month: str = Field(..., description="월주")
    day: str = Field(..., description="일주")

class ShinsalInfo(BaseModel):
    """신살 정보 스키마"""
    present: bool = Field(..., description="신살 보유 여부")
    description: str = Field(..., description="신살 설명")
    effect: str = Field(..., description="신살 효과")

class PetAnalysisResponse(BaseModel):
    """반려견 분석 결과 응답 스키마"""
    name: str = Field(..., description="반려견 이름")
    breed: str = Field(..., description="견종")
    gender: str = Field(..., description="성별")
    birth_date: str = Field(..., description="생년월일")
    pillars: PillarsInfo = Field(..., description="삼주 정보")
    five_element: str = Field(..., description="오행")
    temperament: str = Field(..., description="성향 분석")
    activity_tip: str = Field(..., description="활동 팁")
    shinsal: Dict[str, bool] = Field(..., description="신살 보유 현황")
    shinsal_details: Dict[str, ShinsalInfo] = Field(..., description="신살 상세 정보")
    shinsal_summary: str = Field(..., description="신살 종합 요약")
    analysis_date: str = Field(..., description="분석 일시")
    jeolki: str = Field(default="", description="절기 정보")

class PillarsQueryResponse(BaseModel):
    """삼주 조회 응답 스키마"""
    solar_date: str = Field(..., description="양력 날짜")
    solar_ganzi: str = Field(..., description="간지 정보")
    pillars: PillarsInfo = Field(..., description="파싱된 삼주")
    jeolki: str = Field(default="", description="절기 정보")

class DateRangeResponse(BaseModel):
    """날짜 범위 응답 스키마"""
    start_date: str = Field(..., description="시작 날짜")
    end_date: str = Field(..., description="종료 날짜")

class CompatibilityRequest(BaseModel):
    """궁합 분석 요청 스키마"""
    pet1_name: str = Field(..., description="첫 번째 반려견 이름")
    pet1_birth_date: str = Field(..., description="첫 번째 반려견 생년월일")
    pet2_name: str = Field(..., description="두 번째 반려견 이름")
    pet2_birth_date: str = Field(..., description="두 번째 반려견 생년월일")

class CompatibilityResponse(BaseModel):
    """궁합 분석 응답 스키마"""
    pet1: Dict[str, str] = Field(..., description="첫 번째 반려견 정보")
    pet2: Dict[str, str] = Field(..., description="두 번째 반려견 정보")
    compatibility: Dict[str, Any] = Field(..., description="궁합 분석 결과")
    analysis_date: str = Field(..., description="분석 일시")

class DailyFortuneResponse(BaseModel):
    """일일 운세 응답 스키마"""
    pet_name: str = Field(..., description="반려견 이름")
    target_date: str = Field(..., description="운세 날짜")
    pet_day_stem: str = Field(..., description="반려견 일간")
    today_day_stem: str = Field(..., description="오늘의 일간")
    fortune_message: str = Field(..., description="운세 메시지")
    daily_pillars: PillarsInfo = Field(..., description="오늘의 삼주")
    jeolki: str = Field(default="", description="절기 정보")

class ErrorResponse(BaseModel):
    """에러 응답 스키마"""
    error: str = Field(..., description="에러 메시지")
    detail: Optional[str] = Field(None, description="상세 에러 정보")
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat(), description="에러 발생 시각")

