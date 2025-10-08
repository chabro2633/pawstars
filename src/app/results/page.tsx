"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FortuneData = {
  type: 'fortune';
  name: string;
  breed: string;
  sex: string;
  birthDate: string;
  fortune: string;
  saju?: string;
};

type CompatibilityData = {
  type: 'compatibility';
  dogName: string;
  breed: string;
  sex: string;
  birthDate: string;
  ownerName: string;
  ownerBirthDate: string;
  ownerBirthTime: string;
  ownerEB: string;
  compatibility: string;
};

type ResultData = FortuneData | CompatibilityData;

function ResultsInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [fortuneOpen, setFortuneOpen] = useState(true);
  const [compatibilityOpen, setCompatibilityOpen] = useState(true);
  const [storedFortune, setStoredFortune] = useState<FortuneData | null>(null);
  const [storedCompatibility, setStoredCompatibility] = useState<CompatibilityData | null>(null);

  // Generate unique ID for this result
  const generateResultId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Save to cookies
  const saveToStorage = useCallback((data: ResultData) => {
    const resultId = generateResultId();
    
    // Save to localStorage for persistence
    localStorage.setItem(`pawstars_result_${resultId}`, JSON.stringify(data));
    
    // Also update current stored data based on type
    if (data.type === 'fortune') {
      localStorage.setItem('pawstars_latest_fortune', JSON.stringify(data));
      setStoredFortune(data);
    } else {
      localStorage.setItem('pawstars_latest_compatibility', JSON.stringify(data));
      setStoredCompatibility(data);
    }
    
    // Update URL to include result ID
    const newUrl = `/results/${resultId}`;
    window.history.replaceState({}, '', newUrl);
    
    return resultId;
  }, []);

  // Load from storage
  const loadFromStorage = () => {
    try {
      const fortune = localStorage.getItem('pawstars_latest_fortune');
      const compatibility = localStorage.getItem('pawstars_latest_compatibility');
      
      if (fortune) {
        setStoredFortune(JSON.parse(fortune));
      }
      if (compatibility) {
        setStoredCompatibility(JSON.parse(compatibility));
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  };

  useEffect(() => {
    // Load existing data from storage
    loadFromStorage();

    // Check if we have URL parameters (new result)
    const type = params.get('type');
    if (type) {
      const data: Partial<ResultData> = { type: type as 'fortune' | 'compatibility' };
      
      // Get all URL parameters and build result data
      for (const [key, value] of params.entries()) {
        if (key !== 'type') {
          (data as Record<string, string>)[key] = value;
        }
      }
      
      if (data.type === 'fortune' && data.name && data.breed && data.fortune) {
        const fortuneData = data as FortuneData;
        saveToStorage(fortuneData);
      } else if (data.type === 'compatibility' && data.dogName && data.breed && data.compatibility) {
        const compatibilityData = data as CompatibilityData;
        saveToStorage(compatibilityData);
      }
    }
  }, [params, saveToStorage]);

  const share = async (data: ResultData) => {
    let text = `🐶 PawStars 결과\n`;
    
    if (data.type === 'fortune') {
      text += `이름: ${data.name}\n견종: ${data.breed}\n`;
      if (data.birthDate !== 'unknown') text += `생일: ${data.birthDate}\n`;
      text += `성별: ${data.sex === 'male' ? '수컷' : '암컷'}\n\n`;
      text += `🔮 오늘의 운세:\n${data.fortune}`;
    } else {
      text += `강아지: ${data.dogName} (${data.breed})\n`;
      text += `견주: ${data.ownerName}\n`;
      text += `12지지: ${data.ownerEB}\n\n`;
      text += `💕 궁합 분석:\n${data.compatibility}`;
    }

    try {
      // Try KakaoTalk first
      const w = globalThis as {
        Kakao?: { 
          isInitialized?: () => boolean; 
          Share: { 
            sendDefault: (opts: { objectType: string; text: string; link: { mobileWebUrl: string; webUrl: string } }) => void 
          } 
        };
      };
      if (w?.Kakao && w.Kakao.isInitialized?.()) {
        w.Kakao.Share.sendDefault({
          objectType: "text",
          text,
          link: { mobileWebUrl: location.href, webUrl: location.href }
        });
        return;
      }
      
      // Try Web Share API
      if (navigator.share) {
        await navigator.share({ title: "PawStars 결과", text });
        return;
      }
      
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
      alert("결과를 클립보드에 복사했어요.");
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        alert("결과를 클립보드에 복사했어요.");
      } catch {
        alert("공유에 실패했어요. 다시 시도해 주세요.");
      }
    }
  };

  const hasResults = storedFortune || storedCompatibility;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sticky Toggle Navigation */}
      {hasResults && (
        <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10 py-2">
          <div className="max-w-md mx-auto px-4">
            <div className="flex gap-2">
              {storedFortune && (
                <button
                  onClick={() => setFortuneOpen(!fortuneOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    fortuneOpen
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  🔮 삼주 {fortuneOpen ? '닫기' : '열기'}
                </button>
              )}
              {storedCompatibility && (
                <button
                  onClick={() => setCompatibilityOpen(!compatibilityOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    compatibilityOpen
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  💕 궁합 {compatibilityOpen ? '닫기' : '열기'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">📊 결과 보기</h1>
          <p className="text-white/60">분석 결과를 확인하세요</p>
        </div>

        {!hasResults ? (
          <div className="text-center py-12">
            <div className="text-white/60 mb-6">
              <div className="text-4xl mb-4">🔮</div>
              <p>아직 분석 결과가 없어요</p>
              <p className="text-sm mt-2">강아지 삼주나 궁합을 먼저 분석해보세요</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/fortune')}
                className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                🐕 강아지 삼주 보기
              </button>
              <button
                onClick={() => router.push('/compatibility')}
                className="w-full bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                💕 견주 궁합 보기
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Fortune Results */}
            {storedFortune && (
              <div className={`transition-all duration-300 ${fortuneOpen ? 'opacity-100' : 'opacity-50'}`}>
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        🔮 강아지 삼주
                      </h2>
                      <button
                        onClick={() => share(storedFortune)}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        공유하기
                      </button>
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      {storedFortune.name} ({storedFortune.breed}) • {storedFortune.sex === 'male' ? '수컷' : '암컷'}
                    </div>
                  </div>
                  {fortuneOpen && (
                    <div className="p-4">
                      <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                        {storedFortune.fortune}
                      </div>
                      {storedFortune.saju && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="text-sm font-medium text-white/80 mb-2">사주 분석</div>
                          <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                            {storedFortune.saju}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compatibility Results */}
            {storedCompatibility && (
              <div className={`transition-all duration-300 ${compatibilityOpen ? 'opacity-100' : 'opacity-50'}`}>
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        💕 견주 궁합
                      </h2>
                      <button
                        onClick={() => share(storedCompatibility)}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        공유하기
                      </button>
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      {storedCompatibility.dogName} × {storedCompatibility.ownerName} • {storedCompatibility.ownerEB}
                    </div>
                  </div>
                  {compatibilityOpen && (
                    <div className="p-4">
                      <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                        {storedCompatibility.compatibility}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => router.push('/fortune')}
                className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                🔮 새로운 삼주 분석
              </button>
              <button
                onClick={() => router.push('/compatibility')}
                className="w-full bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                💕 새로운 궁합 분석
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔮</div>
          <div>결과를 불러오는 중...</div>
        </div>
      </div>
    }>
      <ResultsInner />
    </Suspense>
  );
}
