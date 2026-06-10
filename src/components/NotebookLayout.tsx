import { motion } from "motion/react";
import { ReactNode } from "react";
import { BookOpen, Calendar } from "lucide-react";

interface NotebookLayoutProps {
  children: ReactNode;
  title: string;
  category: string;
  dateStr?: string;
  onPageLeft?: () => void;
  onPageRight?: () => void;
  currentPage?: number;
  totalPages?: number;
}

export default function NotebookLayout({
  children,
  title,
  category,
  dateStr = "DAY 1",
  onPageLeft,
  onPageRight,
  currentPage,
  totalPages,
}: NotebookLayoutProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 md:px-4 pt-1 pb-2">
      {/* 3D-like Notebook Outer Frame (Leather/Timber style spine cover) */}
      <div 
        id="notebook-cover"
        className="relative bg-[#4a3b32] rounded-r-3xl rounded-l-md p-2.5 md:p-3.5 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.65)] border-l-[22px] border-[#291e1b] border-y-2 border-r border-[#1a110f]/60 backdrop-blur-md"
      >
        {/* Subtle ribbon bookmark string */}
        <div className="absolute top-0 right-16 w-3 h-24 bg-rose-600/90 rounded-b shadow-md z-10 origin-top transform hover:translate-y-1 transition-transform duration-300 hidden sm:block" />

        {/* Notebook inner paper container with fine cotton cream colors and warm organic ruling lines */}
        <div
          id="notebook-paper"
          className="relative bg-[#fcfaf2] rounded-r-2xl rounded-l p-4 pt-4 pb-14 md:p-6 md:pt-6 md:pb-16 h-[610px] md:h-[650px] shadow-[inset_1px_1px_6px_rgba(0,0,3,0.05),_inset_-1px_-1px_4px_rgba(0,0,3,0.03)] select-none overflow-hidden duration-300 flex flex-col justify-start"
          style={{
            // Premium custom organic ruling system
            backgroundImage: "repeating-linear-gradient(transparent, transparent 35px, #e5e0d8 35px, #e5e0d8 36px)",
            backgroundPosition: "0 10px",
          }}
        >
          {/* Header of the page (Metadata / Day Indicator) */}
          <div className="flex justify-between items-center border-b border-[#e5e0d8] pb-1.5 mb-4 pointer-events-none flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-0.5 px-2 rounded bg-amber-500/15 text-amber-800 border border-amber-600/20 text-[9px] font-extrabold font-mono tracking-wider shadow-none uppercase leading-none">
                {dateStr}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-stone-500 font-medium font-sans">
                <BookOpen size={11} className="text-stone-400" />
                {category}
              </span>
            </div>
            
            {currentPage && totalPages && (
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-mono tracking-wider font-semibold">
                <Calendar size={11} />
                <span>PAGE {String(currentPage).padStart(3, "0")} / {String(totalPages).padStart(3, "0")}</span>
              </div>
            )}
          </div>

          {/* Spine Rings (Custom spiral binding overlay) */}
          <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-around py-4 ml-[-12px] z-25 pointer-events-none">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="flex items-center justify-center">
                {/* Spiral Ring Clip - Beautiful realistic metal loops */}
                <div className="w-7 h-2.5 rounded-full bg-gradient-to-r from-stone-500 via-stone-200 to-stone-500 shadow-[1px_1px_3px_rgba(0,0,0,0.25)] border border-stone-600/40" />
              </div>
            ))}
          </div>

          {/* Left Binder Margined Red Line */}
          <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-200/45 pointer-events-none" />

          {/* Page Content area (Takes children) - Scrollable list strictly fixed within notebook size */}
          <div className="flex-grow pl-6 pr-1 relative z-10 font-sans overflow-y-auto pb-14 select-text" style={{ lineHeight: "36px" }}>
            {children}
          </div>

          {/* Paper Inner Navigation Controls (バナーに絶対に被らない＆手帳をめくる楽しさ) */}
          <div className="absolute bottom-0 left-10 right-4 flex justify-between items-center z-30 pointer-events-auto bg-gradient-to-t from-[#fcfaf2] via-[#fcfaf2]/95 to-transparent pt-6 pb-3">
            {onPageLeft ? (
              <button
                onClick={onPageLeft}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 font-bold border border-stone-300 rounded transition-all active:scale-95 cursor-pointer font-sans text-[11px]"
              >
                ← ย้อนกลับ
              </button>
            ) : (
              <div />
            )}

            {onPageRight ? (
              <button
                onClick={onPageRight}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold border border-amber-600/10 rounded shadow-sm transition-all active:scale-95 cursor-pointer font-sans text-[11.5px]"
              >
                หน้าถัดไป →
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Corner curl shadow overlay to suggest page depth */}
          <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none bg-gradient-to-br from-transparent to-stone-900/[0.03] rounded-br-2xl" />
        </div>

        {/* Floating Side Index/Tabs (Like a real custom planner tab, clickable to open index) */}
        <div className="absolute left-full top-20 flex flex-col gap-2 ml-[1px] hidden sm:flex">
          <a
            href="/"
            className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-r-md text-[10px] font-bold font-sans shadow shadow-rose-950/20 transform hover:translate-x-0.5 transition-transform"
          >
            ปก
          </a>
          <a
            href="/contents"
            className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-r-md text-[10px] font-bold font-sans shadow shadow-amber-950/20 transform hover:translate-x-0.5 transition-transform"
          >
            สารบัญ
          </a>
        </div>
      </div>

    </div>
  );
}
