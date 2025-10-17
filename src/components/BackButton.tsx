'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  className?: string;
}

export default function BackButton({ href, className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-white/80 hover:text-white transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm">뒤로</span>
    </button>
  );
}
