"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { OwnerInfo } from '@/types';

export default function OwnerInfoScreen() {
  // Default owner data to prevent undefined errors
  const defaultOwnerInfo: OwnerInfo = {
    name: '',
    birthDate: '',
    gender: '',
    phoneNumber: '',
    address: '',
    email: ''
  };
  
  const ownerInfo = defaultOwnerInfo;
  const setOwnerInfo = (info: OwnerInfo) => {};
  const onNext = () => {};
  const onBack = () => {};
  // Traditional Korean time periods with their time ranges
  const timeSlots = [
    { value: 'ja', label: '자시(子時) 23:30–01:29' },
    { value: 'chuk', label: '축시(丑時) 01:30–03:29' },
    { value: 'in', label: '인시(寅時) 03:30–05:29' },
    { value: 'myo', label: '묘시(卯時) 05:30–07:29' },
    { value: 'jin', label: '진시(辰時) 07:30–09:29' },
    { value: 'sa', label: '사시(巳時) 09:30–11:29' },
    { value: 'o', label: '오시(午時) 11:30–13:29' },
    { value: 'mi', label: '미시(未時) 13:30–15:29' },
    { value: 'sin', label: '신시(申時) 15:30–17:29' },
    { value: 'yu', label: '유시(酉時) 17:30–19:29' },
    { value: 'sul', label: '술시(戌時) 19:30–21:29' },
    { value: 'hae', label: '해시(亥時) 21:30–23:29' }
  ];

  const isFormValid = () => {
    return (
      ownerInfo.name.trim() !== '' &&
      ownerInfo.gender !== '' &&
      ownerInfo.birthDate !== '' &&
      (ownerInfo.unknownBirthTime || ownerInfo.birthTimeSlot !== '')
    );
  };

  const handleUnknownTimeChange = (checked: boolean) => {
    setOwnerInfo({
      ...ownerInfo,
      unknownBirthTime: checked,
      birthTimeSlot: checked ? '' : ownerInfo.birthTimeSlot
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
          <h2 className="text-lg">보호자 정보 입력</h2>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>2단계</span>
          <span>3단계 중</span>
        </div>
        <div className="w-full bg-[#E5E5E5] rounded-full h-2">
          <div className="bg-[#D7EAFF] h-2 rounded-full w-2/3 transition-all duration-500"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-5">
        <div className="text-center mb-6">
          <h3 className="text-xl mb-2">보호자님의 정보를 입력해주세요 🧍‍♀️</h3>
          <p className="text-gray-600">궁합 분석을 위해 필요한 정보에요</p>
        </div>

        <Card className="p-6 space-y-5 rounded-2xl border border-[#EDEDED] shadow-sm bg-white">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="ownerName">이름</Label>
            <Input
              id="ownerName"
              value={ownerInfo.name}
              onChange={(e) => setOwnerInfo({ ...ownerInfo, name: e.target.value })}
              placeholder="보호자님의 이름을 입력해주세요"
              className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE]"
            />
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <Label>성별</Label>
            <RadioGroup
              value={ownerInfo.gender}
              onValueChange={(value: 'female' | 'male') => 
                setOwnerInfo({ ...ownerInfo, gender: value })
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2 bg-[#FFF3EE] p-3 rounded-xl border border-gray-200">
                <RadioGroupItem value="female" id="female-owner" />
                <Label htmlFor="female-owner" className="text-sm">여성</Label>
              </div>
              <div className="flex items-center space-x-2 bg-[#FFF3EE] p-3 rounded-xl border border-gray-200">
                <RadioGroupItem value="male" id="male-owner" />
                <Label htmlFor="male-owner" className="text-sm">남성</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="ownerBirthDate">생년월일</Label>
            <Input
              id="ownerBirthDate"
              type="date"
              value={ownerInfo.birthDate}
              onChange={(e) => setOwnerInfo({ ...ownerInfo, birthDate: e.target.value })}
              className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE]"
            />
          </div>

          {/* Birth Time */}
          <div className="space-y-3">
            <Label>태어난 시</Label>
            
            {/* Dropdown_BirthTime */}
            <Select
              value={ownerInfo.birthTimeSlot}
              onValueChange={(value) => setOwnerInfo({ ...ownerInfo, birthTimeSlot: value })}
              disabled={ownerInfo.unknownBirthTime}
            >
              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-[#FFF3EE] disabled:bg-gray-50 disabled:opacity-50">
                <SelectValue placeholder="태어난 시를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value} className="py-3">
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Checkbox for unknown time */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unknown-birth-time"
                checked={ownerInfo.unknownBirthTime}
                onCheckedChange={handleUnknownTimeChange}
                className="h-4 w-4 accent-[#FF8C69]"
              />
              <Label htmlFor="unknown-birth-time" className="text-sm text-gray-700">
                자세히 모름
              </Label>
            </div>
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
          결제하기
        </Button>
      </div>
    </div>
  );
}