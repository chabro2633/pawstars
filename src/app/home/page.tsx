"use client";

/**
 * HomeScreen.tsx
 * Figma Make 파일에서 추출된 홈 화면
 * 파일: https://www.figma.com/make/GJj0TWTrTDUFGhbS5UZq72/Pet-Fortune-App-Prototype
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomeScreen() {
  return (
    <div className="figma-home-container">
      <div className="figma-home-frame">
        
        {/* 헤더 섹션 */}
        <div className="figma-home-header">
          <div className="figma-home-logo">
            <Image
              src="/pawstars_logo.jpg"
              alt="PawStars"
              width={60}
              height={60}
              className="figma-home-logo-image"
            />
            <div className="figma-home-logo-text">
              <h1 className="figma-home-title">PawStars</h1>
              <p className="figma-home-tagline">반려견 운세 & 궁합</p>
            </div>
          </div>
          
          <Link href="/pet-profile" className="figma-home-profile-button">
            <div className="figma-profile-icon">👤</div>
          </Link>
        </div>

        {/* 메인 카드 섹션 */}
        <div className="figma-home-main-section">
          <div className="figma-welcome-card">
            <div className="figma-welcome-content">
              <h2 className="figma-welcome-title">안녕하세요! 👋</h2>
              <p className="figma-welcome-description">
                반려견의 사주와 견주님과의 궁합을<br />
                AI로 정확하게 분석해드려요
              </p>
            </div>
            <div className="figma-welcome-illustration">
              <div className="figma-welcome-emoji">🐕✨</div>
            </div>
          </div>
        </div>

        {/* 서비스 메뉴 */}
        <div className="figma-home-services">
          <h3 className="figma-services-title">서비스 선택</h3>
          
          <div className="figma-services-grid">
            {/* 반려견 정보 등록 */}
            <Link href="/pet-info" className="figma-service-card-link">
              <div className="figma-service-card figma-service-primary">
                <div className="figma-service-icon">🐕</div>
                <div className="figma-service-content">
                  <h4 className="figma-service-title">반려견 등록</h4>
                  <p className="figma-service-description">
                    반려견 정보를 등록하고<br />
                    프로필을 만들어보세요
                  </p>
                </div>
                <div className="figma-service-arrow">→</div>
              </div>
            </Link>

            {/* 사주 분석 */}
            <Link href="/fortune" className="figma-service-card-link">
              <div className="figma-service-card">
                <div className="figma-service-icon">🔮</div>
                <div className="figma-service-content">
                  <h4 className="figma-service-title">사주 분석</h4>
                  <p className="figma-service-description">
                    반려견의 사주와<br />
                    오늘의 운세를 확인하세요
                  </p>
                </div>
                <div className="figma-service-arrow">→</div>
              </div>
            </Link>

            {/* 궁합 분석 */}
            <Link href="/compatibility" className="figma-service-card-link">
              <div className="figma-service-card">
                <div className="figma-service-icon">💕</div>
                <div className="figma-service-content">
                  <h4 className="figma-service-title">궁합 분석</h4>
                  <p className="figma-service-description">
                    견주님과 반려견의<br />
                    궁합을 분석해보세요
                  </p>
                </div>
                <div className="figma-service-arrow">→</div>
              </div>
            </Link>

            {/* 결과 보기 */}
            <Link href="/result" className="figma-service-card-link">
              <div className="figma-service-card">
                <div className="figma-service-icon">📊</div>
                <div className="figma-service-content">
                  <h4 className="figma-service-title">결과 보기</h4>
                  <p className="figma-service-description">
                    이전 분석 결과를<br />
                    다시 확인해보세요
                  </p>
                </div>
                <div className="figma-service-arrow">→</div>
              </div>
            </Link>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="figma-home-footer">
          <div className="figma-footer-stats">
            <div className="figma-stat-item">
              <div className="figma-stat-number">1,234</div>
              <div className="figma-stat-label">분석 완료</div>
            </div>
            <div className="figma-stat-divider"></div>
            <div className="figma-stat-item">
              <div className="figma-stat-number">98%</div>
              <div className="figma-stat-label">만족도</div>
            </div>
            <div className="figma-stat-divider"></div>
            <div className="figma-stat-item">
              <div className="figma-stat-number">4.8★</div>
              <div className="figma-stat-label">평점</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

