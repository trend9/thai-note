import "dotenv/config";
import fs from "fs";
import path from "path";
import { compileLessons } from "../src/data/compile_lessons";

const LESSONS_DIR = path.join(process.cwd(), "src/data/lessons");

// Ensure directories exist
if (!fs.existsSync(LESSONS_DIR)) {
  fs.mkdirSync(LESSONS_DIR, { recursive: true });
}

function getNextLessonId(): number {
  try {
    const files = fs.readdirSync(LESSONS_DIR);
    const ids = files
      .map(f => {
        const match = f.match(/^(\d+)\.json$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((id): id is number => id !== null);

    if (ids.length === 0) return 1;
    return Math.max(...ids) + 1;
  } catch (error) {
    console.error("Error determining next lesson ID:", error);
    return 1;
  }
}

async function callLLM(prompt: string, colabUrl: string): Promise<any> {
  const systemInstruction = "You are a professional Japanese language educator who is native Japanese and fluent in Thai. Return ONLY a valid JSON object matching the requested schema. No markdown formatting, no code block backticks (do not wrap in ```json), just raw JSON.";
  colabUrl = colabUrl.replace(/\/$/, '');

  console.log(`🤖 Requesting LLM generation via local API...`);
  
  const response = await fetch(`${colabUrl}/generate/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_prompt: systemInstruction,
      user_prompt: prompt
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errText}`);
  }

  const data: any = await response.json();
  const content = data.result;
  if (!content) {
    throw new Error("Empty content returned from model.");
  }

  let jsonText = content.trim();
  const jsonStart = jsonText.indexOf('{');
  const jsonEnd = jsonText.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
  }
  return JSON.parse(jsonText);
}

// Fallback generator in case LLM is completely offline
function generateFallbackLesson(nextId: number): any {
  const fallbackLessons: Record<number, any> = {
    165: {
      id: 165,
      title_ja: "日常会話：はじめまして (Nice to meet you)",
      title_th: "การทักทายครั้งแรก: はじめまして (Hajimemashite)",
      category: "Conversation (会話)",
      category_th: "ระดับ 5: บทสนทนาในชีวิตประจำวัน",
      char: "はじめまして",
      stroke_count: 6,
      how_to_write_ja: "1. 挨拶として『はじめまして』を流暢に言う。2. 会釈を添える。",
      how_to_write_th: "1. เปล่งเสียง 'ฮาจิเมะมะชิเตะ' เมื่อแรกพบ 2. โค้งคำนับเล็กน้อยเพื่อแสดงความนอบน้อมตามธรรมเนียมญี่ปุ่น",
      important_phrases: [
        {
          phrase_ja: "はじめまして、ユートです。",
          romaji: "hajimemashite, yuuto desu",
          meaning_ja: "はじめまして、ユートです。",
          meaning_th: "ยินดีที่ได้รู้จักครับ ผมยูโตะครับ",
          hint: "ประโยคแนะนำตัวเองพื้นฐานในการเริ่มต้นบทสนทนา"
        },
        {
          phrase_ja: "よろしくおねがいします。",
          romaji: "yoroshiku onegaishimasu",
          meaning_ja: "よろしくお願いします。",
          meaning_th: "ขอฝากเนื้อฝากตัวด้วยนะครับ",
          hint: "คำลงท้ายยอดนิยมใช้พูดปิดท้ายการแนะนำตัวเองเสมอ"
        }
      ],
      explanation_th: "คำว่า <strong>はじめまして (Hajimemashite)</strong> มาจากคำกริยา 始める (hajimeru) ที่แปลว่าเริ่มต้น ใช้สำหรับการพบกันครั้งแรกในชีวิต เพื่อบอกความยินดีที่ได้ทำความรู้จัก",
      tip_th: "เมื่อพูดคำนี้ ควรประสานมือหรือวางมือแนบข้างลำตัว แล้วโค้งศีรษะประมาณ 15 องศาเพื่อเสริมบุคลิกภาพที่น่ารักประทับใจ",
      meta_description: "เรียนรู้วิธีแนะนำตัวภาษาญี่ปุ่นเบื้องต้นด้วยคำว่า はじめまして พร้อมสำเนียงและคำอธิบายสำหรับคนไทย"
    }
  };

  if (fallbackLessons[nextId]) {
    return fallbackLessons[nextId];
  }

  // Generic fallback if not in pre-defined list
  return {
    id: nextId,
    title_ja: `実用会話：表現の練習 (Lesson ${nextId})`,
    title_th: `ฝึกพูดประโยคจริง: บทที่ ${nextId}`,
    category: "Conversation (会話)",
    category_th: "ระดับ 5: บทสนทนาในชีวิตประจำวัน",
    char: "よろしく",
    stroke_count: 4,
    how_to_write_ja: "1. フレーズ全体を正しく発音する。",
    how_to_write_th: "1. ออกเสียงให้เป็นธรรมชาติ 2. เชื่อมคำช่วยให้อ่อนช้อยเสนาะหู",
    important_phrases: [
      {
        phrase_ja: "ありがとう。",
        romaji: "arigatou",
        meaning_ja: "ありがとう",
        meaning_th: "ขอบคุณนะ",
        hint: "คำขอบคุณแบบเป็นกันเองสำหรับเพื่อนหรือคนสนิท"
      }
    ],
    explanation_th: `บทเรียนเพื่อเลเวลอัปเรียนรู้การสื่อสารที่เป็นธรรมชาติประจำวัน เพื่อยกระดับความสามารถในการพูดภาษาญี่ปุ่นของคนไทยทีละขั้นตอน`,
    tip_th: "ฝึกฝนออกเสียงตามไฟล์เสียงซ้ำๆ เพื่อความคุ้นชินของรูปปากและกล้ามเนื้อลิ้น",
    meta_description: `เรียนรู้ภาษาญี่ปุ่นหน้าใหม่ประจำวัน บทที่ ${nextId} ติวเข้มสะกดคำและประโยคจำลอง`
  };
}

async function run() {
  const nextId = getNextLessonId();
  console.log(`Starting lesson generation for ID: ${nextId}...`);

  const topicsPool = [
    "Introducing yourself and sharing your hobbies (自己紹介と趣味)",
    "Ordering food and drinks at a sushi bar (寿司屋での注文)",
    "Asking for the price and paying at a convenience store (コンビニでの会計)",
    "Asking for directions to the train station (駅への行き方)",
    "Asking someone's name and where they are from (お名前と出身地の質問)",
    "Expressing likes and dislikes about Japanese food (日本食の好み)",
    "Telling the current time and asking for business hours (時間と営業時間の質問)",
    "Talking about your family members and their jobs (家族と仕事の話)",
    "Asking for recommendation at a clothing store (服屋でのおすすめの質問)",
    "Talking about today's weather and seasonal changes (今日の天気と季節の話)",
    "Making a polite request using '~てください' (～てくださいを使った依頼)",
    "Asking permission using '~てもいいですか' (～てもいいですかを使った許可)",
    "Expressing desires using '~たいです' (～たいですを使った願望)",
    "Talking about past weekend activities using past tense (週末の予定と過去形)",
    "Describing locations of objects using 'います/あります' (位置と存在の表現)"
  ];
  
  const selectedTopic = topicsPool[nextId % topicsPool.length];
  console.log(`Selected Topic: ${selectedTopic}`);

  let colabUrl = process.env.COLAB_API_URL;
  let lessonData: any = null;

  if (colabUrl) {
    const prompt = `Create a high-quality Japanese language learning lesson for Thai speakers to level up their skills.
This is Lesson ID ${nextId}.
Target Topic: ${selectedTopic}

Follow the schema strictly. Write the explanations, tips, meaning_th, and how_to_write_th in natural, polite Thai (ภาษาไทยที่เป็นธรรมชาติและสุภาพ).
Keep the character/word or grammar particle to learn in the "char" field (e.g. a key phrase like "はじめまして" or a particle like "は" or "ありがとう").
Make the "how_to_write_ja" explain the stroke/writing order or usage structure in Japanese.
Make the "how_to_write_th" explain how to write, say, or structure this phrase/grammar in Thai.

JSON Schema Required:
{
  "id": ${nextId},
  "title_ja": "Japanese lesson title with romaji/english hints (e.g. '日常会話：はじめまして (Nice to meet you)')",
  "title_th": "Thai lesson title (e.g. 'การทักทายครั้งแรก: はじめまして (Hajimemashite)')",
  "category": "e.g. Conversation (会話), Grammar (文法), or Vocabulary (単語)",
  "category_th": "e.g. 'ระดับ 5: บทสนทนาในชีวิตประจำวัน' or 'ระดับ 6: ไวยากรณ์น่ารู้'",
  "char": "The key word/phrase/character of the lesson",
  "stroke_count": 8,
  "how_to_write_ja": "Writing/usage explanation in Japanese",
  "how_to_write_th": "Writing/usage explanation in Thai",
  "important_phrases": [
    {
      "phrase_ja": "Japanese phrase",
      "romaji": "romaji pronunciation",
      "meaning_ja": "meaning in Kanji/Hiragana",
      "meaning_th": "meaning in Thai",
      "hint": "helpful hint/explanation in Thai"
    },
    {
      "phrase_ja": "Second Japanese phrase",
      "romaji": "romaji pronunciation",
      "meaning_ja": "meaning in Kanji/Hiragana",
      "meaning_th": "meaning in Thai",
      "hint": "helpful hint/explanation in Thai"
    }
  ],
  "explanation_th": "A detailed explanation of the grammar/word/culture in Thai (supports HTML tags like <strong>)",
  "tip_th": "Useful pronunciation, writing, or cultural tip in Thai",
  "meta_description": "SEO meta description in Thai"
}
`;

    try {
      lessonData = await callLLM(prompt, colabUrl);
    } catch (e) {
      console.error("Failed to generate via LLM, using fallback template.", e);
      lessonData = generateFallbackLesson(nextId);
    }
  } else {
    console.log("No COLAB_API_URL found. Using fallback generator.");
    lessonData = generateFallbackLesson(nextId);
  }

  // Ensure strict properties
  lessonData.id = nextId;

  // Write new file
  const newFilePath = path.join(LESSONS_DIR, `${nextId}.json`);
  fs.writeFileSync(newFilePath, JSON.stringify(lessonData, null, 2), "utf8");
  console.log(`Successfully generated and saved new lesson: ${newFilePath}`);

  // Run compilation
  console.log("Compiling all lessons...");
  compileLessons();
  console.log("Lessons compilation complete!");
}

run().catch(err => {
  console.error("Generator execution error:", err);
  process.exit(1);
});
