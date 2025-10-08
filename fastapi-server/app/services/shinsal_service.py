"""
신살(神殺) 분석 서비스
삼주의 간지 조합을 바탕으로 각종 신살을 판정
"""

from typing import Dict, List, Any
from app.utils.mapping_tables import SHINSAL_RULES
from app.utils.ganzi_parser import extract_stems_and_branches

def check_yeokma_sal(branches: List[str]) -> bool:
    """
    역마살(驛馬殺) 판정
    지지에 인(寅), 신(申), 사(巳), 해(亥)가 있으면 역마살
    
    Args:
        branches: 년지, 월지, 일지 리스트
        
    Returns:
        역마살 여부
    """
    yeokma_branches = SHINSAL_RULES["역마살"]["branches"]
    return any(branch in yeokma_branches for branch in branches)

def check_dohwa_sal(branches: List[str]) -> bool:
    """
    도화살(桃花殺) 판정
    지지에 자(子), 오(午), 묘(卯), 유(酉)가 있으면 도화살
    
    Args:
        branches: 년지, 월지, 일지 리스트
        
    Returns:
        도화살 여부
    """
    dohwa_branches = SHINSAL_RULES["도화살"]["branches"]
    return any(branch in dohwa_branches for branch in branches)

def check_hwagae_sal(branches: List[str]) -> bool:
    """
    화개살(華蓋殺) 판정
    지지에 진(辰), 술(戌), 축(丑), 미(未)가 있으면 화개살
    
    Args:
        branches: 년지, 월지, 일지 리스트
        
    Returns:
        화개살 여부
    """
    hwagae_branches = SHINSAL_RULES["화개살"]["branches"]
    return any(branch in hwagae_branches for branch in branches)

def check_munchang_gwiin(day_stem: str) -> bool:
    """
    문창귀인(文昌貴人) 판정
    일간이 갑, 을, 병, 정이면 문창귀인
    
    Args:
        day_stem: 일간
        
    Returns:
        문창귀인 여부
    """
    munchang_stems = SHINSAL_RULES["문창귀인"]["stems"]
    return day_stem in munchang_stems

def check_cheondeok_gwiin(day_stem: str, month_branch: str) -> bool:
    """
    천덕귀인(天德貴人) 판정
    월지와 일간의 조합으로 판정
    
    Args:
        day_stem: 일간
        month_branch: 월지
        
    Returns:
        천덕귀인 여부
    """
    monthly_stems = SHINSAL_RULES["천덕귀인"]["monthly_stems"]
    
    if month_branch in monthly_stems:
        return day_stem in monthly_stems[month_branch]
    
    return False

def analyze_all_shinsal(pillars: Dict[str, str]) -> Dict[str, Any]:
    """
    모든 신살을 종합적으로 분석
    
    Args:
        pillars: {"year": "乙未", "month": "戊子", "day": "癸丑"}
        
    Returns:
        {
            "역마살": {"present": True, "description": "...", "effect": "..."},
            "도화살": {"present": False, "description": "...", "effect": "..."},
            ...
        }
    """
    # 간지에서 천간과 지지 추출
    stems_branches = extract_stems_and_branches(pillars)
    
    # 필요한 정보 추출
    day_stem = stems_branches["day"]["stem"]
    month_branch = stems_branches["month"]["branch"]
    all_branches = [
        stems_branches["year"]["branch"],
        stems_branches["month"]["branch"],
        stems_branches["day"]["branch"]
    ]
    
    # 각 신살 판정
    shinsal_results = {}
    
    # 역마살
    shinsal_results["역마살"] = {
        "present": check_yeokma_sal(all_branches),
        "description": SHINSAL_RULES["역마살"]["description"],
        "effect": SHINSAL_RULES["역마살"]["effect"]
    }
    
    # 도화살
    shinsal_results["도화살"] = {
        "present": check_dohwa_sal(all_branches),
        "description": SHINSAL_RULES["도화살"]["description"],
        "effect": SHINSAL_RULES["도화살"]["effect"]
    }
    
    # 화개살
    shinsal_results["화개살"] = {
        "present": check_hwagae_sal(all_branches),
        "description": SHINSAL_RULES["화개살"]["description"],
        "effect": SHINSAL_RULES["화개살"]["effect"]
    }
    
    # 문창귀인
    shinsal_results["문창귀인"] = {
        "present": check_munchang_gwiin(day_stem),
        "description": SHINSAL_RULES["문창귀인"]["description"],
        "effect": SHINSAL_RULES["문창귀인"]["effect"]
    }
    
    # 천덕귀인
    shinsal_results["천덕귀인"] = {
        "present": check_cheondeok_gwiin(day_stem, month_branch),
        "description": SHINSAL_RULES["천덕귀인"]["description"],
        "effect": SHINSAL_RULES["천덕귀인"]["effect"]
    }
    
    return shinsal_results

def get_shinsal_summary(shinsal_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    신살 분석 결과를 요약하여 반환
    
    Args:
        shinsal_results: analyze_all_shinsal 결과
        
    Returns:
        {
            "active_shinsal": ["역마살", "화개살"],
            "total_count": 2,
            "summary": "활동적이고 예술적인 성향이 강합니다"
        }
    """
    active_shinsal = []
    effects = []
    
    for shinsal_name, result in shinsal_results.items():
        if result["present"]:
            active_shinsal.append(shinsal_name)
            effects.append(result["effect"])
    
    # 요약 생성
    if not active_shinsal:
        summary = "특별한 신살은 없지만, 안정적이고 균형잡힌 성향을 가지고 있습니다"
    else:
        summary = " ".join(effects[:2])  # 최대 2개까지만 요약에 포함
        if len(effects) > 2:
            summary += f" 등 총 {len(active_shinsal)}가지 특별한 성향을 가지고 있습니다"
    
    return {
        "active_shinsal": active_shinsal,
        "total_count": len(active_shinsal),
        "summary": summary
    }
