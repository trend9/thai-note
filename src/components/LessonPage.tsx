import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import NotebookLayout from "./NotebookLayout";
import lessonsData from "../data/lessons.json";
import { Sparkles, Calendar, BookOpen, AlertCircle, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lessonId = parseInt(id || "1", 10);
  const totalLessons = lessonsData.length;

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [activePlayingIdx, setActivePlayingIdx] = useState<number | null>(null);

  const playTTS = (text: string, idx: number) => {
    if (!window.speechSynthesis) {
      console.warn("TTS is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    
    // Clean text from any special hints if needed
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85; // Natural speed for effective learning pronunciation
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.startsWith("ja") || v.lang.includes("JP"));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    utterance.onstart = () => {
      setActivePlayingIdx(idx);
    };
    utterance.onend = () => {
      setActivePlayingIdx(null);
    };
    utterance.onerror = () => {
      setActivePlayingIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  };
  
  // アニメーションの方向（右からスライドアラウンドか左からか）を算出
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const prevIdRef = useRef<number>(lessonId);

  // IDが変わったときに移動方向を保存
  useEffect(() => {
    if (lessonId > prevIdRef.current) {
      setSlideDirection("next");
    } else if (lessonId < prevIdRef.current) {
      setSlideDirection("prev");
    }
    prevIdRef.current = lessonId;
  }, [lessonId]);

  // レッスンデータ取得
  const lesson = lessonsData.find((l) => l.id === lessonId);

  // Sync page title & description with browser during client-side navigation
  useEffect(() => {
    if (lesson) {
      document.title = `หน้าสอนที่ ${lesson.id}: ${lesson.char}『${lesson.title_ja}』เรียนคัดออกเสียง (${lesson.title_th}) - 1日1ページ手帳`;
      const metaDesc = document.querySelector("#meta-desc");
      if (metaDesc) {
        metaDesc.setAttribute("content", lesson.meta_description || `${lesson.title_th} - ฝึกเขียน เรียนอัจฉริยะภาษาญี่ปุ่นง่ายๆ วันละหน้า`);
      }
    }
  }, [lesson]);

  // 左右キーボード遷移の設定
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lessonId]);

  const goNext = () => {
    if (lessonId < totalLessons) {
      navigate(`/lesson/${lessonId + 1}`);
    } else {
      // 最後のページであれば、目次に戻るか完了メッセージ
      navigate("/contents");
    }
  };

  const goPrev = () => {
    if (lessonId > 1) {
      navigate(`/lesson/${lessonId - 1}`);
    } else {
      // レッスン1なら目次に戻る
      navigate("/contents");
    }
  };

  // スワイプ検出
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 60) {
      // 左へスワイプ (前進)
      goNext();
    } else if (diffX < -60) {
      // 右へスワイプ (後退)
      goPrev();
    }
    setTouchStartX(null);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-800 p-6 rounded-2xl shadow border border-red-200 text-center space-y-3">
          <AlertCircle className="mx-auto text-red-600" size={32} />
          <h3 className="font-bold font-sans">ไม่พบบทเรียนที่เลือก</h3>
          <button
            onClick={() => navigate("/contents")}
            className="px-4 py-2 bg-stone-800 text-stone-100 rounded-lg text-xs"
          >
            กลับสู่สารบัญ
          </button>
        </div>
      </div>
    );
  }

  // アニメーションのバリアント設定
  const slideVariants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "next" | "prev") => ({
      x: direction === "next" ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative selection:bg-amber-100 selection:text-amber-900"
    >
      {/* Visual background shadows peeking around layout */}
      <AnimatePresence mode="popLayout" custom={slideDirection}>
        <motion.div
          key={lessonId}
          custom={slideDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <NotebookLayout
            title={lesson.title_ja}
            category={lesson.category_th}
            dateStr={`DAY ${lesson.id}`}
            currentPage={lessonId + 1} // 表紙を1ページ、目次を2ページ目とみなす
            totalPages={totalLessons + 2}
            onPageLeft={goPrev}
            onPageRight={goNext}
          >
            {/* Lined Notebook Page Body Content - 2 Column Balanced Layout for absolute single-page sizing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 pt-1 select-text text-left items-start">
              
              {/* Left Column: Title & Writing Guide & Explanation */}
              <div className="space-y-4">
                {/* Header Box */}
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono tracking-widest block font-bold leading-none uppercase">
                    {lesson.category}
                  </span>
                  
                  {/* Visual marker highlighting on main title */}
                  <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight leading-none font-sans relative inline-block z-10">
                    <span className="relative z-10">{lesson.title_ja}</span>
                    <span className="absolute left-0 right-0 bottom-1 h-2.5 bg-yellow-200/75 -z-10" />
                  </h1>
                  
                  <p className="text-[12px] md:text-xs text-stone-500 font-sans italic leading-tight">
                    {lesson.title_th}
                  </p>
                </div>

                {/* Hiragana Character Details (Large visualization card if Hiragana lesson) */}
                {lesson.char.length === 1 && (
                  <div className="flex flex-row gap-3.5 items-center bg-stone-500/[0.03] p-3 rounded-xl border border-stone-200/40">
                    {/* Big cute glyph display with handwritten typography */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#fcfaf2] border border-stone-300/80 flex items-center justify-center shadow-sm relative">
                      <span className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight">
                        {lesson.char}
                      </span>
                      <div className="absolute top-0.5 right-1.5 text-[8.5px] text-stone-400 font-mono">
                        {lesson.stroke_count} 画
                      </div>
                    </div>

                    {/* Character Guide description with highlight lines */}
                    <div className="space-y-1 text-left flex-1 min-w-0">
                      <h3 className="text-[11px] font-extrabold text-amber-800 flex items-center gap-1 leading-none">
                        <Sparkles size={10.5} />
                        <span>วิธีคัดเขียนทีละสเต็ป ({lesson.stroke_count} เส้น)</span>
                      </h3>
                      <p className="text-[11.5px] font-sans text-stone-600 leading-normal">
                        {lesson.how_to_write_th}
                      </p>
                      <p className="text-[9px] font-sans text-stone-400 italic leading-none">
                        คัดเขียน: {lesson.how_to_write_ja}
                      </p>
                    </div>
                  </div>
                )}

                {/* Main Comprehensive Explanation Section with highlighter accents */}
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-extrabold text-stone-800 uppercase tracking-widest font-sans border-l-2 border-amber-500 pl-1.5 leading-none">
                    อธิบายความหมาย & โครงสร้าง
                  </h3>
                  
                  <div 
                    className="text-[14px] md:text-[15.5px] font-sans text-stone-700 pr-2 space-y-0.5"
                    style={{ lineHeight: "36px" }}
                    dangerouslySetInnerHTML={{ __html: lesson.explanation_th }}
                  />
                </div>
              </div>

              {/* Right Column: Key Phrases Table & Cultural Tip Post-it */}
              <div className="space-y-4">
                {/* Important Phrases Cards Table */}
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-extrabold text-stone-800 uppercase tracking-widest font-sans border-l-2 border-[#b91c1c] pl-1.5 leading-none">
                    วลีสำคัญประจำวัน
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-1.5">
                    {lesson.important_phrases.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#fcfaf2]/60 border border-stone-200/50 rounded-lg p-2.5 flex flex-col justify-between gap-1.5 text-left hover:bg-[#fffae8] transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          {/* Word string with custom soft highlighter underline styling & Voice Player */}
                          <div className="flex items-center gap-2">
                            <div className="relative inline-block z-10">
                              <span className="text-[14.5px] md:text-[15.5px] font-extrabold text-stone-900 font-sans relative z-10">
                                {item.phrase_ja}
                              </span>
                              <span className="absolute left-0 right-0 bottom-0 h-1.5 bg-rose-100/70 -z-10" />
                            </div>

                            <button
                              onClick={() => playTTS(item.phrase_ja, idx)}
                              className={`p-1 rounded-full border transition-all cursor-pointer flex items-center justify-center active:scale-90 ${
                                activePlayingIdx === idx
                                  ? "bg-amber-500 border-amber-600 text-stone-950 animate-pulse shadow-sm shadow-amber-500/20"
                                  : "bg-white/40 border-stone-300/60 text-stone-500 hover:text-amber-800 hover:border-amber-400 hover:bg-amber-50"
                              }`}
                              title="ฟังสำเนียงเสียงภาษาญี่ปุ่น"
                            >
                              <Volume2 size={13} className={activePlayingIdx === idx ? "animate-bounce" : ""} />
                            </button>
                          </div>
                          
                          <span className="text-[10px] text-stone-400 font-mono">
                            [{item.romaji}]
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[13px] md:text-[13.5px] text-[#b91c1c] font-black font-sans leading-tight">
                              {item.meaning_th}
                            </p>
                            <p className="text-[10px] text-stone-400 italic">
                              {item.meaning_ja}
                            </p>
                          </div>
                          
                          {/* Compact micro hint */}
                          <div className="bg-amber-500/5 border border-amber-500/10 rounded px-1.5 py-0.5 text-[9.5px] text-amber-800 max-w-[130px] leading-tight flex-shrink-0">
                            💡 {item.hint}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Post-it Sticky Note (Sticky Tip Area) - Thinner & Snug */}
                <div className="pt-0.5">
                  <div
                    id="sticky-note"
                    className="relative bg-amber-100/70 border border-amber-200/60 rounded-lg p-3 shadow-sm rotate-[-0.3deg] hover:rotate-0 transition-transform duration-300 text-left"
                  >
                    {/* Sticky Note tape visual mock */}
                    <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-12 h-2.5 bg-white/40 backdrop-blur shadow-none rounded-sm" />

                    <h4 className="text-[10.5px] font-extrabold text-amber-950 font-sans flex items-center gap-1 mb-1.5 leading-none">
                      <span className="w-1 h-1 rounded-full bg-amber-700 block" />
                      <span>เกร็ดวัฒนธรรม (ワンポイント豆知識)</span>
                    </h4>
                    
                    <div 
                      className="text-[11px] text-amber-900 font-sans description-spacing"
                      style={{ lineHeight: "1.45" }}
                      dangerouslySetInnerHTML={{ __html: lesson.tip_th }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </NotebookLayout>
        </motion.div>
      </AnimatePresence>

      {/* Floating semi-transparent navigation buttons at edges (for excellent desktop access) */}
      <button
        onClick={goPrev}
        className="fixed top-1/2 left-2 md:left-6 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-stone-900/40 hover:bg-stone-900/60 text-white rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur border border-white/10"
        title="หน้าก่อนหน้า"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button
        onClick={goNext}
        className="fixed top-1/2 right-2 md:right-6 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-stone-900/40 hover:bg-stone-900/60 text-white rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur border border-white/10"
        title="หน้าต่อไป"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
