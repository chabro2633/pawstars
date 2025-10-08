"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Payload = {
  fortune: string | null;
  compatibility: string | null;
  dog: { name: string; breed: string; sex: string; neutered: boolean | null; birth: string | null };
  owner: { name: string; earthlyBranch: string };
};

function ResultInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textToShare = useMemo(() => {
    if (!data) return "";
    const d = data;
    return `🐶 PawStars 결과\n이름: ${d.dog.name}\n견종: ${d.dog.breed}\n${d.dog.birth ? `생일: ${d.dog.birth}\n` : ""}${d.dog.sex !== "unknown" ? `성별: ${d.dog.sex === "male" ? "수컷" : "암컷"}${d.dog.neutered === true ? " (중성화)" : d.dog.neutered === false ? " (미중성화)" : ""}\n` : ""}${d.owner?.name ? `주인: ${d.owner.name}\n` : ""}${d.owner?.earthlyBranch ? `주인 12지지: ${d.owner.earthlyBranch}\n` : ""}${d.fortune ? `\n오늘의 운세: \n${d.fortune}\n` : ""}${d.compatibility ? `\n🐾 궁합: \n${d.compatibility}` : ""}`;
  }, [data]);

  useEffect(() => {
    const key = params.get("key");
    if (!key) {
      setError("결과 키가 없어요. 처음부터 다시 진행해 주세요.");
      return;
    }
    try {
      const raw = sessionStorage.getItem(`pawstars:${key}`);
      if (!raw) {
        setError("저장된 결과를 찾을 수 없어요. 다시 진행해 주세요.");
        return;
      }
      const parsed = JSON.parse(raw) as Payload;
      setData(parsed);
    } catch {
      setError("결과를 불러오는 중 오류가 발생했어요.");
    }
  }, [params]);

  const share = async () => {
    if (!data) return;
    const text = textToShare;
    try {
      type KakaoTextShare = {
        objectType: "text";
        text: string;
        link: { mobileWebUrl: string; webUrl: string };
      };
      const w = globalThis as unknown as {
        Kakao?: { isInitialized?: () => boolean; Share: { sendDefault: (opts: KakaoTextShare) => void } };
      };
      if (w?.Kakao && w.Kakao.isInitialized?.()) {
        w.Kakao.Share.sendDefault({ objectType: "text", text, link: { mobileWebUrl: location.href, webUrl: location.href } });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "PawStars 결과", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      alert("결과를 클립보드에 복사했어요.");
    } catch {
      try {
        await navigator.clipboard.writeText(textToShare);
        alert("결과를 클립보드에 복사했어요.");
      } catch {
        alert("공유에 실패했어요. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full max-w-xl mx-auto px-4 py-5 sm:px-6 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">PawStars 결과</h1>
      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : !data ? (
        <div>불러오는 중...</div>
      ) : (
        <div className="space-y-6">
          {data.fortune ? (
            <div className="rounded-lg border border-black/10 dark:border-white/20 p-4 whitespace-pre-wrap leading-6">
              {data.fortune}
            </div>
          ) : null}
          {data.compatibility ? (
            <div className="rounded-lg border border-black/10 dark:border-white/20 p-4 whitespace-pre-wrap leading-6">
              {data.compatibility}
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              className="w-full sm:w-auto rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-3"
              onClick={() => router.push("/")}
            >
              다시 분석하기
            </button>
            <button
              className="w-full sm:w-auto rounded-md border border-black/10 dark:border-white/20 px-4 py-3"
              onClick={share}
            >
              결과 공유하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full max-w-xl mx-auto px-4 py-5 sm:px-6 sm:py-10">불러오는 중...</div>}>
      <ResultInner />
    </Suspense>
  );
}


