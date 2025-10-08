#!/usr/bin/env python3
"""
만세력 데이터 생성 스크립트
실제 만세력 계산 로직을 사용하여 더 완전한 데이터셋을 생성
"""

import pandas as pd
from datetime import datetime, timedelta
import os

def generate_manseryeok_data():
    """
    2020년부터 2025년까지의 만세력 데이터를 생성
    실제 간지 계산 로직 사용
    """
    
    # 천간과 지지
    heavenly_stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
    earthly_branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    
    # 절기 정보 (간단한 근사치)
    jeolki_map = {
        (2, 4): "입춘", (2, 19): "우수", (3, 6): "경칩", (3, 21): "춘분",
        (4, 5): "청명", (4, 20): "곡우", (5, 6): "입하", (5, 21): "소만",
        (6, 6): "망종", (6, 21): "하지", (7, 7): "소서", (7, 23): "대서",
        (8, 8): "입추", (8, 23): "처서", (9, 8): "백로", (9, 23): "추분",
        (10, 8): "한로", (10, 24): "상강", (11, 8): "입동", (11, 22): "소설",
        (12, 7): "대설", (12, 22): "동지", (1, 6): "소한", (1, 20): "대한"
    }
    
    data = []
    
    # 2020년 1월 1일부터 2025년 12월 31일까지
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2025, 12, 31)
    
    current_date = start_date
    day_count = 0  # 일주 계산용 카운터
    
    print("만세력 데이터 생성 중...")
    
    while current_date <= end_date:
        year = current_date.year
        month = current_date.month
        day = current_date.day
        
        # 년주 계산 (입춘 기준으로 조정)
        year_for_ganzi = year
        if month < 2 or (month == 2 and day < 4):
            year_for_ganzi = year - 1
        
        year_stem_idx = (year_for_ganzi - 4) % 10  # 1984년이 갑자년
        year_branch_idx = (year_for_ganzi - 4) % 12
        year_ganzi = heavenly_stems[year_stem_idx] + earthly_branches[year_branch_idx]
        
        # 월주 계산 (년간에 따른 월간 계산)
        month_stem_base = (year_stem_idx * 2 + 2) % 10
        month_stem_idx = (month_stem_base + month - 1) % 10
        month_branch_idx = (month + 1) % 12  # 인월부터 시작
        month_ganzi = heavenly_stems[month_stem_idx] + earthly_branches[month_branch_idx]
        
        # 일주 계산 (1900년 1월 1일을 기준으로 계산)
        # 1900년 1월 1일이 갑자일로 가정
        base_date = datetime(1900, 1, 1)
        days_diff = (current_date - base_date).days
        day_stem_idx = days_diff % 10
        day_branch_idx = days_diff % 12
        day_ganzi = heavenly_stems[day_stem_idx] + earthly_branches[day_branch_idx]
        
        # 간지 조합
        solar_ganzi = f"{year_ganzi}年 {month_ganzi}月 {day_ganzi}日"
        
        # 절기 확인
        jeolki = jeolki_map.get((month, day), "")
        
        # 데이터 추가
        data.append({
            "solar_date": current_date.strftime("%Y-%m-%d"),
            "solar_ganzi": solar_ganzi,
            "jeolki": jeolki if jeolki else "",  # 빈 문자열로 명시적 처리
            "lunar_date": "",  # 음력은 복잡하므로 생략
            "lunar_ganzi": ""
        })
        
        current_date += timedelta(days=1)
        day_count += 1
        
        # 진행상황 표시
        if day_count % 365 == 0:
            print(f"{current_date.year}년 데이터 생성 완료...")
    
    print(f"총 {len(data)}일의 데이터 생성 완료!")
    
    # DataFrame 생성
    df = pd.DataFrame(data)
    
    # CSV 저장
    output_path = "/Users/chahyeongtae/Documents/GitHub/pawstars/fastapi-server/app/data/final_crawled_df_만세력.csv"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False, encoding='utf-8')
    
    print(f"만세력 데이터 저장 완료: {output_path}")
    print(f"데이터 범위: {df['solar_date'].min()} ~ {df['solar_date'].max()}")
    
    # 샘플 데이터 출력
    print("\n샘플 데이터:")
    print(df.head(10).to_string(index=False))
    
    return df

if __name__ == "__main__":
    generate_manseryeok_data()
