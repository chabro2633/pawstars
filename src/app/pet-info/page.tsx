"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PetInfo } from '@/types';

interface PetInfoScreenProps {
  petInfo: PetInfo;
  setPetInfo: (info: PetInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PetInfoScreen({ petInfo, setPetInfo, onNext, onBack }: PetInfoScreenProps) {
  // Default pet data to prevent undefined errors
  const defaultPetInfo: PetInfo = {
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
  
  const currentPetData = petInfo || defaultPetInfo;
  const dogBreeds = [
    '골든 리트리버', '래브라도 리트리버', '웰시코기', '비글', '포메라니안',
    '말티즈', '푸들', '요크셔테리어', '치와와', '시바견', '진돗개', '기타'
  ];

  // Generate year options (current year down to 1990)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear - i).toString());
  
  // Generate month and day options
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const isFormValid = () => {
    const nameValid = currentPetData.name.trim() !== '';
    const breedValid = currentPetData.breed !== '' && (currentPetData.breed !== '기타' || currentPetData.customBreed?.trim() !== '');
    const sexValid = currentPetData.sex !== '';
    
    // Birth date validation
    const yearValid = currentPetData.birthYear !== '';
    const dateValid = currentPetData.unknownExactDate ? 
      yearValid : 
      (yearValid && currentPetData.birthMonth !== '' && currentPetData.birthDay !== '');

    return nameValid && breedValid && sexValid && dateValid;
  };

  const handleUnknownExactDateChange = (checked: boolean) => {
    setPetInfo({ 
      ...currentPetData, 
      unknownExactDate: checked,
      birthMonth: checked ? '' : currentPetData.birthMonth,
      birthDay: checked ? '' : currentPetData.birthDay
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-[#EDEDED] bg-white">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg">반려동물 정보 입력</h2>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>1단계</span>
          <span>3단계 중</span>
        </div>
        <div className="w-full bg-[#E5E5E5] rounded-full h-2">
          <div className="bg-[#D7EAFF] h-2 rounded-full w-1/3 transition-all duration-500"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-5">
        <div className="text-center mb-6">
          <h3 className="text-xl mb-2">반려견의 정보를 알려주세요 🐕</h3>
          <p className="text-gray-600">정확한 분석을 위해 필요한 정보에요</p>
        </div>

        <Card className="p-6 space-y-5 rounded-2xl border border-[#EDEDED] shadow-sm bg-white">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={currentPetData.name}
              onChange={(e) => setPetInfo({ ...currentPetData, name: e.target.value })}
              placeholder="반려견의 이름을 입력해주세요"
              className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE]"
            />
          </div>

          {/* Field_Birth */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Label>생년월일</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent side="right" align="start" className="max-w-[200px]">
                    <p className="text-sm leading-normal text-gray-600 break-words">
                      생일을 모르는 경우 결과가 정확하지 않을 수 있어요.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Checkbox below tooltip */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unknown-exact-date-top"
                checked={currentPetData.unknownExactDate}
                onCheckedChange={handleUnknownExactDateChange}
                className="h-4 w-4 accent-[#FF8C69]"
              />
              <Label htmlFor="unknown-exact-date-top" className="text-sm text-gray-700">
                정확한 날짜는 모름
              </Label>
            </div>

            {/* Controls_Row */}
            <div className="flex items-center space-x-2">
              {/* Dropdown_Year */}
              <div className="min-w-[100px]">
                <Select
                  value={currentPetData.birthYear}
                  onValueChange={(value) => setPetInfo({ ...currentPetData, birthYear: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE]">
                    <SelectValue placeholder="연도" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dropdown_Month */}
              {!currentPetData.unknownExactDate && (
                <div className="min-w-[80px]">
                  <Select
                    value={currentPetData.birthMonth}
                    onValueChange={(value) => setPetInfo({ ...currentPetData, birthMonth: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE]">
                      <SelectValue placeholder="월" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Dropdown_Day */}
              {!currentPetData.unknownExactDate && (
                <div className="min-w-[80px]">
                  <Select
                    value={currentPetData.birthDay}
                    onValueChange={(value) => setPetInfo({ ...currentPetData, birthDay: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE]">
                      <SelectValue placeholder="일" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}


            </div>
          </div>

          {/* Field_Sex */}
          <div className="space-y-3">
            <Label>성별</Label>
            <RadioGroup
              value={currentPetData.sex}
              onValueChange={(value: 'male' | 'female') => 
                setPetInfo({ ...currentPetData, sex: value })
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2 bg-[#FFF3EE] p-3 rounded-xl border border-gray-200">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="text-sm">수컷</Label>
              </div>
              <div className="flex items-center space-x-2 bg-[#FFF3EE] p-3 rounded-xl border border-gray-200">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="text-sm">암컷</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Field_Neuter */}
          <div className="space-y-3">
            <Label>중성화 여부</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="neutered"
                checked={currentPetData.isNeutered}
                onCheckedChange={(checked) => setPetInfo({ ...currentPetData, isNeutered: !!checked })}
              />
              <Label htmlFor="neutered" className="text-sm">중성화 했어요</Label>
            </div>
          </div>

          {/* Breed */}
          <div className="space-y-2">
            <Label htmlFor="breed">견종</Label>
            <Select
              value={currentPetData.breed}
              onValueChange={(value) => setPetInfo({ ...currentPetData, breed: value, customBreed: '' })}
            >
              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE]">
                <SelectValue placeholder="견종을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {dogBreeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentPetData.breed === '기타' && (
              <Input
                value={currentPetData.customBreed || ''}
                onChange={(e) => setPetInfo({ ...currentPetData, customBreed: e.target.value })}
                placeholder="견종을 직접 입력해주세요"
                className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE] mt-2"
              />
            )}
          </div>
        </Card>
      </div>

      {/* Next Button */}
      <div className="p-6">
        <Button
          onClick={onNext}
          disabled={!isFormValid()}
          className="w-full h-14 bg-[#D7EAFF] hover:bg-[#C2DDFF] disabled:bg-[#E5E5E5] disabled:opacity-40 text-[#222] rounded-2xl shadow-sm transition-all duration-300"
        >
          다음으로
        </Button>
      </div>
    </div>
  );
}