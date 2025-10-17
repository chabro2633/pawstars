"""
반려견 등록 및 삼주 분석 통합 서비스
"""

from typing import Dict, Any, Optional
from datetime import datetime

from app.services.pillars_service import pillars_service
from app.services.five_elements import analyze_temperament
from app.services.shinsal_service import analyze_all_shinsal, get_shinsal_summary
from app.utils.ganzi_parser import parse_solar_ganzi, get_day_stem, get_all_branches

class PetService:
    
    def register_and_analyze_pet(self, name: str, breed: str, gender: str, birth_date: str) -> Dict[str, Any]:
        """
        반려견 등록 및 종합 삼주 분석
        
        Args:
            name: 반려견 이름
            breed: 견종
            gender: 성별 ("male" 또는 "female")
            birth_date: 생년월일 ("YYYY-MM-DD")
            
        Returns:
            종합 분석 결과 딕셔너리
        """
        try:
            # 1. 입력 데이터 검증
            self._validate_input(name, breed, gender, birth_date)
            
            # 2. 만세력에서 해당 날짜의 간지 조회
            pillars_data = pillars_service.get_pillars_by_date(birth_date)
            if not pillars_data:
                raise ValueError(f"해당 날짜({birth_date})의 만세력 정보를 찾을 수 없습니다.")
            
            # 3. 간지 파싱하여 삼주 추출
            pillars = parse_solar_ganzi(pillars_data["solar_ganzi"])
            
            # 4. 일간 추출 (오행 분석의 기준)
            day_stem = get_day_stem(pillars)
            
            # 5. 오행 및 성향 분석
            temperament_analysis = analyze_temperament(day_stem, breed)
            
            # 6. 신살 분석
            shinsal_results = analyze_all_shinsal(pillars)
            shinsal_summary = get_shinsal_summary(shinsal_results)
            
            # 7. 결과 통합
            result = {
                "name": name,
                "breed": breed,
                "gender": gender,
                "birth_date": birth_date,
                "pillars": pillars,
                "five_element": temperament_analysis["five_element"],
                "temperament": temperament_analysis["temperament"],
                "activity_tip": temperament_analysis["activity_tip"],
                "shinsal": {
                    shinsal_name: result["present"] 
                    for shinsal_name, result in shinsal_results.items()
                },
                "shinsal_details": shinsal_results,
                "shinsal_summary": shinsal_summary["summary"],
                "analysis_date": datetime.now().isoformat(),
                "jeolki": pillars_data.get("jeolki", "")
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"반려견 분석 중 오류 발생: {str(e)}")
    
    def _validate_input(self, name: str, breed: str, gender: str, birth_date: str):
        """
        입력 데이터 검증
        """
        if not name or not name.strip():
            raise ValueError("반려견 이름은 필수입니다.")
        
        if not breed or not breed.strip():
            raise ValueError("견종은 필수입니다.")
        
        if gender not in ["male", "female"]:
            raise ValueError("성별은 'male' 또는 'female'이어야 합니다.")
        
        try:
            birth_datetime = datetime.strptime(birth_date, "%Y-%m-%d")
            
            # 날짜 범위 검증 (너무 미래나 과거 날짜 방지)
            current_year = datetime.now().year
            birth_year = birth_datetime.year
            
            if birth_year < 1990:
                raise ValueError("생년월일이 너무 과거입니다. (1990년 이후만 지원)")
            
            if birth_year > current_year + 1:
                raise ValueError("생년월일이 미래입니다.")
                
        except ValueError as e:
            if "time data" in str(e):
                raise ValueError("생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD 형식 사용)")
            raise e
    
    def get_compatibility(self, pet1_data: Dict[str, Any], pet2_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        두 반려견의 궁합 분석 (추후 확장 기능)
        
        Args:
            pet1_data: 첫 번째 반려견 분석 결과
            pet2_data: 두 번째 반려견 분석 결과
            
        Returns:
            궁합 분석 결과
        """
        from app.services.five_elements import get_element_compatibility
        
        # 각각의 오행 추출
        element1 = pet1_data["five_element"].split("(")[0]  # "수(水)" -> "수"
        element2 = pet2_data["five_element"].split("(")[0]
        
        # 오행 상성 분석
        compatibility = get_element_compatibility(element1, element2)
        
        return {
            "pet1": {"name": pet1_data["name"], "element": pet1_data["five_element"]},
            "pet2": {"name": pet2_data["name"], "element": pet2_data["five_element"]},
            "compatibility": compatibility,
            "analysis_date": datetime.now().isoformat()
        }
    
    def get_daily_fortune(self, pet_data: Dict[str, Any], target_date: str = None) -> Dict[str, Any]:
        """
        일일 운세 분석 (추후 확장 기능)
        
        Args:
            pet_data: 반려견 분석 결과
            target_date: 운세를 볼 날짜 (기본값: 오늘)
            
        Returns:
            일일 운세 결과
        """
        if target_date is None:
            target_date = datetime.now().strftime("%Y-%m-%d")
        
        # 해당 날짜의 일진 조회
        daily_pillars = pillars_service.get_pillars_by_date(target_date)
        if not daily_pillars:
            return {"error": f"해당 날짜({target_date})의 운세 정보를 찾을 수 없습니다."}
        
        # 반려견의 일간과 오늘의 일간 비교
        pet_day_stem = get_day_stem(pet_data["pillars"])
        today_pillars = parse_solar_ganzi(daily_pillars["solar_ganzi"])
        today_day_stem = get_day_stem(today_pillars)
        
        # 간단한 운세 메시지 생성
        if pet_day_stem == today_day_stem:
            fortune_message = "오늘은 특히 컨디션이 좋고 활발한 하루가 될 것 같아요! 🌟"
        else:
            fortune_message = "평온하고 안정적인 하루를 보낼 수 있을 것 같아요. 😊"
        
        return {
            "pet_name": pet_data["name"],
            "target_date": target_date,
            "pet_day_stem": pet_day_stem,
            "today_day_stem": today_day_stem,
            "fortune_message": fortune_message,
            "daily_pillars": today_pillars,
            "jeolki": daily_pillars.get("jeolki", "")
        }

# 전역 인스턴스 생성
pet_service = PetService()

