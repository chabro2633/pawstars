import { NextRequest } from "next/server";

type RequestBody = {
  name: string;
  breed: string;
  sex: "male" | "female";
  birthDate: string | null;
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { name, breed, sex, birthDate } = body || {};
  if (!name || !breed) {
    return new Response(JSON.stringify({ error: "name and breed are required" }), {
      status: 400,
    });
  }

  const openaiKey = process.env.OPENAI_API_KEY;

  const prompt = makePrompt({ name, breed, sex, birthDate });

  let fortune = fallbackFortune({ name, breed });

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
      if (content) fortune = content;
    } catch {
      // keep fallback
    }
  }

  return new Response(JSON.stringify({ fortune }), {
    headers: { "Content-Type": "application/json" },
  });
}

function makePrompt(input: RequestBody) {
  const sexKo = input.sex === "male" ? "수컷" : "암컷";
  const birth = input.birthDate ? input.birthDate : "모름";
  return [
    `강아지 사주와 오늘의 운세를 만들어줘.`,
    `이름: ${input.name}`,
    `견종: ${input.breed}`,
    `성별: ${sexKo}`,
    `생년월일: ${birth}`,
    "요청사항:",
    "- 오늘의 운세를 핵심 3~5가지 포인트로 간단히.",
    "- 건강, 산책/활동, 식사/간식, 교감/훈련 포인트를 포함.",
    "- 마지막에 하루 루틴 한 줄 조언.",
  ].join("\n");
}

function fallbackFortune({ name, breed }: { name: string; breed: string }) {
  const tips = [
    "오늘은 산책 길에 새로운 냄새가 가득! 코로 세상 탐험해요.",
    "물 충분히 마시기, 특히 활동량이 많다면 더 중요해요.",
    "간식은 평소보다 한 번 덜, 대신 칭찬은 두 배로!",
    "눈 마주치고 이름을 불러주는 시간이 좋은 교감이 돼요.",
    "가벼운 트릭 훈련으로 자신감을 높여보세요.",
  ];
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return (
    `🐾 ${name} (${breed})의 오늘의 운세\n` +
    `- ${pick(tips)}\n` +
    `- 실내 놀이와 휴식의 균형을 맞추면 좋아요.\n` +
    `- 새로운 사람/강아지와의 만남은 천천히, 안전하게.\n\n` +
    `오늘의 한 줄: 편안한 호흡으로 천천히, 서로의 리듬을 맞춰요.`
  );
}


