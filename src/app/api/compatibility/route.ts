import { NextRequest } from "next/server";

type RequestBody = {
  dogName: string;
  dogBreed: string;
  dogSex: "male" | "female";
  dogBirthDate: string | null;
  ownerName: string;
  ownerBirthDate: string;
  ownerBirthTime: string | null;
  ownerYearZodiac: string;
  ownerTimeZodiac: string;
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (!body?.dogName || !body?.dogBreed || !body?.ownerName) {
    return new Response(JSON.stringify({ error: "missing required fields" }), { status: 400 });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const prompt = makePrompt(body);

  let compatibility = fallbackCompatibility(body);

  if (openaiKey) {
    try {
      const completion = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a friendly pet fortune teller. Respond in Korean." },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });
      if (!completion.ok) throw new Error(`OpenAI ${completion.status}`);
      type ChatCompletion = {
        choices?: Array<{
          message?: { content?: string };
        }>;
      };
      const data = (await completion.json()) as unknown as ChatCompletion;
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) compatibility = content;
    } catch {
      // keep fallback
    }
  }

  return new Response(JSON.stringify({ compatibility }), {
    headers: { "Content-Type": "application/json" },
  });
}

function makePrompt(body: RequestBody) {
  const sexKo = body.dogSex === "male" ? "수컷" : "암컷";
  const birth = body.dogBirthDate ? body.dogBirthDate : "모름";
  const ownerZodiac = `${body.ownerYearZodiac}${body.ownerTimeZodiac ? ` / ${body.ownerTimeZodiac}` : ''}`;
  return [
    `강아지-주인 궁합을 12지지를 참조하여 분석해줘.`,
    `강아지 이름: ${body.dogName}`,
    `견종: ${body.dogBreed}`,
    `성별: ${sexKo}`,
    `생년월일: ${birth}`,
    `주인 이름: ${body.ownerName}`,
    `주인 12지지: ${ownerZodiac}`,
    `주인 생년월일: ${body.ownerBirthDate}`,
    `주인 태어난 시간: ${body.ownerBirthTime || "모름"}`,
    "요청사항:",
    "- 궁합 총평 2~3문장.",
    "- 함께하면 좋은 활동 2~3가지.",
    "- 주의할 점 2가지.",
    "- 마지막에 한 줄 조언.",
  ].join("\n");
}

function fallbackCompatibility(body: RequestBody) {
  const positives = [
    "교감이 빠르게 형성되고 일상 리듬이 잘 맞아요.",
    "산책 템포가 비슷해 스트레스가 적어요.",
    "훈련 시 칭찬 반응이 좋아 성장세가 뚜렷해요.",
  ];
  const cautions = [
    "규칙이 흔들리면 금방 루틴이 무너질 수 있어요.",
    "간식 의존도가 올라가지 않도록 주기를 조절하세요.",
    "새로운 환경에서는 천천히 적응 시간을 주세요.",
  ];
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return (
    `💞 ${body.dogName} × ${body.ownerName} 궁합\n` +
    `총평: ${pick(positives)}\n\n` +
    `함께하면 좋아요: 산책 루트 탐험, 냄새 놀이, 조용한 교감 시간\n` +
    `주의할 점: ${pick(cautions)}\n\n` +
    `한 줄 조언: 서로의 페이스를 존중하면 매일이 편안해져요.`
  );
}




