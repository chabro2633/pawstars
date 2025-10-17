"use client";

/**
 * ResultScreen.tsx
 * Figma Make 파일에서 추출된 결과 화면
 * 파일: https://www.figma.com/make/GJj0TWTrTDUFGhbS5UZq72/Pet-Fortune-App-Prototype
 */

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface ResultData {
  type: 'fortune' | 'compatibility';
  data: {
    name?: string;
    breed?: string;
    sex?: string;
    birthDate?: string;
    personality?: string;
    favoriteActivity?: string;
    specialNotes?: string;
    fortune?: string;
    saju?: string;
    dogName?: string;
    ownerName?: string;
    compatibility?: string;
    dogZodiac?: string;
    ownerZodiac?: string;
  };
  timestamp: string;
}

function ResultScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get('id');
  
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      const savedResult = localStorage.getItem(resultId);
      if (savedResult) {
        try {
          setResult(JSON.parse(savedResult));
        } catch (error) {
          console.error('Error parsing result:', error);
        }
      }
    }
    setLoading(false);
  }, [resultId]);

  const shareResult = () => {
    if (!result) return;

    const text = result.type === 'fortune' 
      ? `🔮 ${result.data.name}의 사주 분석 결과\n\n${result.data.fortune}`
      : `💕 ${result.data.dogName}와 ${result.data.ownerName}의 궁합\n\n${result.data.compatibility}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'PawStars 분석 결과',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('결과가 클립보드에 복사되었습니다!');
    }
  };

  const handleReAnalyze = () => {
    if (result?.type === 'fortune') {
      router.push('/pet-profile');
    } else {
      router.push('/owner-info');
    }
  };

  if (loading) {
    return (
      <div className="figma-loading-container">
        <div className="figma-spinner"></div>
        <p>결과를 불러오는 중...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="figma-error-container">
        <div className="figma-error-content">
          <div className="figma-error-icon">❌</div>
          <h2 className="figma-error-title">결과를 찾을 수 없습니다</h2>
          <p className="figma-error-description">
            분석 결과가 존재하지 않거나 만료되었습니다.
          </p>
          <Link href="/home">
            <button className="figma-primary-button">홈으로 돌아가기</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="figma-result-container">
      <div className="figma-result-frame">
        
        {/* 헤더 */}
        <div className="figma-screen-header">
          <button 
            className="figma-back-button"
            onClick={() => router.push('/home')}
          >
            ←
          </button>
          <h1 className="figma-screen-title">분석 결과</h1>
          <button 
            className="figma-share-header-button"
            onClick={shareResult}
          >
            📤
          </button>
        </div>

        {/* 결과 타입 헤더 */}
        <div className="figma-result-type-header">
          <div className="figma-result-type-icon">
            {result.type === 'fortune' ? '🔮' : '💕'}
          </div>
          <div className="figma-result-type-info">
            <h2 className="figma-result-type-title">
              {result.type === 'fortune' ? '사주 분석 결과' : '궁합 분석 결과'}
            </h2>
            <p className="figma-result-type-date">
              {new Date(result.timestamp).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* 결과 내용 */}
        <div className="figma-result-content">
          
          {result.type === 'fortune' ? (
            // 사주 분석 결과
            <div className="figma-fortune-result">
              {/* 반려견 정보 카드 */}
              <div className="figma-result-pet-card">
                <div className="figma-result-pet-avatar">🐕</div>
                <div className="figma-result-pet-info">
                  <h3 className="figma-result-pet-name">{result.data.name}</h3>
                  <div className="figma-result-pet-details">
                    <span>{result.data.breed}</span>
                    <span className="figma-divider">•</span>
                    <span>{result.data.sex === 'male' ? '수컷' : '암컷'}</span>
                    {result.data.birthDate && (
                      <>
                        <span className="figma-divider">•</span>
                        <span>{result.data.birthDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 사주 분석 섹션 */}
              <div className="figma-result-sections">
                <div className="figma-result-section">
                  <div className="figma-result-section-header">
                    <h4 className="figma-result-section-title">🔮 오늘의 운세</h4>
                  </div>
                  <div className="figma-result-section-content">
                    <p className="figma-result-text">{result.data.fortune}</p>
                  </div>
                </div>

                <div className="figma-result-section">
                  <div className="figma-result-section-header">
                    <h4 className="figma-result-section-title">📜 사주 분석</h4>
                  </div>
                  <div className="figma-result-section-content">
                    <p className="figma-result-text">{result.data.saju}</p>
                  </div>
                </div>

                {result.data.personality && (
                  <div className="figma-result-section">
                    <div className="figma-result-section-header">
                      <h4 className="figma-result-section-title">🎭 성격 특성</h4>
                    </div>
                    <div className="figma-result-section-content">
                      <p className="figma-result-text">{result.data.personality}</p>
                    </div>
                  </div>
                )}

                {result.data.favoriteActivity && (
                  <div className="figma-result-section">
                    <div className="figma-result-section-header">
                      <h4 className="figma-result-section-title">🎾 좋아하는 활동</h4>
                    </div>
                    <div className="figma-result-section-content">
                      <p className="figma-result-text">{result.data.favoriteActivity}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 궁합 분석 결과
            <div className="figma-compatibility-result">
              {/* 궁합 대상 카드 */}
              <div className="figma-compatibility-subjects">
                <div className="figma-compatibility-subject">
                  <div className="figma-subject-avatar">🐕</div>
                  <div className="figma-subject-info">
                    <h4 className="figma-subject-name">{result.data.dogName}</h4>
                    <p className="figma-subject-details">{result.data.dogZodiac}</p>
                  </div>
                </div>
                
                <div className="figma-compatibility-heart">💕</div>
                
                <div className="figma-compatibility-subject">
                  <div className="figma-subject-avatar">👤</div>
                  <div className="figma-subject-info">
                    <h4 className="figma-subject-name">{result.data.ownerName}</h4>
                    <p className="figma-subject-details">{result.data.ownerZodiac}</p>
                  </div>
                </div>
              </div>

              {/* 궁합 분석 섹션 */}
              <div className="figma-result-sections">
                <div className="figma-result-section">
                  <div className="figma-result-section-header">
                    <h4 className="figma-result-section-title">💕 궁합 분석</h4>
                  </div>
                  <div className="figma-result-section-content">
                    <p className="figma-result-text">{result.data.compatibility}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="figma-result-actions">
          <div className="figma-action-buttons">
            <button
              onClick={handleReAnalyze}
              className="figma-secondary-button"
            >
              🔄 다시 분석하기
            </button>
            <button
              onClick={shareResult}
              className="figma-primary-button"
            >
              📤 결과 공유하기
            </button>
          </div>
          
          <div className="figma-additional-actions">
            <Link href="/home">
              <button className="figma-text-button">🏠 홈으로 돌아가기</button>
            </Link>
            {result.type === 'fortune' && (
              <Link href="/owner-info">
                <button className="figma-text-button">💕 궁합도 분석해보기</button>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResultScreen() {
  return (
    <Suspense fallback={
      <div className="figma-loading-container">
        <div className="figma-spinner"></div>
        <p>결과를 불러오는 중...</p>
      </div>
    }>
      <ResultScreenContent />
    </Suspense>
  );
}