import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import CoverPage from "./components/CoverPage";
import ContentsPage from "./components/ContentsPage";
import LessonPage from "./components/LessonPage";
import AdBanner from "./components/AdBanner";
import QuizModal from "./components/QuizModal";
import { BookOpen, Globe, Heart, Sparkles } from "lucide-react";

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

      {/* Main viewport block containing Header and Notebook so they always fit perfectly together above structural fold */}
      <div className="flex-grow flex flex-col min-h-[calc(100vh-80px)]">
        {/* Modern Minimalistic Header for Brand Unity (Non-distracting navigation) */}
        <header className="w-full max-w-5xl mx-auto px-4 pt-3 pb-1.5 flex justify-between items-center z-20 border-b border-stone-800/15">
          <a 
            href="https://yui-yuto.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-black text-xs shadow-md shadow-amber-500/15 group-hover:bg-amber-400 transition-colors">
              YY
            </div>
            <div className="text-left font-sans">
              <p className="text-[11px] font-bold text-stone-100 group-hover:text-amber-400 transition-colors leading-none pr-1">
                yui-yuto.com
              </p>
              <p className="text-[8px] text-stone-400 font-medium">
                สื่อเรียนภาษาญี่ปุ่นยอดนิยมสำหรับคนไทย
              </p>
            </div>
          </a>

          {/* Global Nav Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-stone-100 text-[10.5px] font-bold shadow-md shadow-rose-600/10 cursor-pointer active:scale-95 transition-all select-none mr-1"
            >
              <Sparkles size={11} className="animate-pulse" />
              <span>ควิซ / Quiz 🎯</span>
            </button>
            <div className="h-4 w-[1px] bg-stone-700 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-stone-400 uppercase font-bold tracking-widest font-mono">
              <Globe size={10} className="text-amber-500 animate-spin-slow" />
              <span>SEO Indexed Platform</span>
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

      {/* Footer Area with nice credential lines above fixed ad (placed strictly below the first-fold view) */}
      <footer className="w-full text-center py-6 text-stone-500 text-[10px] font-sans border-t border-stone-800/10 mt-6 pb-[110px] bg-stone-950/20 backdrop-blur-sm z-10">
        <p>© 2026 yui-yuto.com Subdomain. All rights reserved.</p>
        <p className="text-stone-600 mt-1">
          ระบบเรียนล่องหนด้วยม่านเปลี่ยนหน้าของ Kindle & ระบบ SEO ความเร็วสูงไร้ช่วงรอยต่อ
        </p>
      </footer>

      {/* Monetization Anchor: Fixed Bottom Ad Banner */}
      {/* key attribute triggers unmount/reactivation on route transition for 100% ad impressions reload */}
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
    </BrowserRouter>
  );
}
