"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 스플래시 화면으로 리다이렉트
    router.replace("/splash");
  }, [router]);

  return (
    <div className="figma-loading-container">
      <div className="figma-spinner"></div>
    </div>
  );
}