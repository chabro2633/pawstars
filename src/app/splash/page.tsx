"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Sun } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <div className="text-4xl">🐶</div>,
      title: "반려견의 생일을 입력해요",
      description: "정확한 사주를 위해 생년월일이 필요해요"
    },
    {
      icon: <Star className="w-10 h-10 text-[#D7EAFF]" fill="#D7EAFF" />,
      title: "나와의 궁합을 확인해요",
      description: "우리는 얼마나 잘 맞는 사이일까요?"
    },
    {
      icon: <Sun className="w-10 h-10 text-[#D2F5E0]" />,
      title: "매일 운세로 하루를 열어요",
      description: "오늘 우리 반려견의 컨디션은 어떨까요?"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ marginTop: '48px' }}>
        <div className="mb-6">
          <div 
            className="w-[260px] h-[260px] rounded-full flex items-center justify-center mb-6 mx-auto overflow-hidden"
            data-component="Main_Mascot_Image"
            style={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <div className="text-6xl">🐾</div>
            </div>
          </div>
          <h1 className="text-3xl mb-2 text-[#222]">멍냥팔자</h1>
          <p className="text-[#666] text-lg">사주로 읽는 반려동물의 성향</p>
        </div>

        {/* Carousel */}
        <div className="w-full max-w-sm" style={{ marginBottom: '24px' }}>
          <Card className="p-6 bg-white border border-[#EDEDED] shadow-sm rounded-2xl min-h-[200px] flex flex-col items-center justify-center">
            <div className="mb-4">
              {slides[currentSlide].icon}
            </div>
            <h3 className="text-xl mb-3 text-center text-[#222]">
              {slides[currentSlide].title}
            </h3>
            <p className="text-[#666] text-center leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </Card>

          {/* Carousel indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-[#D7EAFF] w-6' : 'bg-[#E5E5E5]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pb-8">
        <Button
          onClick={() => router.push('/home')}
          className="w-full h-14 bg-[#D7EAFF] hover:bg-[#C2DDFF] text-[#222] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md"
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}