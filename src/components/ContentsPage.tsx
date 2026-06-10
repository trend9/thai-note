import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import NotebookLayout from "./NotebookLayout";
import lessonsData from "../data/lessons.json";
import { List, Bookmark, ArrowRight, Sparkles, Zap, Compass, MessageCircle } from "lucide-react";

export default function ContentsPage() {
  const navigate = useNavigate();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
  // Tab States
  const [activeTab, setActiveTab] = useState<"hiragana" | "special" | "katakana" | "phrases">("hiragana");
  const [specialTab, setSpecialTab] = useState<"dakuon" | "handakuon" | "yoon">("dakuon");

  // 46 Basic Hiragana arranged in traditional Gojūon (5x11 Matrix)
  const gojuonMatrix = [
    [1, 2, 6, 7, 8],            // あ (1) い (2) う (6) え (7) お (8)
    [11, 12, 13, 14, 15],       // か き く け こ
    [16, 17, 18, 19, 20],       // さ し す せ そ
    [21, 22, 23, 24, 25],       // た ち つ て と
    [26, 27, 28, 29, 30],       // な に ぬ ね の
    [31, 32, 33, 34, 35],       // は ひ ふ へ ほ
    [36, 37, 38, 39, 40],       // ま み む め も
    [41, null, 42, null, 43],   // や (null) ゆ (null) よ
    [44, 45, 46, 47, 48],       // ら り る れ ろ
    [49, null, null, null, 50], // わ (null) (null) (null) を
    [51, null, null, null, null], // ん (null) (null) (null) (null)
  ];

  // 46 Basic Katakana arranged in traditional Gojūon (5x11 Matrix)
  const katakanaGojuonMatrix = [
    [63, 74, 75, 76, 77],            // ア (63) イ (74) ウ (75) エ (76) オ (77)
    [64, 78, 79, 80, 81],            // カ (64) キ (78) ク (79) ケ (80) コ (81)
    [65, 82, 83, 84, 85],            // サ シ ス セ ソ
    [66, 86, 87, 88, 89],            // タ チ ツ テ ト
    [67, 90, 91, 92, 93],            // ナ ニ ぬ ネ ノ
    [94, 95, 96, 97, 98],            // ハ ヒ フ ヘ ホ
    [99, 100, 101, 102, 103],        // マ ミ ム メ モ
    [104, null, 105, null, 106],     // ヤ (null) ユ (null) ヨ
    [107, 108, 109, 110, 111],        // ラ リ ル レ ロ
    [112, null, null, null, 113],     // ワ (null) (null) (null) ヲ
    [114, null, null, null, null],    // ン (null) (null) (null) (null)
  ];

  // Dakuon (濁音 - 20 kana)
  const dakuonMatrix = [
    [52, 115, 116, 117, 118], // が, ぎ, ぐ, げ, ご
    [53, 119, 120, 121, 122], // ざ, じ, ず, ぜ, ぞ
    [54, 123, 124, 125, 126], // だ, ぢ, づ, で, ど
    [55, 127, 128, 129, 130], // ば, び, ぶ, べ, ぼ
  ];

  // Handakuon (半濁音 - 5 kana)
  const handakuonMatrix = [
    [56, 131, 132, 133, 134], // ぱ, ぴ, ぷ, ぺ, ぽ
  ];

  // Yoon (拗音 - 33 kana)
  const yoonMatrix = [
    [57, 135, 136], // きゃ きゅ きょ
    [58, 137, 138], // しゃ しゅ しょ
    [139, 140, 59], // ちゃ ちゅ ちょ
    [141, 142, 143], // にゃ にゅ にょ
    [144, 145, 146], // ひゃ ひゅ ひょ
    [147, 148, 149], // みゃ みゅ みょ
    [150, 151, 152], // りゃ りゅ りょ
    [153, 154, 155], // ぎゃ ぎゅ ぎょ
    [156, 157, 158], // じゃ じゅ じょ
    [159, 160, 161], // びゃ びゅ びょ
    [162, 163, 164], // ぴゃ ぴゅ ぴょ
  ];

  // Phrase Categories
  const level2Ids = [3, 4, 9, 60, 61]; // ありがとう, こんにちは, さようなら, おやすみなさい, いただきます
  const level3Ids = [5, 10];   // すみません, はい・いいえ
  const level5Ids = [68, 69, 70, 71, 72, 73]; // 数字の基本, はじめまして, いくらですか, トイレはどこですか, これをください, お会計をお願いします

  // Grab instances for counts
  const countSpecial = lessonsData.filter((l) =>
    l.category === "Dakuon (濁音)" ||
    l.category === "Handakuon (半濁音)" ||
    l.category === "Yoon (拗音)"
  ).length;

  const countPhrases = level2Ids.length + level3Ids.length + level5Ids.length;

  // Sync page title & description with browser during client-side navigation
  useEffect(() => {
    document.title = "สารบัญหัวข้อบทเรียนทั้งหมด - เรียนภาษาญี่ปุ่นวันละหน้า (1日1ページ手帳)";
    const metaDesc = document.querySelector("#meta-desc");
    if (metaDesc) {
      metaDesc.setAttribute("content", "รวมตารางคัดตัวอักษรฮิรางานะ ๕๐ เสียงดั้งเดิม เสียงขุ่น ขุ่นควบคู่ คาตาคานะสากล และวลีประโยคชีวิตประจำวันที่จำเป็นของคนไทย");
    }
  }, []);

  // Key navigation for hand-turn
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigate("/");
      } else if (e.key === "ArrowRight") {
        navigate("/lesson/1");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 60) {
      navigate("/lesson/1");
    } else if (diffX < -60) {
      navigate("/");
    }
    setTouchStartX(null);
  };

  // Shared button renderer for grids
  const renderLessonButton = (id: number | null, theme: "amber" | "rose" | "sky" = "amber") => {
    if (id === null) {
      return (
        <div
          key={`empty-${Math.random()}`}
          className="aspect-square rounded-lg border border-dashed border-stone-200/40 bg-stone-100/10"
        />
      );
    }

    const lesson = lessonsData.find((l) => l.id === id);
    if (!lesson) return null;

    const romajiMatch = lesson.title_ja.match(/\(([^)]+)\)/);
    const romaji = romajiMatch ? romajiMatch[1] : lesson.char;

    // Custom styles based on local theme parameters
    let hoverBorder = "hover:border-amber-400 hover:bg-[#fffae8]/85";
    let textHover = "group-hover:text-amber-800";
    let charSize = "text-xs md:text-sm";

    if (theme === "rose") {
      hoverBorder = "hover:border-rose-400 hover:bg-rose-500/5";
      textHover = "group-hover:text-rose-700";
    } else if (theme === "sky") {
      hoverBorder = "hover:border-sky-400 hover:bg-[#f0f9ff]/80";
      textHover = "group-hover:text-sky-700";
    }

    if (lesson.char.length > 1) {
      charSize = "text-[10px] md:text-xs font-black tracking-tighter";
    }

    return (
      <Link
        key={id}
        to={`/lesson/${id}`}
        className={`group aspect-square rounded-lg flex flex-col items-center justify-center p-0.5 bg-white border border-stone-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow transition-all hover:scale-[1.08] active:scale-95 duration-100 ${hoverBorder}`}
        title={lesson.title_th}
      >
        <span className={`${charSize} font-extrabold text-stone-800 group-hover:text-[#b91c1c] transition-colors leading-none`} id={`char-${id}`}>
          {lesson.char}
        </span>
        <span className={`text-[6.5px] md:text-[7.5px] font-mono text-stone-400 font-bold leading-none uppercase tracking-tight ${textHover} truncate max-w-full px-0.5 mt-0.5`}>
          {romaji}
        </span>
      </Link>
    );
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="selection:bg-amber-100 selection:text-amber-900"
    >
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <NotebookLayout
          title="สารบัญ"
          category="INDEX / สารบัญบทเรียนดิจิทัล"
          dateStr="CONTENTS"
          currentPage={1}
          totalPages={lessonsData.length + 2}
          onPageLeft={() => navigate("/")}
          onPageRight={() => navigate("/lesson/1")}
        >
          {/* Main Container */}
          <div className="space-y-4 pt-0.5 h-full flex flex-col justify-start">
            
            {/* Elegant Header with Jump Links instructions */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-stone-200 pb-2.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-amber-500/10 text-amber-800">
                  <List size={18} />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-extrabold font-sans tracking-tight text-stone-800 leading-tight">
                    สารบัญคอร์สเรียนภาษาญี่ปุ่น
                  </h2>
                  <p className="text-[10px] text-stone-400 font-sans leading-none mt-1">
                    คลิกแถบเมนูด้านซ้ายเพื่อสลับบทเรียนอย่างแม่นยำ หมดปัญหาการเลื่อนหายาก!
                  </p>
                </div>
              </div>
            </div>

            {/* Layout Grid: Left sidebar menu & Right interactive views */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-grow overflow-hidden">
              
              {/* Sidebar Tabs (Jump buttons) */}
              <div className="lg:col-span-4 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none flex-shrink-0" id="contents-tabs-sidebar">
                
                {/* 1. Hiragana Tab */}
                <button
                  onClick={() => setActiveTab("hiragana")}
                  className={`flex-1 lg:flex-none text-left flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                    activeTab === "hiragana"
                      ? "bg-rose-500/5 border-rose-300 shadow-sm text-rose-950 font-bold"
                      : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-800"
                  }`}
                  id="tab-hiragana"
                >
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${activeTab === "hiragana" ? "bg-rose-500 text-white" : "bg-stone-100 text-stone-500"}`}>
                    <Sparkles size={13} />
                  </div>
                  <div className="truncate text-left leading-tight">
                    <div className="text-[11px] font-extrabold flex items-center gap-1">
                      <span>ฮิรางานะ (あ)</span>
                      <span className="text-[8px] opacity-75">46</span>
                    </div>
                    <div className="text-[8.5px] font-mono text-stone-400 font-bold leading-none mt-0.5">Hiragana Charts</div>
                  </div>
                </button>

                {/* 2. Special Sounds Tab */}
                <button
                  onClick={() => setActiveTab("special")}
                  className={`flex-1 lg:flex-none text-left flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                    activeTab === "special"
                      ? "bg-amber-500/5 border-amber-300 shadow-sm text-amber-950 font-bold"
                      : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-800"
                  }`}
                  id="tab-special"
                >
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${activeTab === "special" ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-500"}`}>
                    <Zap size={13} />
                  </div>
                  <div className="truncate text-left leading-tight">
                    <div className="text-[11px] font-extrabold flex items-center gap-1">
                      <span>เสียงพิเศษ (濁)</span>
                      <span className="text-[8.9px] px-1 py-0.2 bg-amber-500/15 text-amber-800 rounded font-black font-mono leading-none">{countSpecial}</span>
                    </div>
                    <div className="text-[8.5px] font-mono text-stone-400 font-bold leading-none mt-0.5">Special Sounds</div>
                  </div>
                </button>

                {/* 3. Katakana Tab */}
                <button
                  onClick={() => setActiveTab("katakana")}
                  className={`flex-1 lg:flex-none text-left flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                    activeTab === "katakana"
                      ? "bg-sky-500/5 border-sky-300 shadow-sm text-sky-950 font-bold"
                      : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-800"
                  }`}
                  id="tab-katakana"
                >
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${activeTab === "katakana" ? "bg-sky-500 text-white" : "bg-stone-100 text-stone-500"}`}>
                    <Compass size={13} />
                  </div>
                  <div className="truncate text-left leading-tight">
                    <div className="text-[11px] font-extrabold flex items-center gap-1">
                      <span>คาตาคานะ (ア)</span>
                      <span className="text-[8px] opacity-75">46</span>
                    </div>
                    <div className="text-[8.5px] font-mono text-stone-400 font-bold leading-none mt-0.5">Katakana Charts</div>
                  </div>
                </button>

                {/* 4. Phrases/Greetings Tab */}
                <button
                  onClick={() => setActiveTab("phrases")}
                  className={`flex-1 lg:flex-none text-left flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                    activeTab === "phrases"
                      ? "bg-indigo-500/5 border-indigo-300 shadow-sm text-indigo-950 font-bold"
                      : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-800"
                  }`}
                  id="tab-phrases"
                >
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${activeTab === "phrases" ? "bg-indigo-500 text-white" : "bg-stone-100 text-stone-500"}`}>
                    <MessageCircle size={13} />
                  </div>
                  <div className="truncate text-left leading-tight">
                    <div className="text-[11px] font-extrabold flex items-center gap-1">
                      <span>คำศัพท์วลี (会話)</span>
                      <span className="text-[8px] opacity-75">{countPhrases}</span>
                    </div>
                    <div className="text-[8.5px] font-mono text-stone-400 font-bold leading-none mt-0.5">Phrases & Travel</div>
                  </div>
                </button>

                {/* Sub Sidebar Note Info */}
                <div className="hidden lg:block p-3 rounded-lg bg-[#fbf9f0]/60 border border-stone-200/50 text-stone-600 text-[10px] leading-relaxed mt-2.5 text-left" id="sidebar-tip-box">
                  <div className="flex items-center gap-1.5 font-extrabold text-stone-800 mb-0.5">
                    <Bookmark size={12} className="text-rose-600" />
                    <span>เคล็ดลับสมุดช่วยจำ</span>
                  </div>
                  <p className="text-stone-500 text-[9.5px]">
                    เปิดไปทีละหน้าเพื่อเรียนรู้วิธีขีดพู่เขียน ฟังสำเนียง และทวนประโยคตัวอย่างอุดมความหมายได้อย่างเต็มอรรถรส
                  </p>
                </div>

              </div>

              {/* Display Area (9/12 of screen on desktop, auto on mobile) */}
              <div className="lg:col-span-8 flex-grow overflow-visible" id="contents-view-pane">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: HIRAGANA GOJUON */}
                  {activeTab === "hiragana" && (
                    <motion.div
                      key="hiragana"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#fbf9f0]/40 rounded-xl p-2.5 border border-stone-200/70 h-full flex flex-col"
                    >
                      <div className="text-left border-b border-stone-200 pb-1.5 mb-2.5">
                        <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold tracking-wide uppercase bg-rose-100 text-rose-700 font-sans">
                          ระดับ 1: อักขระฮิรางานะหลัก (Level 1)
                        </span>
                        <h3 className="text-[11.5px] font-extrabold text-stone-800 font-sans leading-tight mt-0.5">
                          ตาราง ๔๖ เสียงดั้งเดิม (Hiragana Chart)
                        </h3>
                      </div>

                      {/* Fifty sound Gojuon Grid */}
                      <div className="grid grid-cols-5 gap-1 md:gap-1.5 max-w-[270px] md:max-w-[310px] mx-auto w-full font-sans pb-1 justify-center">
                        {gojuonMatrix.map((row, r) => (
                          <React.Fragment key={r}>
                            {row.map((id) => renderLessonButton(id, "amber"))}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: SPECIAL SOUNDS MATRIX */}
                  {activeTab === "special" && (
                    <motion.div
                      key="special"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#fbf9f0]/40 rounded-xl p-3 border border-stone-200/70 h-full flex flex-col justify-start"
                    >
                      <div className="text-left border-b border-stone-200 pb-1.5 mb-2.5">
                        <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold tracking-wide uppercase bg-amber-100 text-amber-800 font-sans">
                          ระดับ 1.5: เสียงขุ่นและควบ (Special Sounds)
                        </span>
                        <h3 className="text-[11.5px] font-extrabold text-stone-800 font-sans leading-tight mt-0.5">
                          濁音・半濁音・拗音 ครอบคลุมชุดเสียงพิเศษทั้งหลักสูตร
                        </h3>
                      </div>

                      {/* Sub-tab Pills (Dakuon, Handakuon, Yoon) */}
                      <div className="flex bg-stone-200/50 p-0.5 rounded-lg border border-stone-200/80 mb-2.5 text-[8.5px] font-extrabold font-sans flex-shrink-0">
                        <button
                          onClick={() => setSpecialTab("dakuon")}
                          className={`flex-1 py-1 rounded-md text-center cursor-pointer transition-all ${
                            specialTab === "dakuon"
                              ? "bg-amber-500 text-stone-950 shadow-sm font-black"
                              : "text-stone-500 hover:text-stone-850"
                          }`}
                        >
                          เสียงขุ่น (゛) [20]
                        </button>
                        <button
                          onClick={() => setSpecialTab("handakuon")}
                          className={`flex-1 py-1 rounded-md text-center cursor-pointer transition-all ${
                            specialTab === "handakuon"
                              ? "bg-amber-500 text-stone-950 shadow-sm font-black"
                              : "text-stone-500 hover:text-stone-850"
                          }`}
                        >
                          กึ่งขุ่น (゜) [5]
                        </button>
                        <button
                          onClick={() => setSpecialTab("yoon")}
                          className={`flex-1 py-1 rounded-md text-center cursor-pointer transition-all ${
                            specialTab === "yoon"
                              ? "bg-amber-500 text-stone-950 shadow-sm font-black"
                              : "text-stone-500 hover:text-stone-850"
                          }`}
                        >
                          เสียงควบ (ゃ) [33]
                        </button>
                      </div>

                      {/* Dynamic Sound Charts inside Tab Area */}
                      {specialTab === "dakuon" && (
                        <div className="space-y-1.5" id="sound-pane-dakuon">
                          <p className="text-[9px] text-stone-400 font-sans leading-none text-left pl-1">
                            สัมผัสเสียงสั่นจากการเติมเท็นเท็น (〃) ในแถว G, Z, D, B
                          </p>
                          <div className="grid grid-cols-5 gap-1 md:gap-1.5 max-w-[270px] md:max-w-[310px] mx-auto w-full font-sans pt-1">
                            {dakuonMatrix.map((row, r) => (
                              <React.Fragment key={r}>
                                {row.map((id) => renderLessonButton(id, "rose"))}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {specialTab === "handakuon" && (
                        <div className="space-y-1.5" id="sound-pane-handakuon">
                          <p className="text-[9px] text-stone-400 font-sans leading-none text-left pl-1">
                            เสียงกึ่งปะทุโดยแต่งเติมปุ่มกลมมารุ (゜) บนแถว H เกิดเป็นชุดอักษร P
                          </p>
                          <div className="grid grid-cols-5 gap-1 md:gap-1.5 max-w-[270px] md:max-w-[310px] mx-auto w-full font-sans pt-1.5">
                            {handakuonMatrix.map((row, r) => (
                              <React.Fragment key={r}>
                                {row.map((id) => renderLessonButton(id, "rose"))}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {specialTab === "yoon" && (
                        <div className="space-y-1" id="sound-pane-yoon">
                          <p className="text-[8.5px] md:text-[9.5px] text-stone-550 leading-tight leading-loose bg-stone-100/50 p-2 rounded border border-stone-200/50 text-left">
                            <strong>เสียงควบสระ (拗音)</strong>: ประสมสระอิหลักด้วยตัวย่อจิ๋ว (ゃ, ゅ, ょ) เพื่อรวบรวมเปล่งครึ่งพยางค์
                          </p>
                          {/* We have 33 items, structured in 11 rows of 3 columns, scroll beautifully if needed */}
                          <div className="max-h-[285px] overflow-y-auto pr-1">
                            <div className="grid grid-cols-3 gap-1 md:gap-1.5 max-w-[190px] md:max-w-[240px] mx-auto w-full font-sans pt-1">
                              {yoonMatrix.map((row, r) => (
                                <React.Fragment key={r}>
                                  {row.map((id) => renderLessonButton(id, "rose"))}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* TAB 3: KATAKANA CHARTS */}
                  {activeTab === "katakana" && (
                    <motion.div
                      key="katakana"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#fbf9f0]/40 rounded-xl p-2.5 border border-stone-200/70 h-full flex flex-col"
                    >
                      <div className="text-left border-b border-stone-200 pb-1.5 mb-2.5">
                        <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold tracking-wide uppercase bg-sky-100 text-sky-800 font-sans">
                          ระดับ 4: อักขระคาตาคานะสากล (Level 4)
                        </span>
                        <h3 className="text-[11.5px] font-extrabold text-stone-850 font-sans leading-tight mt-0.5">
                          ตารางคาตาคานะทับศัพท์สากล (Katakana Chart)
                        </h3>
                      </div>

                      {/* Katakana Intro Banner */}
                      {(() => {
                        const intro = lessonsData.find((l) => l.id === 62);
                        if (!intro) return null;
                        return (
                          <Link
                            to="/lesson/62"
                            className="group flex items-center justify-between p-1 px-2.5 mb-2 rounded-lg bg-sky-500/5 hover:bg-sky-500/10 border border-sky-300/35 shadow-sm transition-all"
                            id="katakana-intro-banner"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-3.5 h-3.5 rounded bg-sky-500 text-white text-[8px] font-black flex items-center justify-center leading-none">★</span>
                              <div className="text-left leading-none flex items-center">
                                <span className="text-[10px] font-extrabold text-[#111827] group-hover:text-blue-900 leading-tight">{intro.title_ja}</span>
                                <span className="text-[8.5px] text-stone-400 font-sans font-medium ml-1.5 leading-none">({intro.title_th})</span>
                              </div>
                            </div>
                            <ArrowRight size={10} className="text-sky-500 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        );
                      })()}

                      {/* Katakana Gojuon Grid */}
                      <div className="grid grid-cols-5 gap-1 md:gap-1.5 max-w-[270px] md:max-w-[310px] mx-auto w-full font-sans pb-1 justify-center">
                        {katakanaGojuonMatrix.map((row, r) => (
                          <React.Fragment key={r}>
                            {row.map((id) => renderLessonButton(id, "sky"))}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: CONVERSATION PHRASES */}
                  {activeTab === "phrases" && (
                    <motion.div
                      key="phrases"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#fbf9f0]/40 rounded-xl p-3 border border-stone-200/70 h-full flex flex-col justify-start animate-fade-in"
                    >
                      <div className="text-left border-b border-stone-200 pb-1.5 mb-2.5 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold tracking-wide uppercase bg-indigo-100 text-indigo-700 font-sans">
                          ระดับ 2, 3, 5: บทสนทนาการท่องเที่ยว (Conversations)
                        </span>
                        <h3 className="text-[11.5px] font-extrabold text-stone-850 font-sans leading-tight mt-0.5">
                          คลังประโยคเอาตัวรอด วลีจำเป็น และการนับเศษตัวเลข
                        </h3>
                      </div>

                      {/* Group grid with compact scrolls */}
                      <div className="space-y-3.5 overflow-y-auto max-h-[350px] pr-1 pb-1" id="phrases-scroll-area">
                        
                        {/* Level 2: Greetings */}
                        <div className="text-left font-sans">
                          <h4 className="text-[9.5px] font-black text-stone-500 font-mono tracking-wider uppercase mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>Level 2: คำทักทายชีวิตประจำวัน (Greetings)</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                            {lessonsData.filter((l) => level2Ids.includes(l.id)).map((lesson) => (
                              <Link
                                key={lesson.id}
                                to={`/lesson/${lesson.id}`}
                                className="group flex items-center justify-between p-1 px-2 rounded-lg bg-white hover:bg-[#fffae8]/60 border border-stone-200 hover:border-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                              >
                                <div className="flex items-center gap-1.5 overflow-hidden text-left leading-none">
                                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded bg-stone-100 text-[#b91c1c] text-[8.5px] font-bold font-mono">
                                    {lesson.id}
                                  </span>
                                  <div className="overflow-hidden leading-tight">
                                    <div className="text-[10px] md:text-[10.5px] font-black text-stone-800 group-hover:text-[#b91c1c] truncate">
                                      {lesson.title_ja}
                                    </div>
                                    <div className="text-[8.5px] text-stone-400 font-sans truncate">
                                      {lesson.title_th}
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight size={10} className="text-stone-300 group-hover:text-[#b91c1c] transform group-hover:translate-x-0.5 transition-all flex-shrink-0 mb-0.5" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Level 3: Short Survival */}
                        <div className="text-left font-sans">
                          <h4 className="text-[9.5px] font-black text-stone-500 font-mono tracking-wider uppercase mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                            <span>Level 3: ประโยคสั้นเอาตัวรอด (Daily Phrases)</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                            {lessonsData.filter((l) => level3Ids.includes(l.id)).map((lesson) => (
                              <Link
                                key={lesson.id}
                                to={`/lesson/${lesson.id}`}
                                className="group flex items-center justify-between p-1 px-2 rounded-lg bg-white hover:bg-[#fffae8]/60 border border-stone-200 hover:border-teal-400 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                              >
                                <div className="flex items-center gap-1.5 overflow-hidden text-left leading-none">
                                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded bg-stone-100 text-[#b91c1c] text-[8.5px] font-bold font-mono">
                                    {lesson.id}
                                  </span>
                                  <div className="overflow-hidden leading-tight">
                                    <div className="text-[10px] md:text-[10.5px] font-black text-stone-800 group-hover:text-[#b91c1c] truncate">
                                      {lesson.title_ja}
                                    </div>
                                    <div className="text-[8.5px] text-stone-400 font-sans truncate">
                                      {lesson.title_th}
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight size={10} className="text-stone-300 group-hover:text-[#b91c1c] transform group-hover:translate-x-0.5 transition-all flex-shrink-0 mb-0.5" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Level 5: Survival Details */}
                        <div className="text-left font-sans">
                          <h4 className="text-[9.5px] font-black text-stone-500 font-mono tracking-wider uppercase mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 font-bold"></span>
                            <span>Level 5: เรื่องตัวเลขและการท่องเที่ยว (Travel & Numbers)</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                            {lessonsData.filter((l) => level5Ids.includes(l.id)).map((lesson) => (
                              <Link
                                key={lesson.id}
                                to={`/lesson/${lesson.id}`}
                                className="group flex items-center justify-between p-1 px-2 rounded-lg bg-white hover:bg-[#fffae8]/60 border border-stone-200 hover:border-indigo-400 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                              >
                                <div className="flex items-center gap-1.5 overflow-hidden text-left leading-none">
                                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded bg-stone-100 text-[#b91c1c] text-[8.5px] font-bold font-mono">
                                    {lesson.id}
                                  </span>
                                  <div className="overflow-hidden leading-tight">
                                    <div className="text-[10px] md:text-[10.5px] font-black text-stone-800 group-hover:text-[#b91c1c] truncate font-sans">
                                      {lesson.title_ja}
                                    </div>
                                    <div className="text-[8.5px] text-stone-400 font-sans truncate">
                                      {lesson.title_th}
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight size={10} className="text-stone-300 group-hover:text-[#b91c1c] transform group-hover:translate-x-0.5 transition-all flex-shrink-0 mb-0.5" />
                              </Link>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>

          </div>
        </NotebookLayout>
      </motion.div>
    </div>
  );
}
