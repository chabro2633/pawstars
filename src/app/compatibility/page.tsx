"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Sex = "male" | "female";

const BREEDS: string[] = [
  "말티즈",
"푸들",
"포메라니안",
"시추",
"비숑 프리제",
"요크셔테리어",
"치와와",
"닥스훈트",
"미니핀",
"스피츠",
"코커스패니얼",
"프렌치불독",
"퍼그",
"보스턴테리어",
"미니어처슈나우저",
"웰시코기 펨브로크",
"웰시코기 카디건",
"골든리트리버",
"래브라도리트리버",
"보더콜리",
"사모예드",
"시베리안허스키",
"알래스칸말라뮤트",
"저먼셰퍼드",
"도베르만",
"로트와일러",
"불마스티프",
"그레이트데인",
"세인트버나드",
"뉴펀들랜드",
"달마시안",
"아프간하운드",
"그레이하운드",
"이탈리안그레이하운드",
"휘핏",
"아키타",
"시바견",
"진돗개",
"풍산개",
"차우차우",
"불테리어",
"폭스테리어",
"잭러셀테리어",
"파슨러셀테리어",
"스코티시테리어",
"웨스트하이랜드화이트테리어",
"아이리시테리어",
"케언테리어",
"노퍽테리어",
"노리치테리어",
"베들링턴테리어",
"실리엄테리어",
"에어데일테리어",
"와이어폭스테리어",
"소프트코티드휘튼테리어",
"티베탄테리어",
"라사압소",
"페키니즈",
"차이니즈크레스티드",
"시체드 (시추+비숑)",
"코통드툴레아르",
"하바니즈",
"파피용",
"필라브라질레이로",
"카네코르소",
"보르도마스티프",
"티베탄마스티프",
"프레사카나리오",
"도고아르헨티노",
"벨지안말리노이즈",
"벨지안테뷰런",
"벨지안쉬펜도스",
"벨지안라케노이즈",
"올드잉글리시쉽독",
"셰틀랜드쉽독",
"버니즈마운틴독",
"그레이트피레니즈",
"레온베르거",
"아이리시세터",
"고든세터",
"잉글리시세터",
"브리타니스패니얼",
"아이리시워터스패니얼",
"스프링거스패니얼",
"클럼버스패니얼",
"필드스패니얼",
"서세스스패니얼",
"포인터",
"비즐라",
"와이마라너",
"로디지안리지백",
"바셋하운드",
"블러드하운드",
"비글",
"폭스하운드",
"오터하운드",
"해리어",
"아메리칸폭스하운드",
"트리잉워커쿤하운드",
"블랙앤탄쿤하운드",
"레드본쿤하운드",
"블루틱쿤하운드",
"플롯하운드",
"아메리칸잉글리시쿤하운드",
"보르조이",
"살루키",
"아이비잔하운드",
"파라오하운드",
"베이스니지",
"아자와크",
"슬루기",
"차트폴스키",
"타이간",
"헝가리안비즐라",
"와이어헤어드비즐라",
"저먼쇼트헤어드포인터",
"저먼와이어헤어드포인터",
"저먼롱헤어드포인터",
"체스키포인터",
"스몰먼스터랜더",
"라지먼스터랜더",
"드렌체포인터",
"푸델포인터",
"스피노네이탈리아노",
"브라코이탈리아노",
"브라코프랑세",
"아리에주아",
"부르보네",
"생제르맹포인터",
"오베르뉴포인터",
"피카르디스패니얼",
"퐁오드메르스패니얼",
"프랑세스패니얼",
"에파뇰브르통",
"블루피카르디스패니얼",
"노바스코샤덕톨링리트리버",
"체서피크베이리트리버",
"플랫코티드리트리버",
"컬리코티드리트리버",
"토이푸들",
"미니어처푸들",
"스탠다드푸들",
"킹찰스스패니얼",
"캐벌리어킹찰스스패니얼",
"잉글리시토이스패니얼",
"일본친",
"페키니즈",
"퍼그",
"브뤼셀그리펀",
"아펜핀셔",
"토이맨체스터테리어",
"미니어처핀셔",
"이탈리안그레이하운드",
"차이니즈크레스티드독",
"멕시칸헤어리스독",
"페루비안헤어리스독",
"아메리칸헤어리스테리어",
"라트테리어",
"테디루즈벨트테리어",
"아메리칸핏불테리어",
"아메리칸스태퍼드셔테리어",
"스태퍼드셔불테리어",
"불독",
"프렌치불독",
"아메리칸불독",
"올드잉글리시불독",
"빅토리안불독",
"컨티넨털불독",
"알라노에스파뇰",
"카오데카스트로라보레이로",
"카오데아구아",
"카오다세라다에스트렐라",
"카오데피라데가제네가",
"라페이로도알렌테조",
"포데엥고포르투게스",
"바르비도테르세이라",
"포르투기즈워터독",
"스패니시워터독",
"아메리칸워터스패니얼",
"아이리시워터스패니얼",
"라고토로마뇰로",
"바르베",
"푸들포인터",
"네덜란드코이케르혼제",
"노바스코샤덕톨링리트리버",
"뉴펀들랜드",
"랜드시어",
"카스트로라보레이로",
"에스트렐라마운틴독",
"라페이로도알렌테조",
"포데엥고포르투게스",
"아조레스캐틀독",
"포르투기즈쉽독",
"포르투기즈워터독",
"카오데아구아포르투게스",
"카오다세라다에스트렐라",
"카오데피라데가제네가",
"카오데카스트로라보레이로",
"바르비도테르세이라",
"라페이로도알렌테조",
"포데엥고포르투게스",
"아조레스캐틀독",
"포르투기즈쉽독"
];

const EARTHLY_BRANCHES = [
  { name: "자 (쥐)", value: "자" },
  { name: "축 (소)", value: "축" },
  { name: "인 (호랑이)", value: "인" },
  { name: "묘 (토끼)", value: "묘" },
  { name: "진 (용)", value: "진" },
  { name: "사 (뱀)", value: "사" },
  { name: "오 (말)", value: "오" },
  { name: "미 (양)", value: "미" },
  { name: "신 (원숭이)", value: "신" },
  { name: "유 (닭)", value: "유" },
  { name: "술 (개)", value: "술" },
  { name: "해 (돼지)", value: "해" },
];

export default function CompatibilityPage() {
  const router = useRouter();
  
  // Dog info
  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("");
  const [breedQuery, setBreedQuery] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [birthDate, setBirthDate] = useState("");
  const [unknownBirthDate, setUnknownBirthDate] = useState(false);

  // Owner info
  const [ownerName, setOwnerName] = useState("");
  const [ownerBirthDate, setOwnerBirthDate] = useState("");
  const [ownerBirthTime, setOwnerBirthTime] = useState("");
  const [ownerEB, setOwnerEB] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const filteredBreeds = useMemo(() => {
    if (!breedQuery.trim()) return [];
    return BREEDS.filter((b) =>
      b.toLowerCase().includes(breedQuery.toLowerCase())
    ).sort();
  }, [breedQuery]);

  const handleFocusScroll = useCallback((element: HTMLElement) => {
    setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  }, []);

  const calculateEarthlyBranch = (birthDate: string, birthTime: string) => {
    if (!birthDate) return "";
    
    const year = parseInt(birthDate.split('-')[0]);
    const hour = birthTime ? parseInt(birthTime.split(':')[0]) : 12;
    
    // 12지지 계산 (년도 기준)
    const yearEB = EARTHLY_BRANCHES[year % 12];
    
    // 시간대별 지지 (대략적 계산)
    const timeEBIndex = Math.floor(hour / 2) % 12;
    const timeEB = EARTHLY_BRANCHES[timeEBIndex];
    
    return `${yearEB.name} (${timeEB.name}시)`;
  };

  const onOwnerBirthChange = (date: string, time: string) => {
    const eb = calculateEarthlyBranch(date, time);
    setOwnerEB(eb);
  };

  const submitDogInfo = () => {
    if (!dogName.trim()) {
      alert("강아지 이름을 입력해주세요.");
      return;
    }
    if (!breed.trim()) {
      alert("견종을 입력해주세요.");
      return;
    }
    setStep(2);
  };

  const submitCompatibility = async () => {
    if (!ownerName.trim()) {
      alert("견주 이름을 입력해주세요.");
      return;
    }
    if (!ownerBirthDate.trim()) {
      alert("견주 생년월일을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dogName,
          breed,
          sex,
          birthDate: unknownBirthDate ? null : birthDate,
          ownerName,
          ownerBirthDate,
          ownerBirthTime,
          ownerEB,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get compatibility");
      }

      const data = await response.json();
      
      // Navigate to results page with compatibility data
      const params = new URLSearchParams({
        type: 'compatibility',
        dogName,
        breed,
        sex,
        birthDate: unknownBirthDate ? 'unknown' : birthDate,
        ownerName,
        ownerBirthDate,
        ownerBirthTime: ownerBirthTime || '',
        ownerEB,
        compatibility: data.compatibility
      });
      
      router.push(`/results?${params.toString()}`);
    } catch (error) {
      console.error("Error:", error);
      alert("궁합을 분석하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">💕 견주 궁합</h1>
          <p className="text-white/60">강아지와 견주의 궁합을 알아보세요</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {/* 강아지 정보 */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white">강아지 정보</h2>
              
              {/* 이름과 견종 */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">강아지 이름</label>
                  <input
                    className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none transition-colors text-base"
                    placeholder="예: 뭉치, 초코, 별이"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    onFocus={(e) => handleFocusScroll(e.currentTarget)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">견종</label>
                  <input
                    className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none transition-colors text-base"
                    placeholder="견종을 입력하거나 검색해보세요"
                    value={breedQuery}
                    onChange={(e) => {
                      setBreedQuery(e.target.value);
                      setBreed(e.target.value);
                    }}
                    onFocus={(e) => handleFocusScroll(e.currentTarget)}
                  />
                  {breedQuery.trim() && (
                    <div className="overflow-x-auto overflow-y-hidden mt-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch'}}>
                      <div className="flex gap-2 pb-2 nowrap" style={{width: 'max-content', minWidth: '100%', whiteSpace: 'nowrap'}}>
                        {filteredBreeds.slice(0, 20).map((b) => {
                          const selected = breed === b;
                          return (
                            <button
                              key={b}
                              type="button"
                              onClick={() => {
                                setBreed(b);
                                setBreedQuery(b);
                              }}
                              className={
                                "px-3 py-2 rounded-full border text-sm transition-colors shrink-0 whitespace-nowrap " +
                                (selected
                                  ? "bg-white text-black border-transparent"
                                  : "border-white/20 text-white/80 hover:bg-white/10")
                              }
                            >
                              {b}
                            </button>
                          );
                        })}
                        {filteredBreeds.length === 0 ? (
                          <span className="text-sm text-white/60 px-3 py-2 shrink-0">검색 결과가 없어요. 직접 입력해주세요.</span>
                        ) : filteredBreeds.length > 20 ? (
                          <span className="text-sm text-white/60 px-3 py-2 shrink-0">→ 더 많은 견종</span>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 성별 */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">성별</label>
                  <div className="overflow-x-auto overflow-y-hidden" style={{scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch'}}>
                    <div className="flex gap-2 nowrap" style={{width: 'max-content', minWidth: '100%'}}>
                      {[
                        { value: "male" as Sex, label: "수컷", icon: "♂️" },
                        { value: "female" as Sex, label: "암컷", icon: "♀️" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSex(option.value)}
                          className={
                            "px-4 py-3 rounded-md border transition-colors shrink-0 text-base " +
                            (sex === option.value
                              ? "bg-white text-black border-transparent"
                              : "border-white/20 text-white/80 hover:bg-white/10")
                          }
                        >
                          {option.icon} {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 생년월일 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">생년월일</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={unknownBirthDate}
                      onChange={(e) => setUnknownBirthDate(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-white focus:ring-white/30"
                    />
                    생년월일을 모르겠어요
                  </label>
                  
                  {!unknownBirthDate && (
                    <div className="flex gap-2">
                      <select
                        className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white focus:border-white/30 focus:outline-none text-base"
                        value={birthDate.split('-')[0] || ''}
                        onChange={(e) => {
                          const parts = birthDate.split('-');
                          const newDate = `${e.target.value}-${parts[1] || '01'}-${parts[2] || '01'}`;
                          setBirthDate(newDate);
                        }}
                      >
                        <option value="">년도</option>
                        {Array.from({ length: 20 }, (_, i) => 2024 - i).map((year) => (
                          <option key={year} value={year}>{year}년</option>
                        ))}
                      </select>
                      <select
                        className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white focus:border-white/30 focus:outline-none text-base"
                        value={birthDate.split('-')[1] || ''}
                        onChange={(e) => {
                          const parts = birthDate.split('-');
                          const newDate = `${parts[0] || '2020'}-${e.target.value.padStart(2, '0')}-${parts[2] || '01'}`;
                          setBirthDate(newDate);
                        }}
                      >
                        <option value="">월</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>{month}월</option>
                        ))}
                      </select>
                      <select
                        className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white focus:border-white/30 focus:outline-none text-base"
                        value={birthDate.split('-')[2] || ''}
                        onChange={(e) => {
                          const parts = birthDate.split('-');
                          const newDate = `${parts[0] || '2020'}-${parts[1] || '01'}-${e.target.value.padStart(2, '0')}`;
                          setBirthDate(newDate);
                        }}
                      >
                        <option value="">일</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>{day}일</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={submitDogInfo}
              className="w-full bg-white text-black py-4 px-6 rounded-lg font-medium text-lg hover:bg-white/90 transition-colors"
            >
              다음 단계 →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* 견주 정보 */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 text-white">견주 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">견주 이름</label>
                  <input
                    className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none transition-colors text-base"
                    placeholder="견주님의 이름을 입력해주세요"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    onFocus={(e) => handleFocusScroll(e.currentTarget)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">생년월일</label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white focus:border-white/30 focus:outline-none text-base"
                      value={ownerBirthDate.split('-')[0] || ''}
                      onChange={(e) => {
                        const parts = ownerBirthDate.split('-');
                        const newDate = `${e.target.value}-${parts[1] || '01'}-${parts[2] || '01'}`;
                        setOwnerBirthDate(newDate);
                        onOwnerBirthChange(newDate, ownerBirthTime);
                      }}
                    >
                      <option value="">년도</option>
                      {Array.from({ length: 80 }, (_, i) => 2024 - i).map((year) => (
                        <option key={year} value={year}>{year}년</option>
                      ))}
                    </select>
                    <select
                      className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white focus:border-white/30 focus:outline-none text-base"
                      value={ownerBirthDate.split('-')[1] || ''}
                      onChange={(e) => {
                        const parts = ownerBirthDate.split('-');
                        const newDate = `${parts[0] || '2020'}-${e.target.value.padStart(2, '0')}-${parts[2] || '01'}`;
                        setOwnerBirthDate(newDate);
                        onOwnerBirthChange(newDate, ownerBirthTime);
                      }}
                    >
                      <option value="">월</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>{month}월</option>
                      ))}
                    </select>
                    <select
                      className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white focus:border-white/30 focus:outline-none text-base"
                      value={ownerBirthDate.split('-')[2] || ''}
                      onChange={(e) => {
                        const parts = ownerBirthDate.split('-');
                        const newDate = `${parts[0] || '2020'}-${parts[1] || '01'}-${e.target.value.padStart(2, '0')}`;
                        setOwnerBirthDate(newDate);
                        onOwnerBirthChange(newDate, ownerBirthTime);
                      }}
                    >
                      <option value="">일</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>{day}일</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">태어난 시간 (선택사항)</label>
                  <input
                    type="time"
                    className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors text-base"
                    value={ownerBirthTime}
                    onChange={(e) => {
                      setOwnerBirthTime(e.target.value);
                      onOwnerBirthChange(ownerBirthDate, e.target.value);
                    }}
                    onFocus={(e) => handleFocusScroll(e.currentTarget)}
                  />
                </div>

                {ownerEB && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2 text-white/80">12지지</label>
                    <div className="text-white font-medium">{ownerEB}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white/10 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-white/20 transition-colors"
              >
                ← 이전
              </button>
              <button
                onClick={submitCompatibility}
                disabled={loading}
                className="flex-1 bg-white text-black py-4 px-6 rounded-lg font-medium text-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "분석 중..." : "💕 궁합 보기"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
