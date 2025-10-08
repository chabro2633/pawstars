"""
만세력 기반 삼주(三柱) 계산 서비스
CSV 데이터를 활용하여 특정 날짜의 간지 정보를 조회
"""

import pandas as pd
from datetime import datetime
from typing import Dict, Optional
import os

class PillarsService:
    def __init__(self, csv_path: str = None):
        """
        만세력 서비스 초기화
        
        Args:
            csv_path: 만세력 CSV 파일 경로
        """
        if csv_path is None:
            # 기본 경로 설정
            current_dir = os.path.dirname(os.path.abspath(__file__))
            csv_path = os.path.join(current_dir, "..", "data", "final_crawled_df_만세력.csv")
        
        self.csv_path = csv_path
        self.df = None
        self._load_data()
    
    def _load_data(self):
        """
        CSV 데이터를 메모리에 로드
        """
        try:
            if not os.path.exists(self.csv_path):
                # CSV 파일이 없으면 샘플 데이터 생성
                self._create_sample_data()
            else:
                self.df = pd.read_csv(self.csv_path)
                print(f"만세력 데이터 로드 완료: {len(self.df)}행")
        except Exception as e:
            print(f"만세력 데이터 로드 실패: {e}")
            self._create_sample_data()
    
    def _create_sample_data(self):
        """
        테스트용 샘플 데이터 생성
        실제 운영시에는 GitHub에서 다운로드한 CSV를 사용
        """
        print("샘플 만세력 데이터 생성 중...")
        
        sample_data = [
            {"solar_date": "2021-12-01", "solar_ganzi": "辛丑年 己亥月 癸未日", "jeolki": ""},
            {"solar_date": "2021-12-02", "solar_ganzi": "辛丑年 己亥月 甲申日", "jeolki": ""},
            {"solar_date": "2021-12-03", "solar_ganzi": "辛丑年 己亥月 乙酉日", "jeolki": ""},
            {"solar_date": "2022-01-01", "solar_ganzi": "辛丑年 庚子月 戊午日", "jeolki": ""},
            {"solar_date": "2022-02-04", "solar_ganzi": "壬寅年 辛丑月 甲申日", "jeolki": "입춘"},
            {"solar_date": "2023-01-01", "solar_ganzi": "壬寅年 壬子月 癸卯日", "jeolki": ""},
            {"solar_date": "2023-12-01", "solar_ganzi": "癸卯年 癸亥月 丁巳日", "jeolki": ""},
            {"solar_date": "2024-01-01", "solar_ganzi": "癸卯年 甲子月 戊申日", "jeolki": ""},
            {"solar_date": "2024-12-01", "solar_ganzi": "甲辰年 乙亥月 辛亥日", "jeolki": ""},
        ]
        
        self.df = pd.DataFrame(sample_data)
        
        # 샘플 데이터를 CSV로 저장
        os.makedirs(os.path.dirname(self.csv_path), exist_ok=True)
        self.df.to_csv(self.csv_path, index=False, encoding='utf-8')
        print(f"샘플 데이터 저장: {self.csv_path}")
    
    def get_pillars_by_date(self, date_str: str) -> Optional[Dict[str, str]]:
        """
        특정 날짜의 삼주 정보 조회
        
        Args:
            date_str: "YYYY-MM-DD" 형식의 날짜
            
        Returns:
            {
                "solar_date": "2021-12-01",
                "solar_ganzi": "辛丑年 己亥月 癸未日",
                "jeolki": ""
            } 또는 None
        """
        if self.df is None:
            return None
        
        try:
            # 날짜 형식 검증
            datetime.strptime(date_str, "%Y-%m-%d")
            
            # 해당 날짜 조회
            result = self.df[self.df['solar_date'] == date_str]
            
            if result.empty:
                return None
            
            row = result.iloc[0]
            jeolki_value = row.get('jeolki', '')
            # NaN 값 처리
            if pd.isna(jeolki_value):
                jeolki_value = ''
            return {
                "solar_date": row['solar_date'],
                "solar_ganzi": row['solar_ganzi'],
                "jeolki": str(jeolki_value)
            }
            
        except ValueError as e:
            raise ValueError(f"Invalid date format: {date_str}. Expected YYYY-MM-DD")
        except Exception as e:
            raise Exception(f"Error querying pillars for date {date_str}: {str(e)}")
    
    def get_available_date_range(self) -> Dict[str, str]:
        """
        사용 가능한 날짜 범위 반환
        
        Returns:
            {"start_date": "1896-01-01", "end_date": "2050-12-31"}
        """
        if self.df is None or self.df.empty:
            return {"start_date": "2021-12-01", "end_date": "2024-12-01"}
        
        return {
            "start_date": self.df['solar_date'].min(),
            "end_date": self.df['solar_date'].max()
        }
    
    def search_by_ganzi(self, ganzi_pattern: str) -> list:
        """
        특정 간지 패턴으로 날짜 검색
        
        Args:
            ganzi_pattern: 검색할 간지 패턴 (예: "癸未日")
            
        Returns:
            매칭되는 날짜 리스트
        """
        if self.df is None:
            return []
        
        try:
            matches = self.df[self.df['solar_ganzi'].str.contains(ganzi_pattern, na=False)]
            return matches['solar_date'].tolist()
        except Exception as e:
            print(f"Error searching ganzi pattern '{ganzi_pattern}': {e}")
            return []

# 전역 인스턴스 생성
pillars_service = PillarsService()
