"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/transitions/PageTransition";
import { useHoverEffect } from "@/components/transitions/useInteractions";

export default function Home() {
  const { hoverProps: logoHoverProps } = useHoverEffect({
    transform: 'scale(1.05) rotate(5deg)',
    filter: 'brightness(1.1)'
  });

  const { hoverProps: buttonHoverProps } = useHoverEffect({
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 179, 71, 0.3)'
  });

  return (
    <PageTransition type="fade">
      <div className="min-h-screen" style={{ background: 'var(--pf-color-bg-primary)', color: 'var(--pf-color-text-primary)' }}>
        <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/pawstars_logo.jpg" 
              alt="PawStars Logo" 
              width={120}
              height={120}
              className="rounded-full object-cover"
              {...logoHoverProps}
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">PawStars</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            강아지의 사주와 견주와의 궁합을<br/>
            AI로 분석해보세요
          </p>
        </div>
        
        <div className="space-y-4 mb-12">
          <Link href="/fortune">
            <div className="pf-card pf-hover-lift pf-click-scale cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔮</div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">강아지 삼주</h2>
                  <p className="text-white/60 text-sm">
                    강아지의 이름, 견종, 성별, 생년월일로<br/>
                    사주와 오늘의 운세를 알아보세요
                  </p>
                </div>
                <div className="text-white/40 group-hover:text-white/60 transition-colors">
                  →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/compatibility">
            <div className="pf-card pf-hover-lift pf-click-scale cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="text-3xl">💕</div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">견주 궁합</h2>
                  <p className="text-white/60 text-sm">
                    강아지와 견주의 정보를 입력하여<br/>
                    12지지 기반 궁합을 분석해보세요
                  </p>
                </div>
                <div className="text-white/40 group-hover:text-white/60 transition-colors">
                  →
                </div>
              </div>
            </div>
          </Link>

          <Link href="/results">
            <div className="pf-card pf-hover-lift pf-click-scale cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="text-3xl">📊</div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">결과 보기</h2>
                  <p className="text-white/60 text-sm">
                    이전에 분석한 삼주와 궁합 결과를<br/>
                    다시 확인하고 공유할 수 있어요
                  </p>
                </div>
                <div className="text-white/40 group-hover:text-white/60 transition-colors">
                  →
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="space-y-6 mb-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-white/80">✨ 특별한 기능들</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="pf-card pf-hover-lift text-center" style={{ padding: 'var(--pf-spacing-4)' }}>
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium mb-1">AI 분석</div>
              <div className="text-xs text-white/60">OpenAI 기반 정확한 분석</div>
            </div>
            <div className="pf-card pf-hover-lift text-center" style={{ padding: 'var(--pf-spacing-4)' }}>
              <div className="text-2xl mb-2">💾</div>
              <div className="text-sm font-medium mb-1">결과 저장</div>
              <div className="text-xs text-white/60">브라우저에 결과 보관</div>
            </div>
            <div className="pf-card pf-hover-lift text-center" style={{ padding: 'var(--pf-spacing-4)' }}>
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm font-medium mb-1">카톡 공유</div>
              <div className="text-xs text-white/60">결과를 쉽게 공유</div>
            </div>
            <div className="pf-card pf-hover-lift text-center" style={{ padding: 'var(--pf-spacing-4)' }}>
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium mb-1">맞춤 분석</div>
              <div className="text-xs text-white/60">개별 특성 반영</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-white/40 text-sm mb-4">처음 사용하시나요?</div>
          <Link href="/fortune">
            <button className="pf-button-primary pf-animation-bounce w-full text-lg" {...buttonHoverProps}>
              🔮 강아지 삼주부터 시작하기
            </button>
          </Link>
        </div>
        </div>
      </div>
    </PageTransition>
  );
}