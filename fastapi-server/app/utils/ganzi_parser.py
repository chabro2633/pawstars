"""
간지(干支) 파싱 유틸리티
"乙未年 戊子月 癸丑日" 형식의 문자열을 파싱하여 년주/월주/일주를 추출
"""

import re
from typing import Dict, Optional

def parse_solar_ganzi(ganzi_str: str) -> Dict[str, str]:
    """
    간지 문자열을 파싱하여 년주, 월주, 일주를 추출
    
    Args:
        ganzi_str: "乙未年 戊子月 癸丑日" 형식의 간지 문자열
        
    Returns:
        {"year": "乙未", "month": "戊子", "day": "癸丑"} 형태의 딕셔너리
    """
    try:
        # 정규표현식으로 년월일 간지 추출
        pattern = r'([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])年\s*([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])月\s*([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])日'
        
        match = re.match(pattern, ganzi_str.strip())
        if not match:
            raise ValueError(f"Invalid ganzi format: {ganzi_str}")
            
        year_pillar, month_pillar, day_pillar = match.groups()
        
        return {
            "year": year_pillar,
            "month": month_pillar,
            "day": day_pillar
        }
    except Exception as e:
        raise ValueError(f"Failed to parse ganzi string '{ganzi_str}': {str(e)}")

def extract_stems_and_branches(pillars: Dict[str, str]) -> Dict[str, Dict[str, str]]:
    """
    간지에서 천간과 지지를 분리하여 추출
    
    Args:
        pillars: {"year": "乙未", "month": "戊子", "day": "癸丑"}
        
    Returns:
        {
            "year": {"stem": "乙", "branch": "未"},
            "month": {"stem": "戊", "branch": "子"},
            "day": {"stem": "癸", "branch": "丑"}
        }
    """
    # 한자를 한글로 변환하는 매핑
    chinese_to_korean = {
        # 천간
        "甲": "갑", "乙": "을", "丙": "병", "丁": "정", "戊": "무",
        "己": "기", "庚": "경", "辛": "신", "壬": "임", "癸": "계",
        # 지지
        "子": "자", "丑": "축", "寅": "인", "卯": "묘", "辰": "진", "巳": "사",
        "午": "오", "未": "미", "申": "신", "酉": "유", "戌": "술", "亥": "해"
    }
    
    result = {}
    
    for pillar_type, ganzi in pillars.items():
        if len(ganzi) != 2:
            raise ValueError(f"Invalid ganzi length for {pillar_type}: {ganzi}")
            
        chinese_stem = ganzi[0]
        chinese_branch = ganzi[1]
        
        korean_stem = chinese_to_korean.get(chinese_stem)
        korean_branch = chinese_to_korean.get(chinese_branch)
        
        if not korean_stem or not korean_branch:
            raise ValueError(f"Unknown characters in ganzi: {ganzi}")
            
        result[pillar_type] = {
            "stem": korean_stem,
            "branch": korean_branch
        }
    
    return result

def get_day_stem(pillars: Dict[str, str]) -> str:
    """
    일간(日干) 추출 - 사주에서 가장 중요한 기준점
    
    Args:
        pillars: {"year": "乙未", "month": "戊子", "day": "癸丑"}
        
    Returns:
        일간 (예: "계")
    """
    stems_branches = extract_stems_and_branches(pillars)
    return stems_branches["day"]["stem"]

def get_all_branches(pillars: Dict[str, str]) -> list:
    """
    모든 지지를 리스트로 반환 (신살 판정용)
    
    Args:
        pillars: {"year": "乙未", "month": "戊子", "day": "癸丑"}
        
    Returns:
        ["미", "자", "축"] 형태의 지지 리스트
    """
    stems_branches = extract_stems_and_branches(pillars)
    return [
        stems_branches["year"]["branch"],
        stems_branches["month"]["branch"],
        stems_branches["day"]["branch"]
    ]
