import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Sparkles, Heart } from "lucide-react";

export default function CoverPage() {
  const navigate = useNavigate();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // 表紙ページにおける、キーボード操作（右矢印キー）で本を開く機能
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        openNotebook();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openNotebook = () => {
    navigate("/contents");
  };

  // スマホスワイプ操作（左スワイプで進む）
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    // 左にスワイプ（値がプラス ➔ 次のページへ進む）
    if (diffX > 60) {
      openNotebook();
    }
    setTouchStartX(null);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-[85vh] flex items-center justify-center p-4 selection:bg-rose-100 selection:text-rose-800"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, x: -100 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-lg relative bg-gradient-to-b from-[#df3c3c] to-[#b91c1c] rounded-3xl p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-t-[8px] border-l-[16px] border-r-4 border-b-4 border-red-950/70"
      >
        {/* Notebook strap lock */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-12 h-16 bg-amber-950/80 rounded-r-xl border-y-2 border-r-2 border-amber-900 shadow-md z-10 flex items-center justify-end pr-1">
          <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600 shadow" />
        </div>

        {/* Vintage gold stamp borders */}
        <div className="border-2 border-dashed border-red-300/40 rounded-2xl p-6 md:p-8 min-h-[500px] flex flex-col justify-between items-center text-center relative overflow-hidden">
          {/* Traditional Sakura Background patterns using CSS */}
          <div className="absolute top-4 left-4 w-12 h-12 border border-red-300/10 rounded-full flex items-center justify-center pointer-events-none opacity-30">
            <Sparkles className="text-red-200" size={16} />
          </div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border border-red-300/10 rounded-full flex items-center justify-center pointer-events-none opacity-30">
            <Heart className="text-red-200" size={20} />
          </div>

          {/* Publisher stamp */}
          <div className="self-end px-3 py-1 bg-amber-500/10 border border-amber-400/20 rounded font-sans text-[10px] text-amber-200 uppercase tracking-widest leading-none">
            YUI-YUTO.COM
          </div>

          {/* Book Title Panel */}
          <div className="my-auto space-y-5 relative z-10">
            {/* Subject Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-red-100 border border-white/10 font-sans tracking-wide">
              <BookOpen size={13} className="text-red-300" />
              <span>日本語学習手帳</span>
            </div>

            {/* Main Japanese title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md font-sans">
              0から始める<br />
              <span className="text-amber-300 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-800/20 inline-block mt-1">日本語学習手帳</span>
            </h1>

            {/* Sub Thai Title with cute round font */}
            <div className="space-y-1.5">
              <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-wide font-sans font-itim">
                เรียนภาษาญี่ปุ่นวันละหน้า
              </h2>
              <p className="text-xs text-red-200 max-w-xs mx-auto font-sans">
                สมุดโน้ตเรียนเริ่มจาก 0 เรียนง่าย ทบทวนฉับไว สนุกสไตล์พกพาสะดวก
              </p>
            </div>
            
            {/* Cute Illustrated Stamp Placeholder */}
            <div className="flex justify-center pt-2">
              <div className="relative w-28 h-28 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <img
                  src="https://picsum.photos/seed/japan/200/200"
                  alt="Cute Japan illustration"
                  className="w-24 h-24 object-cover rounded-xl filter contrast-[1.05] shadow"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-stone-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md font-sans border border-yellow-500">
                  วันละ 1 หน้า!
                </div>
              </div>
            </div>
          </div>

          {/* Action Button & Instructions */}
          <div className="w-full space-y-4 relative z-10">
            <motion.button
              onClick={openNotebook}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-3/4 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-stone-950 font-bold rounded-full shadow-[0_6px_20px_rgba(250,204,21,0.3)] transition-all cursor-pointer font-sans text-base flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles size={18} className="animate-pulse" />
              <span>เปิดสมุดเรียน (START)</span>
            </motion.button>

            {/* Navigation guidance hints for Desktop and Mobile */}
            <div className="flex flex-col gap-1 items-center">
              <p className="text-[10px] text-red-200/80 font-sans tracking-wide">
                <span className="hidden md:inline">กดปุ่ม ➔ หรือลูกศรขวา บนคีย์บอร์ดเพื่อเปิด</span>
                <span className="md:hidden">ปัดซ้ายของจอ (Left Swipe) หรือกดเริ่มเรียน</span>
              </p>
              
              {/* Little cute bookmark page peeking bottom */}
              <div className="w-1.5 h-6 bg-yellow-400 rounded-b mt-1 animate-bounce" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
