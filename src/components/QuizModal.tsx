import React, { useState, useEffect } from "react";
import { X, Sparkles, Volume2, Award, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import lessonsData from "../data/lessons.json";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  char: string;
  correctRomaji: string;
  meaningTh: string;
  titleTh: string;
  options: string[];
}

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [quizMode, setQuizMode] = useState<"all" | "hiragana" | "katakana">("all");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filter lessons for single-letter Hiragana to quiz on
  const hiraganaLessons = lessonsData.filter(
    (l) => l.char && l.char.length === 1 && l.category === "Hiragana (ひらがな)"
  );

  // Filter lessons for single-letter Katakana to quiz on
  const katakanaLessons = lessonsData.filter(
    (l) => l.char && l.char.length === 1 && l.category === "Katakana (カタカナ)"
  );

  const targetLessons = (() => {
    if (quizMode === "hiragana") return hiraganaLessons;
    if (quizMode === "katakana") return katakanaLessons;
    return [...hiraganaLessons, ...katakanaLessons];
  })();

  const generateQuestion = () => {
    if (targetLessons.length === 0) return;

    // Pick a random lesson
    const randomIndex = Math.floor(Math.random() * targetLessons.length);
    const lesson = targetLessons[randomIndex];

    // Extract Romaji from title e.g. "ひらがな：あ (A)" => "A"
    const romajiMatch = lesson.title_ja.match(/\(([^)]+)\)/);
    const correctRomaji = romajiMatch ? romajiMatch[1].trim() : "";

    // Gather all other possible unique romajis as distractors
    const allOtherRomajis = targetLessons
      .map((l) => {
        const m = l.title_ja.match(/\(([^)]+)\)/);
        return m ? m[1].trim() : "";
      })
      .filter((r) => r && r !== correctRomaji);

    // Pick 3 unique random distractors
    const distractorSet = new Set<string>();
    while (distractorSet.size < 3 && allOtherRomajis.length > 0) {
      const randDist = allOtherRomajis[Math.floor(Math.random() * allOtherRomajis.length)];
      distractorSet.add(randDist);
    }
    const distractors = Array.from(distractorSet);

    // Shuffle options
    const options = [correctRomaji, ...distractors].sort(() => Math.random() - 0.5);

    setQuestion({
      id: lesson.id,
      char: lesson.char,
      correctRomaji,
      meaningTh: lesson.title_th,
      titleTh: lesson.title_th,
      options,
    });
    setSelectedOption(null);
    setIsCorrect(null);
    setAnswered(false);
  };

  // Sync state whenever quizMode or isOpen changes
  useEffect(() => {
    if (isOpen) {
      const streakKey = `quiz_streak_${quizMode}`;
      const scoreKey = `quiz_high_score_${quizMode}`;
      const savedStreak = localStorage.getItem(streakKey);
      const savedScore = localStorage.getItem(scoreKey);

      setStreak(savedStreak ? parseInt(savedStreak, 10) : 0);
      setHighScore(savedScore ? parseInt(savedScore, 10) : 0);
      generateQuestion();
    }
  }, [quizMode, isOpen]);

  const playTTS = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.startsWith("ja") || v.lang.includes("JP"));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSelectOption = (option: string) => {
    if (answered || !question) return;

    setSelectedOption(option);
    const correct = option === question.correctRomaji;
    setIsCorrect(correct);
    setAnswered(true);

    // Auto voice output on response for great phonetic experience
    playTTS(question.char);

    const streakKey = `quiz_streak_${quizMode}`;
    const scoreKey = `quiz_high_score_${quizMode}`;

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      localStorage.setItem(streakKey, nextStreak.toString());
      if (nextStreak > highScore) {
        setHighScore(nextStreak);
        localStorage.setItem(scoreKey, nextStreak.toString());
      }
    } else {
      setStreak(0);
      localStorage.setItem(streakKey, "0");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[#1c1a18] border border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-200 z-10 overflow-hidden font-sans"
        >
          {/* Subtle upper spotlight visual accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-800 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
                🎯
              </span>
              <div className="text-left">
                <h3 className="text-sm font-black text-stone-100 tracking-tight leading-none">
                  มินิควิซภาษาญี่ปุ่น
                </h3>
                <p className="text-[10px] text-stone-400 font-medium leading-none mt-1">
                  日本語クイズ (Japanese Character Quiz)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700 transition-all cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Streaks and Highscore Status Bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 bg-stone-900/50 border border-stone-800/60 rounded-xl px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                สถิติต่อเนื่อง
              </span>
              <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                <Sparkles size={11} className="animate-pulse" />
                {streak} 🔥
              </span>
            </div>
            <div className="flex-1 bg-stone-900/50 border border-stone-800/60 rounded-xl px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                คะแนนสูงสุด
              </span>
              <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                <Award size={11} />
                {highScore}
              </span>
            </div>
          </div>

          {/* Mode Selector Pill Toggle */}
          <div className="flex bg-stone-900/80 p-0.5 rounded-xl border border-stone-800/80 mb-5 relative">
            <button
              onClick={() => setQuizMode("all")}
              className={`flex-1 py-1 px-1 rounded-lg text-[9.5px] font-extrabold uppercase transition-all cursor-pointer ${
                quizMode === "all"
                  ? "bg-amber-500 text-stone-950 font-black shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              ทั้งหมด (ALL)
            </button>
            <button
              onClick={() => setQuizMode("hiragana")}
              className={`flex-1 py-1 px-1 rounded-lg text-[9.5px] font-extrabold uppercase transition-all cursor-pointer ${
                quizMode === "hiragana"
                  ? "bg-amber-500 text-stone-950 font-black shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              ฮิรางานะ (あ)
            </button>
            <button
              onClick={() => setQuizMode("katakana")}
              className={`flex-1 py-1 px-1 rounded-lg text-[9.5px] font-extrabold uppercase transition-all cursor-pointer ${
                quizMode === "katakana"
                  ? "bg-amber-500 text-stone-950 font-black shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              คาตาคานะ (ア)
            </button>
          </div>

          {question ? (
            <div className="space-y-6 text-center">
              {/* Question character display */}
              <div className="relative inline-flex items-center justify-center mx-auto">
                <div className="w-24 h-24 rounded-2xl bg-[#f7f4eb] border-2 border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/5 transition-all outline-none">
                  <span className="text-5xl font-extrabold text-[#111] font-sans">
                    {question.char}
                  </span>
                </div>
                <button
                  onClick={() => playTTS(question.char)}
                  className={`absolute -right-3 -bottom-3 p-2.5 rounded-full border shadow-md transition-all active:scale-90 cursor-pointer ${
                    isPlayingAudio
                      ? "bg-amber-500 border-amber-600 text-stone-950 animate-pulse"
                      : "bg-stone-900 border-stone-800 hover:border-stone-700 text-amber-400"
                  }`}
                  title="ฟังเสียงอ่านออกเสียงภาษาญี่ปุ่น"
                >
                  <Volume2 size={15} />
                </button>
              </div>

              {/* Thailand query translation */}
              <div className="space-y-1">
                <p className="text-xs text-stone-400">ตัวอักษรด้านบนนี้ออกเสียงสะกดในข้อใดถูกต้อง?</p>
                <p className="text-[10px] text-stone-550 italic block">
                  How do you read this Japanese character?
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {question.options.map((option, index) => {
                  let btnStyle = "bg-stone-900 border-stone-800/80 text-stone-300 hover:border-stone-700 hover:bg-stone-900/80";
                  
                  if (answered) {
                    const isCorrectOption = option === question.correctRomaji;
                    const isSelectedOption = option === selectedOption;

                    if (isCorrectOption) {
                      // Positive display showing correct option
                      btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/30 font-black";
                    } else if (isSelectedOption) {
                      // Negative displaying incorrect selected option
                      btnStyle = "bg-rose-500/15 border-rose-500 text-rose-400 ring-2 ring-rose-500/30";
                    } else {
                      btnStyle = "bg-stone-900/40 border-stone-800/40 text-stone-600 cursor-not-allowed opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={answered}
                      onClick={() => handleSelectOption(option)}
                      className={`py-3 rounded-xl border text-sm font-bold tracking-wide uppercase transition-all duration-150 relative ${
                        !answered ? "cursor-pointer active:scale-95" : ""
                      } ${btnStyle}`}
                    >
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedbacks Panel */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 text-left">
                      <div className={`p-3.5 rounded-xl border flex gap-3 ${
                        isCorrect 
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                          : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                      }`}>
                        <div className="mt-0.5 flex-shrink-0">
                          {isCorrect ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black">
                            {isCorrect ? "ยอดเยี่ยมครับ! ตอบถูกฝังความรู้ 🎉" : "น่าเสียดายจัง ลองทบทวนดูอีกรอบนะ!"}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-1">
                            อักขระ <strong>{question.char}</strong> อ้างอิงเสียงอ่านสากลคือ <strong>{question.correctRomaji}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={generateQuestion}
                        className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 cursor-pointer active:scale-95 transition-all"
                      >
                        <span>ควิซข้อถัดไป</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-12 text-center text-stone-400">
              <p>กำลังเตรียมโจทย์สนุกๆ ให้คุณประลองฝีมือ...</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
