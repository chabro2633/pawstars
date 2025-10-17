"""
반려견 관련 API 라우터
"""

from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    PetRegistrationRequest, 
    PetAnalysisResponse, 
    CompatibilityRequest,
    CompatibilityResponse,
    DailyFortuneResponse,
    ErrorResponse
)
from app.services.pet_service import pet_service

router = APIRouter(prefix="/pet", tags=["pets"])

@router.post("/register", 
             response_model=PetAnalysisResponse,
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
             summary="반려견 등록 및 삼주 분석",
             description="반려견 정보를 등록하고 삼주, 오행, 신살을 종합 분석합니다.")
async def register_pet(pet_data: PetRegistrationRequest):
    """
    반려견 등록 및 종합 삼주 분석
    
    - **name**: 반려견 이름 (1-50자)
    - **breed**: 견종 (1-100자)
    - **gender**: 성별 (male 또는 female)
    - **birth_date**: 생년월일 (YYYY-MM-DD 형식)
    
    반환값에는 삼주, 오행, 성향, 신살 등의 종합 분석 결과가 포함됩니다.
    """
    try:
        result = pet_service.register_and_analyze_pet(
            name=pet_data.name,
            breed=pet_data.breed,
            gender=pet_data.gender,
            birth_date=pet_data.birth_date
        )
        return result
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"서버 내부 오류: {str(e)}"
        )

@router.post("/compatibility",
             response_model=CompatibilityResponse,
             responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
             summary="두 반려견 궁합 분석",
             description="두 반려견의 오행을 비교하여 궁합을 분석합니다.")
async def analyze_compatibility(compatibility_data: CompatibilityRequest):
    """
    두 반려견의 궁합 분석
    
    각 반려견의 생년월일을 바탕으로 오행을 추출하고,
    오행 상생/상극 관계를 분석하여 궁합을 판정합니다.
    """
    try:
        # 각 반려견의 기본 분석 수행
        pet1_analysis = pet_service.register_and_analyze_pet(
            name=compatibility_data.pet1_name,
            breed="믹스",  # 궁합 분석에서는 견종보다 오행이 중요
            gender="male",  # 임시값
            birth_date=compatibility_data.pet1_birth_date
        )
        
        pet2_analysis = pet_service.register_and_analyze_pet(
            name=compatibility_data.pet2_name,
            breed="믹스",
            gender="female",  # 임시값
            birth_date=compatibility_data.pet2_birth_date
        )
        
        # 궁합 분석
        compatibility_result = pet_service.get_compatibility(pet1_analysis, pet2_analysis)
        return compatibility_result
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"궁합 분석 중 오류 발생: {str(e)}"
        )

@router.get("/daily-fortune/{pet_name}",
            response_model=DailyFortuneResponse,
            responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
            summary="일일 운세 조회",
            description="등록된 반려견의 오늘 운세를 조회합니다.")
async def get_daily_fortune(pet_name: str, birth_date: str, target_date: str = None):
    """
    반려견의 일일 운세 조회
    
    - **pet_name**: 반려견 이름
    - **birth_date**: 반려견 생년월일 (YYYY-MM-DD)
    - **target_date**: 운세를 볼 날짜 (기본값: 오늘)
    """
    try:
        # 반려견 기본 분석 (캐시된 데이터가 있다면 그것을 사용하는 것이 좋음)
        pet_analysis = pet_service.register_and_analyze_pet(
            name=pet_name,
            breed="믹스",
            gender="male",
            birth_date=birth_date
        )
        
        # 일일 운세 분석
        fortune_result = pet_service.get_daily_fortune(pet_analysis, target_date)
        
        if "error" in fortune_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=fortune_result["error"]
            )
        
        return fortune_result
        
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
            detail=f"일일 운세 조회 중 오류 발생: {str(e)}"
        )

