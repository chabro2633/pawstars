"use client";

/**
 * Pet Fortune App - New Fortune Page (Multi-Step)
 * Figma Make 파일에서 추출된 실제 디자인 기반
 * 3단계 폼: 1) 기본정보 2) 상세정보 3) 확인 및 분석
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveDogInfo, loadDogInfo, type DogInfo } from "@/utils/dogInfoStorage";

type Sex = "male" | "female";

const BREEDS: string[] = [
  "말티즈", "푸들", "포메라니안", "시추", "비숑 프리제", "요크셔테리어", "치와와", "닥스훈트",
  "미니핀", "스피츠", "코커스패니얼", "프렌치불독", "퍼그", "보스턴테리어", "미니어처슈나우저",
  "웰시코기 펨브로크", "웰시코기 카디건", "골든리트리버", "래브라도리트리버", "보더콜리",
  "사모예드", "시베리안허스키", "알래스칸말라뮤트", "저먼셰퍼드", "도베르만", "로트와일러",
  "불마스티프", "그레이트데인", "세인트버나드", "뉴펀들랜드", "달마시안", "아프간하운드",
  "그레이하운드", "이탈리안그레이하운드", "휘핏", "아키타", "시바견", "진돗개", "풍산개",
  "차우차우", "불테리어", "스태퍼드셔불테리어", "아메리칸불독", "잉글리시불독", "복서",
  "마스티프", "케인코르소", "프레사카나리오", "도고아르헨티노", "불독", "아메리칸핏불테리어"
];

export default function NewFortunePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 폼 데이터
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [personality, setPersonality] = useState("");
  const [favoriteActivity, setFavoriteActivity] = useState("");
  const [healthCondition, setHealthCondition] = useState("");
  
  // UI 상태
  const [breedSearch, setBreedSearch] = useState("");
  const [showBreedList, setShowBreedList] = useState(false);

  // 저장된 강아지 정보 불러오기
  useEffect(() => {
    const savedDogInfo = loadDogInfo();
    if (savedDogInfo) {
      setName(savedDogInfo.name);
      setBreed(savedDogInfo.breed);
      setSex(savedDogInfo.sex);
      setBirthYear(savedDogInfo.birthYear);
      setBirthMonth(savedDogInfo.birthMonth);
      setBirthDay(savedDogInfo.birthDay);
    }
  }, []);

  // 견종 필터링
  const filteredBreeds = BREEDS.filter(b => 
    b.toLowerCase().includes(breedSearch.toLowerCase())
  );

  const handleBreedSelect = (selectedBreed: string) => {
    setBreed(selectedBreed);
    setBreedSearch("");
    setShowBreedList(false);
  };

  // 단계별 유효성 검사
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return name.trim() !== "" && breed.trim() !== "";
      case 2:
        return true; // 2단계는 선택사항
      case 3:
        return true; // 3단계는 확인 단계
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      alert("필수 정보를 입력해주세요.");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submit = async () => {
    if (!validateStep(1)) {
      alert("필수 정보를 입력해주세요.");
      return;
    }

    // 강아지 정보를 쿠키에 저장
    const dogInfo: DogInfo = {
      name: name.trim(),
      breed: breed.trim(),
      sex,
      birthYear,
      birthMonth,
      birthDay
    };
    saveDogInfo(dogInfo);

    setLoading(true);

    try {
      const birthDate = (!birthYear || !birthMonth || !birthDay) ? null : 
        `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          breed: breed.trim(),
          sex,
          birthDate,
          personality,
          favoriteActivity,
          healthCondition
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const resultId = Date.now().toString();
        
        // localStorage에 결과 저장
        localStorage.setItem(`fortune_${resultId}`, JSON.stringify({
          type: 'fortune',
          data: {
            name: name.trim(),
            breed: breed.trim(),
            sex,
            birthDate,
            personality,
            favoriteActivity,
            healthCondition,
            fortune: result.fortune || "AI가 생성한 운세 정보",
            saju: result.saju || "AI가 생성한 사주 정보"
          },
          timestamp: new Date().toISOString()
        }));
        
        // 새로운 결과 페이지로 이동
        router.push(`/new-results?highlight=fortune_${resultId}`);
      } else {
        const error = await response.json();
        alert(`오류가 발생했습니다: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="figma-fortune-container">
      <div className="figma-fortune-frame">
        
        {/* 헤더 섹션 */}
        <div className="figma-fortune-header">
          <h1 className="figma-fortune-title">🐕 강아지 삼주</h1>
          <p className="figma-fortune-subtitle">강아지의 사주와 운세를 알아보세요</p>
          
          {/* 진행 표시기 */}
          <div className="figma-progress-container">
            <div className="figma-progress-bar">
              <div 
                className="figma-progress-fill" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
            <div className="figma-progress-text">
              {currentStep}단계 / 3단계
            </div>
          </div>
        </div>

        {/* 단계별 폼 */}
        <div className="figma-fortune-form">
          
          {/* 1단계: 기본 정보 */}
          {currentStep === 1 && (
            <div className="figma-step-container">
              <div className="figma-step-header">
                <h2 className="figma-step-title">1단계: 기본 정보</h2>
                <p className="figma-step-subtitle">강아지의 기본 정보를 입력해주세요</p>
              </div>

              {/* 이름과 견종 카드 */}
              <div className="figma-form-card">
                <h3 className="figma-form-card-title">이름과 견종</h3>
                
                {/* 강아지 이름 */}
                <div className="figma-form-group">
                  <label className="figma-form-label">강아지 이름 *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 뭉치, 초코, 별이"
                    className="figma-form-input"
                  />
                </div>

                {/* 견종 선택 */}
                <div className="figma-form-group">
                  <label className="figma-form-label">견종 *</label>
                  <div className="figma-breed-selector">
                    <input
                      type="text"
                      value={breed || breedSearch}
                      onChange={(e) => {
                        setBreedSearch(e.target.value);
                        setBreed("");
                        setShowBreedList(true);
                      }}
                      onFocus={() => setShowBreedList(true)}
                      placeholder="견종을 검색하거나 선택하세요"
                      className="figma-form-input"
                    />
                    
                    {showBreedList && breedSearch && (
                      <div className="figma-breed-dropdown">
                        {filteredBreeds.slice(0, 10).map((breedOption) => (
                          <div
                            key={breedOption}
                            className="figma-breed-option"
                            onClick={() => handleBreedSelect(breedOption)}
                          >
                            {breedOption}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* 수평 스크롤 견종 리스트 */}
                    <div className="figma-breed-scroll">
                      {BREEDS.slice(0, 20).map((breedOption) => (
                        <button
                          key={breedOption}
                          type="button"
                          onClick={() => handleBreedSelect(breedOption)}
                          className={`figma-breed-chip ${breed === breedOption ? 'active' : ''}`}
                        >
                          {breedOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 성별 카드 */}
              <div className="figma-form-card">
                <h3 className="figma-form-card-title">성별</h3>
                <div className="figma-radio-group">
                  <label className={`figma-radio-option ${sex === 'male' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="sex"
                      value="male"
                      checked={sex === "male"}
                      onChange={(e) => setSex(e.target.value as Sex)}
                    />
                    <span className="figma-radio-icon">♂️</span>
                    <span className="figma-radio-text">수컷</span>
                  </label>
                  <label className={`figma-radio-option ${sex === 'female' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="sex"
                      value="female"
                      checked={sex === "female"}
                      onChange={(e) => setSex(e.target.value as Sex)}
                    />
                    <span className="figma-radio-icon">♀️</span>
                    <span className="figma-radio-text">암컷</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 2단계: 상세 정보 */}
          {currentStep === 2 && (
            <div className="figma-step-container">
              <div className="figma-step-header">
                <h2 className="figma-step-title">2단계: 상세 정보</h2>
                <p className="figma-step-subtitle">더 정확한 분석을 위한 추가 정보 (선택사항)</p>
              </div>

              {/* 생년월일 카드 */}
              <div className="figma-form-card">
                <h3 className="figma-form-card-title">생년월일</h3>
                <div className="figma-date-group">
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="figma-form-select"
                  >
                    <option value="">년도</option>
                    {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </select>
                  
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="figma-form-select"
                  >
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{month}월</option>
                    ))}
                  </select>
                  
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="figma-form-select"
                  >
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}일</option>
                    ))}
                  </select>
                </div>
                <p className="figma-form-note">생년월일을 모르는 경우 비워두셔도 됩니다</p>
              </div>

              {/* 성격 카드 */}
              <div className="figma-form-card">
                <h3 className="figma-form-card-title">성격</h3>
                <div className="figma-form-group">
                  <label className="figma-form-label">강아지의 성격은 어떤가요?</label>
                  <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder="예: 활발하고 사람을 좋아해요. 다른 강아지들과도 잘 어울려요."
                    className="figma-form-textarea"
                    rows={3}
                  />
                </div>
              </div>

              {/* 좋아하는 활동 카드 */}
              <div className="figma-form-card">
                <h3 className="figma-form-card-title">좋아하는 활동</h3>
                <div className="figma-form-group">
                  <label className="figma-form-label">어떤 활동을 가장 좋아하나요?</label>
                  <input
                    type="text"
                    value={favoriteActivity}
                    onChange={(e) => setFavoriteActivity(e.target.value)}
                    placeholder="예: 산책, 공놀이, 수영, 간식 먹기"
                    className="figma-form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3단계: 확인 및 분석 */}
          {currentStep === 3 && (
            <div className="figma-step-container">
              <div className="figma-step-header">
                <h2 className="figma-step-title">3단계: 정보 확인</h2>
                <p className="figma-step-subtitle">입력하신 정보를 확인하고 분석을 시작하세요</p>
              </div>

              {/* 정보 요약 카드 */}
              <div className="figma-form-card">
                <h3 className="figma-form-card-title">입력 정보 요약</h3>
                
                <div className="figma-summary-grid">
                  <div className="figma-summary-item">
                    <span className="figma-summary-label">이름:</span>
                    <span className="figma-summary-value">{name}</span>
                  </div>
                  <div className="figma-summary-item">
                    <span className="figma-summary-label">견종:</span>
                    <span className="figma-summary-value">{breed}</span>
                  </div>
                  <div className="figma-summary-item">
                    <span className="figma-summary-label">성별:</span>
                    <span className="figma-summary-value">{sex === 'male' ? '수컷' : '암컷'}</span>
                  </div>
                  {(birthYear && birthMonth && birthDay) && (
                    <div className="figma-summary-item">
                      <span className="figma-summary-label">생년월일:</span>
                      <span className="figma-summary-value">{birthYear}년 {birthMonth}월 {birthDay}일</span>
                    </div>
                  )}
                  {personality && (
                    <div className="figma-summary-item">
                      <span className="figma-summary-label">성격:</span>
                      <span className="figma-summary-value">{personality}</span>
                    </div>
                  )}
                  {favoriteActivity && (
                    <div className="figma-summary-item">
                      <span className="figma-summary-label">좋아하는 활동:</span>
                      <span className="figma-summary-value">{favoriteActivity}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 건강 상태 카드 */}
              <div className="figma-form-card">
                <h3 className="figma-form-card-title">건강 상태 (선택사항)</h3>
                <div className="figma-form-group">
                  <label className="figma-form-label">특별한 건강 상태나 주의사항이 있나요?</label>
                  <textarea
                    value={healthCondition}
                    onChange={(e) => setHealthCondition(e.target.value)}
                    placeholder="예: 알레르기, 관절 문제, 특별한 식단 등"
                    className="figma-form-textarea"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="figma-navigation-section">
          <div className="figma-nav-buttons">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="figma-secondary-button"
              >
                ← 이전
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="figma-primary-button"
                disabled={!validateStep(currentStep)}
              >
                다음 →
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className={`figma-submit-button ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="figma-spinner"></div>
                    AI가 분석 중입니다...
                  </>
                ) : (
                  "🔮 삼주 분석 시작"
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}