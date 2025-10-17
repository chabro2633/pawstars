"""
오행(五行) 분석 서비스
일간을 기준으로 오행을 판정하고 성향을 분석
"""

from typing import Dict, Any
from app.utils.mapping_tables import HEAVENLY_STEMS, FIVE_ELEMENT_TRAITS, BREED_TRAITS

def get_five_element_from_stem(day_stem: str) -> str:
    """
    일간으로부터 오행 추출
    
    Args:
        day_stem: 일간 (예: "계")
        
    Returns:
        오행 (예: "수")
    """
    if day_stem not in HEAVENLY_STEMS:
        raise ValueError(f"Unknown day stem: {day_stem}")
    
    return HEAVENLY_STEMS[day_stem]["element"]

def get_element_traits(element: str) -> Dict[str, Any]:
    """
    오행별 성향 정보 반환
    
    Args:
        element: 오행 (예: "수")
        
    Returns:
        오행별 성향 정보 딕셔너리
    """
    if element not in FIVE_ELEMENT_TRAITS:
        raise ValueError(f"Unknown element: {element}")
    
    return FIVE_ELEMENT_TRAITS[element]

def get_breed_trait(breed: str) -> str:
    """
    견종별 기본 성향 반환
    
    Args:
        breed: 견종명
        
    Returns:
        견종별 성향 설명
    """
    # 견종명을 정규화 (공백 제거, 소문자 변환 등)
    normalized_breed = breed.strip()
    
    # 직접 매칭 시도
    if normalized_breed in BREED_TRAITS:
        return BREED_TRAITS[normalized_breed]
    
    # 부분 매칭 시도 (예: "토이푸들" -> "푸들")
    for breed_key in BREED_TRAITS:
        if breed_key in normalized_breed or normalized_breed in breed_key:
            return BREED_TRAITS[breed_key]
    
    # 매칭되지 않으면 기본값
    return BREED_TRAITS["믹스"]

def analyze_temperament(day_stem: str, breed: str) -> Dict[str, str]:
    """
    일간 오행 + 견종 특성을 결합하여 종합적인 성향 분석
    
    Args:
        day_stem: 일간 (예: "계")
        breed: 견종명
        
    Returns:
        {
            "five_element": "수(水)",
            "temperament": "감수성이 풍부하고 교감을 좋아하는 말티즈 타입",
            "activity_tip": "물놀이, 변화가 있는 활동을 좋아합니다 💧"
        }
    """
    # 오행 추출
    element = get_five_element_from_stem(day_stem)
    element_traits = get_element_traits(element)
    breed_trait = get_breed_trait(breed)
    
    # 오행 한자 표기
    element_display = {
        "목": "목(木)",
        "화": "화(火)", 
        "토": "토(土)",
        "금": "금(金)",
        "수": "수(水)"
    }
    
    # 성향 조합
    combined_temperament = f"{element_traits['personality']}하며, {breed_trait}"
    
    return {
        "five_element": element_display[element],
        "temperament": combined_temperament,
        "activity_tip": element_traits["activity_tips"]
    }

def get_element_compatibility(element1: str, element2: str) -> Dict[str, Any]:
    """
    두 오행 간의 상성 분석 (추후 궁합 기능용)
    
    Args:
        element1: 첫 번째 오행
        element2: 두 번째 오행
        
    Returns:
        상성 분석 결과
    """
    # 오행 상생/상극 관계
    generation_cycle = {
        "목": "화",  # 목생화
        "화": "토",  # 화생토
        "토": "금",  # 토생금
        "금": "수",  # 금생수
        "수": "목"   # 수생목
    }
    
    destruction_cycle = {
        "목": "토",  # 목극토
        "화": "금",  # 화극금
        "토": "수",  # 토극수
        "금": "목",  # 금극목
        "수": "화"   # 수극화
    }
    
    if generation_cycle[element1] == element2:
        return {"relationship": "상생", "compatibility": "매우 좋음", "description": f"{element1}이 {element2}를 도와줍니다"}
    elif generation_cycle[element2] == element1:
        return {"relationship": "상생", "compatibility": "좋음", "description": f"{element2}가 {element1}을 도와줍니다"}
    elif destruction_cycle[element1] == element2:
        return {"relationship": "상극", "compatibility": "주의", "description": f"{element1}이 {element2}를 억제합니다"}
    elif destruction_cycle[element2] == element1:
        return {"relationship": "상극", "compatibility": "주의", "description": f"{element2}가 {element1}을 억제합니다"}
    elif element1 == element2:
        return {"relationship": "동기", "compatibility": "보통", "description": "같은 오행으로 안정적입니다"}
    else:
        return {"relationship": "중성", "compatibility": "보통", "description": "특별한 상성은 없습니다"}

