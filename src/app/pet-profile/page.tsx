"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Heart, Shield } from 'lucide-react';
import { PetInfo } from '@/types';

export default function PetProfileScreen() {
  // Default petData data to prevent undefined errors
  const defaultPet: PetInfo = {
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    gender: '',
    sex: '',
    weight: 0,
    isNeutered: false,
    isVaccinated: false,
    isMicrochipped: false,
    personality: [],
    healthIssues: [],
    specialNeeds: ''
  };
  
  const petData = defaultPet;
  
  const formatBirthDate = () => {
    if (petData.unknownExactDate || !petData.birthYear) {
      return petData.birthYear ? `${petData.birthYear}년생` : '나이 모름';
    }
    if (petData.birthMonth && petData.birthDay) {
      return `${petData.birthYear}.${petData.birthMonth.padStart(2, '0')}.${petData.birthDay.padStart(2, '0')}`;
    }
    return `${petData.birthYear}년생`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-white border-b border-[#EDEDED]">
        <Button variant="ghost" size="icon" onClick={() => {}} className="mr-3 h-8 w-8 text-[#666]">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg text-[#222]">{petData.name} 프로필</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Pet Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">🐕</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#222]">{petData.name}</h2>
            <p className="text-[#666]">{petData.breed || '믹스견'}</p>
          </div>
        </div>

        {/* Basic Info */}
        <Card className="p-6 bg-white border border-[#EDEDED] rounded-2xl space-y-4">
          <h3 className="text-lg text-[#222]">기본 정보</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#666]" />
              <div>
                <p className="text-sm text-[#666]">생년월일</p>
                <p className="text-sm text-[#222]">{formatBirthDate()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Heart className="h-5 w-5 text-[#666]" />
              <div>
                <p className="text-sm text-[#666]">성별</p>
                <p className="text-sm text-[#222]">
                  {petData.sex === 'male' ? '남아' : petData.sex === 'female' ? '여아' : '정보 없음'}
                  {petData.isNeutered ? ' (중성화)' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-[#666]" />
              <div>
                <p className="text-sm text-[#666]">견종</p>
                <p className="text-sm text-[#222]">{petData.breed || '믹스견'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Personality Tags */}
        <Card className="p-6 bg-white border border-[#EDEDED] rounded-2xl space-y-4">
          <h3 className="text-lg text-[#222]">성격 특성</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm text-[#666] border border-[#EDEDED] rounded-[10px]">#독립적</span>
            <span className="px-3 py-1 text-sm text-[#666] border border-[#EDEDED] rounded-[10px]">#총명함</span>
            <span className="px-3 py-1 text-sm text-[#666] border border-[#EDEDED] rounded-[10px]">#애교쟁이</span>
            <span className="px-3 py-1 text-sm text-[#666] border border-[#EDEDED] rounded-[10px]">#활발함</span>
          </div>
        </Card>

        {/* Health Info */}
        <Card className="p-6 bg-white border border-[#EDEDED] rounded-2xl space-y-4">
          <h3 className="text-lg text-[#222]">건강 관리</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm text-[#666] border border-[#EDEDED] rounded-[10px]">고관절 주의</span>
            <span className="px-3 py-1 text-sm text-[#666] border border-[#EDEDED] rounded-[10px]">피부 관리</span>
            <span className="px-3 py-1 text-sm text-[#666] border border-[#EDEDED] rounded-[10px]">정기 검진</span>
          </div>
        </Card>
      </div>
    </div>
  );
}