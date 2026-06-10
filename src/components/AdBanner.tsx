import { useEffect, useState } from "react";

interface AdBannerProps {
  currentPath: string;
  key?: string;
}

export default function AdBanner({ currentPath }: AdBannerProps) {
  const [impressionCount, setImpressionCount] = useState(0);
  const [adContent, setAdContent] = useState({
    title: "YUI-YUTO Premium Japanese Course",
    desc: "เรียนคอร์สภาษาญี่ปุ่นระดับก้าวหน้ากับคนญี่ปุ่นแท้ๆ ราคาพิเศษวันนี้!",
    image: "https://picsum.photos/seed/japanese_class/120/60?blur=1",
    actionText: "สมัครเลย",
  });

  // 広告のローテーション用。インプレッション時に広告内容もリロードっぽく変更
  const ads = [
    {
      title: "YUI-YUTO Premium Japanese!",
      desc: "คอร์สออนไลน์ราคาพิเศษเรียนตั้งแต่อักษรแรกจนสื่อสารได้คล่องแคล่ว!",
      image: "https://picsum.photos/seed/learn_jp/120/60",
      actionText: "ดูคอร์สเรียน",
    },
    {
      title: "เที่ยวญี่ปุ่นสนุกยิ่งขึ้นด้วยภาษาคู่ใจ",
      desc: "พร้อมคำแนะนำสถานที่ลับในโตเกียวที่นักเขียนมืออาชีพบินลัดฟ้าคัดมาเอง",
      image: "https://picsum.photos/seed/tokyo_tour/120/60",
      actionText: "จองคู่มือฟรี",
    },
    {
      title: "หนังสือสรุปไวยากรณ์สไตล์มินิมอล",
      desc: "เล่มเดียวอ่านทวนสอบผ่าน JLPT N5-N4 แน่นอน ช้อปด่วนจำกัด 100 เล่ม!",
      image: "https://picsum.photos/seed/jp_book/120/60",
      actionText: "สั่งซื้อใน Kindle",
    },
  ];

  useEffect(() => {
    // ページ遷移（currentPath変更）に伴う、確実なリロード＆インプレッション上昇ロジック
    setImpressionCount((prev) => prev + 1);
    
    // 内容をランダム、または順番に変更
    const index = Math.floor(Math.random() * ads.length);
    setAdContent(ads[index]);

    console.log(`[AD DISPATCH] Banner Reloaded for path: ${currentPath}. Current Total Ad Impressions: ${impressionCount + 1}`);
  }, [currentPath]); // キーが変化すると発火

  return (
    <div
      id="fixed-ad-banner"
      className="fixed bottom-0 left-0 right-0 z-50 h-[76px] bg-stone-900 border-t border-stone-800 text-stone-300 md:px-6 px-3 flex items-center justify-between shadow-2xl"
    >
      <div className="flex items-center gap-3 max-w-2xl overflow-hidden">
        {/* Ad Badge */}
        <div className="flex-shrink-0 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded leading-none">
          AD
        </div>

        {/* Ad Image / Placeholder */}
        <img
          src={adContent.image}
          alt="Advertisement sponsored"
          className="w-16 h-10 object-cover rounded border border-stone-700 bg-stone-800 flex-shrink-0 hidden sm:block"
          referrerPolicy="no-referrer"
        />

        {/* Ad Text */}
        <div className="text-left">
          <h4 className="text-sm font-semibold text-amber-100 font-sans truncate pr-2">
            {adContent.title}
          </h4>
          <p className="text-xs text-stone-400 font-sans line-clamp-1">
            {adContent.desc}
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Impression Counter (Showing visual proof of monetization reload) */}
        <div className="hidden md:flex flex-col items-end text-right text-[10px] text-stone-500 font-mono">
          <span>Impression Active</span>
          <span className="text-amber-500/80">ID: IMP-{(1000 + impressionCount).toString(16).toUpperCase()}</span>
        </div>

        <a
          href="https://yui-yuto.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-sans font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer leading-none"
        >
          {adContent.actionText}
        </a>
      </div>
    </div>
  );
}
