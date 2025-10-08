"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (!id) {
      setError('잘못된 결과 ID입니다.');
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(`pawstars_result_${id}`);
      if (!stored) {
        setError('결과를 찾을 수 없습니다. 결과가 만료되었거나 삭제되었을 수 있습니다.');
        setLoading(false);
        return;
      }

      const data = JSON.parse(stored) as ResultData;
      setResultData(data);
    } catch {
      setError('결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const share = async () => {
    if (!resultData) return;

    let text = `🐶 PawStars 결과\n`;
    
    if (resultData.type === 'fortune') {
      text += `이름: ${resultData.name}\n견종: ${resultData.breed}\n`;
      if (resultData.birthDate !== 'unknown') text += `생일: ${resultData.birthDate}\n`;
      text += `성별: ${resultData.sex === 'male' ? '수컷' : '암컷'}\n\n`;
      text += `🔮 오늘의 운세:\n${resultData.fortune}`;
    } else {
      text += `강아지: ${resultData.dogName} (${resultData.breed})\n`;
      text += `견주: ${resultData.ownerName}\n`;
      text += `12지지: ${resultData.ownerEB}\n\n`;
      text += `💕 궁합 분석:\n${resultData.compatibility}`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔮</div>
          <div>결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😕</div>
            <h1 className="text-xl font-bold mb-4">결과를 찾을 수 없어요</h1>
            <p className="text-white/60 mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/results')}
                className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                결과 페이지로 이동
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {resultData.type === 'fortune' ? '🔮 강아지 삼주' : '💕 견주 궁합'}
          </h1>
          <p className="text-white/60">
            {resultData.type === 'fortune' 
              ? `${resultData.name}의 분석 결과`
              : `${resultData.dogName} × ${resultData.ownerName} 궁합`
            }
          </p>
        </div>

        <div className="space-y-6">
          {/* Result Content */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            {resultData.type === 'fortune' ? (
              <div>
                <div className="mb-4 pb-4 border-b border-white/10">
                  <div className="text-sm text-white/60 space-y-1">
                    <div>이름: {resultData.name}</div>
                    <div>견종: {resultData.breed}</div>
                    <div>성별: {resultData.sex === 'male' ? '수컷' : '암컷'}</div>
                    {resultData.birthDate !== 'unknown' && (
                      <div>생일: {resultData.birthDate}</div>
                    )}
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                  {resultData.fortune}
                </div>
                {resultData.saju && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="text-sm font-medium text-white/80 mb-3">사주 분석</div>
                    <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                      {resultData.saju}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4 pb-4 border-b border-white/10">
                  <div className="text-sm text-white/60 space-y-1">
                    <div>강아지: {resultData.dogName} ({resultData.breed})</div>
                    <div>견주: {resultData.ownerName}</div>
                    <div>12지지: {resultData.ownerEB}</div>
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                  {resultData.compatibility}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={share}
              className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              📤 결과 공유하기
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/results')}
                className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                결과 목록
              </button>
              <button
                onClick={() => router.push(resultData.type === 'fortune' ? '/fortune' : '/compatibility')}
                className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                다시 분석
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
