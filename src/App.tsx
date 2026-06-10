import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import CoverPage from "./components/CoverPage";
import ContentsPage from "./components/ContentsPage";
import LessonPage from "./components/LessonPage";
import AdBanner from "./components/AdBanner";
import QuizModal from "./components/QuizModal";
import { BookOpen, Heart, Sparkles } from "lucide-react";

function AppContent() {
  const location = useLocation();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="min-h-screen text-stone-800 flex flex-col relative overflow-x-hidden">
      {/* Absolute Background Layer (Elegant Desk with warm spotlight & radial organic dots) */}
      <div 
        className="absolute inset-0 -z-50 bg-[#161412]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(161, 98, 7, 0.12) 0%, transparent 65%),
            radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px"
        }}
      />

      {/* Main viewport block containing Header and Notebook */}
      <div className="flex-grow flex flex-col min-h-[calc(100vh-80px)]">
        {/* Header with Brand Identity */}
        <header className="w-full max-w-5xl mx-auto px-4 pt-3 pb-1.5 flex justify-between items-center z-20 border-b border-stone-800/15">
          <a 
            href="/" 
            className="flex items-center gap-2 group cursor-pointer"
          >
            {/* Logo Mark: Stylized "日" kanji in a notebook page shape */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-600/20 group-hover:from-rose-400 group-hover:to-red-600 transition-all border border-rose-400/20">
              日
            </div>
            <div className="text-left font-sans">
              <p className="text-[12px] font-extrabold text-stone-100 group-hover:text-rose-300 transition-colors leading-none tracking-tight">
                NIHON NOTE
              </p>
              <p className="text-[8.5px] text-stone-400 font-medium leading-tight mt-0.5">
                สมุดเรียนภาษาญี่ปุ่นวันละหน้า
              </p>
            </div>
          </a>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-stone-100 text-[10.5px] font-bold shadow-md shadow-rose-600/10 cursor-pointer active:scale-95 transition-all select-none mr-1"
            >
              <Sparkles size={11} className="animate-pulse" />
              <span>ควิซ / Quiz 🎯</span>
            </button>
            <div className="h-4 w-[1px] bg-stone-700 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-stone-400 font-sans font-medium">
              <BookOpen size={10} className="text-amber-500" />
              <span>เรียนทุกวัน เก่งทุกวัน</span>
            </span>
            <div className="h-4 w-[1px] bg-stone-700 hidden sm:block" />
            <span className="text-[10px] text-amber-500/80 font-sans font-bold flex items-center gap-1">
              <Heart size={10} className="text-rose-500 animate-pulse" />
              โดยคนญี่ปุ่นแท้ๆ
            </span>
          </div>
        </header>

        {/* Main Study Stage / Display Page Area */}
        <main className="flex-grow flex items-center justify-center w-full max-w-5xl mx-auto px-2 py-2 relative z-10">
          <Routes>
            <Route path="/" element={<CoverPage />} />
            <Route path="/contents" element={<ContentsPage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-stone-500 text-[10px] font-sans border-t border-stone-800/10 mt-6 pb-[110px] bg-stone-950/20 backdrop-blur-sm z-10">
        <p>© 2026 NIHON NOTE — สมุดเรียนภาษาญี่ปุ่นวันละหน้า สำหรับคนไทย</p>
        <p className="text-stone-600 mt-1">
          เนื้อหาจัดทำโดยคนญี่ปุ่นแท้ๆ อัปเดตบทเรียนใหม่ทุกวัน
        </p>
      </footer>

      {/* Monetization Anchor: Fixed Bottom Ad Banner */}
      <AdBanner key={location.pathname} currentPath={location.pathname} />

      {/* Dynamic Overlay Quiz Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Analytics />
    </BrowserRouter>
  );
}
