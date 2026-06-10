import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { compileLessons } from "./src/data/compile_lessons.js";

// __dirname / __filename polyfills for ESModules (in some environments)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
let vite: any = null;

// Compile lessons at boot
compileLessons();

// Live Load Lessons Data dynamically so updating/appending lessons in lessons.json
// is instantly reflected on clients and SEO search crawlers without a server reboot!
function getLessons(): any[] {
  try {
    const lessonsPath = path.join(process.cwd(), "src", "data", "lessons.json");
    const rawData = fs.readFileSync(lessonsPath, "utf8");
    return JSON.parse(rawData);
  } catch (err) {
    console.error("Error reading lessons.json, returning fallback empty array.", err);
    return [];
  }
}

// API Endpoints: Safe sever-side dynamic data
app.get("/api/lessons", (req, res) => {
  res.json(getLessons());
});

app.get("/api/lessons/:id", (req, res) => {
  const lessonId = parseInt(req.params.id, 10);
  const lessons = getLessons();
  const lesson = lessons.find((l) => l.id === lessonId);
  if (lesson) {
    res.json(lesson);
  } else {
    res.status(404).json({ error: "Lesson not found" });
  }
});

// Dynamic Sitemap.xml Generator for massive search index coverage
app.get("/sitemap.xml", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  
  const lessons = getLessons();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Core structural links
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${baseUrl}/contents</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  
  // Dynamic individual lesson URLs for search crawlers
  lessons.forEach((l) => {
    xml += `  <url>\n    <loc>${baseUrl}/lesson/${l.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });
  
  xml += `</urlset>`;
  
  res.header("Content-Type", "application/xml");
  res.status(200).send(xml);
});

// Dynamic robots.txt pointing crawlers to Sitemap
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  
  const robotsText = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  res.header("Content-Type", "text/plain");
  res.status(200).send(robotsText);
});

// Inject Meta tags, JSON-LD Structured Schema-Org, and pre-hydrated static mapping
function injectSEOProperties(html: string, title: string, desc: string, url: string, currentLessons: any[]): string {
  let modifiedHtml = html;
  
  // 1. Replace Native Page Header Title
  const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/i;
  modifiedHtml = modifiedHtml.replace(titleRegex, `<title>${title}</title>`);
  
  // 2. Replace or Insert Description
  const descRegex = /<meta\s+name="description"\s+id="meta-desc"\s+content="[^"]*"\s*\/?>/i;
  if (descRegex.test(modifiedHtml)) {
    modifiedHtml = modifiedHtml.replace(descRegex, `<meta name="description" id="meta-desc" content="${desc}" />`);
  } else {
    modifiedHtml = modifiedHtml.replace(/<\/head>/i, `<meta name="description" id="meta-desc" content="${desc}" />\n</head>`);
  }

  // 3. Replace standard Social Media Open Graph Tags
  modifiedHtml = modifiedHtml.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  modifiedHtml = modifiedHtml.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${desc}" />`);

  // 4. Inject Rich Schema JSON-LD Structured data for rich search snippet indexing (FAQ/Course format)
  let jsonLdStructure: any = null;
  
  if (url.startsWith("/lesson/")) {
    const urlParts = url.split("/");
    const lessonId = parseInt(urlParts[urlParts.length - 1], 10);
    const lesson = currentLessons.find((l) => l.id === lessonId);
    
    if (lesson) {
      jsonLdStructure = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `วิธีเรียนหลักภาษาญี่ปุ่น: ${lesson.title_ja} (${lesson.char})`,
        "description": lesson.meta_description || `${lesson.title_th} - ติวพิเศษกับสมุดจำศัพท์เด็ด`,
        "step": [
          {
            "@type": "HowToStep",
            "text": lesson.how_to_write_ja || `ฝึกฝนการเขียนและการสะกดตัว ${lesson.char}`
          }
        ]
      };
    }
  } else {
    jsonLdStructure = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "0から始める日本語学習！1日1ページ手帳 - เรียนภาษาญี่ปุ่นวันละหน้า",
      "description": "สมุดโน้ตเรียนภาษาญี่ปุ่นสำหรับคนไทย เริ่มต้นจาก 0 เรียนง่าย วันละหน้า พร้อมเกร็ดความรู้แสนสนุกและอนิเมชั่นเปลี่ยนหน้าสุดน่ารักคลาสสิก",
      "provider": {
        "@type": "Organization",
        "name": "JapanNotebook",
        "url": "http://localhost:3000"
      }
    };
  }

  if (jsonLdStructure) {
    const jsonStr = JSON.stringify(jsonLdStructure);
    modifiedHtml = modifiedHtml.replace(
      /<\/head>/i,
      `<script type="application/ld+json">\n${jsonStr}\n</script>\n</head>`
    );
  }

  // 5. Injects robust search crawler friendly pre-hydration links list (extremely powerful SEO indexing trick!)
  let crawlLinkMap = `\n<div style="display:none;" aria-hidden="true" id="seo-crawler-page-index">\n`;
  crawlLinkMap += `  <h2>สารบัญบทเรียนและหน้าสอนศัพท์ภาษาญี่ปุ่นสำหรับการสะกดรอยค้นหา (SEO Hub)</h2>\n`;
  crawlLinkMap += `  <ul>\n`;
  crawlLinkMap += `    <li><a href="/">หน้าแรก: บทนำสมุดหัดเขียน</a></li>\n`;
  crawlLinkMap += `    <li><a href="/contents">สารบัญวิชา: หัวตารางเรียนรู้ทั้งหมด</a></li>\n`;
  
  currentLessons.forEach((l) => {
    crawlLinkMap += `    <li>\n`;
    crawlLinkMap += `      <a href="/lesson/${l.id}">หน้า ${l.id} - ${l.char}: ${l.title_ja} (${l.title_th})</a>\n`;
    crawlLinkMap += `      <p>${l.meta_description || l.title_th}</p>\n`;
    crawlLinkMap += `    </li>\n`;
  });
  
  crawlLinkMap += `  </ul>\n`;
  crawlLinkMap += `</div>\n`;

  // Insert crawl link map right after body opening
  modifiedHtml = modifiedHtml.replace(/<body([^>]*)>/i, `<body$1>\n${crawlLinkMap}`);

  return modifiedHtml;
}

// Vite middleware setup (development vs production)
app.use(async (req, res, next) => {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    if (!vite) {
      vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
    }
    vite.middlewares(req, res, next);
  } else {
    next();
  }
});

// Serve static files from dist in production
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath, { index: false }));
}

// Dynamic Routing Handler for SEO Metatags
app.get("*", async (req, res, next) => {
  const url = req.originalUrl;
  
  try {
    // Determine the index.html file path
    let template: string;
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
      if (!vite) {
        vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
      }
      // Apply Vite HTML transforms for proper dev scripts mapping
      template = await vite.transformIndexHtml(url, template);
    } else {
      template = fs.readFileSync(path.resolve(process.cwd(), "dist", "index.html"), "utf-8");
    }

    // Determine SEO metadata
    let pageTitle = "0から始める日本語学習！1日1ページ手帳 - เรียนภาษาญี่ปุ่นวันละหน้า";
    let pageDesc = "สมุดโน้ตเรียนภาษาญี่ปุ่นสำหรับคนไทย เริ่มต้นจาก 0 เรียนง่าย วันละหน้า พร้อมเกร็ดความรู้แสนสนุกและอนิเมชั่นเปลี่ยนหน้าสุดน่ารักคลาสสิก";

    const currentLessons = getLessons();

    if (url === "/contents") {
      pageTitle = "สารบัญหัวข้อบทเรียนทั้งหมด - เรียนภาษาญี่ปุ่นวันละหน้า (1日1ページ手帳)";
      pageDesc = "รวมตารางคัดตัวอักษรฮิรางานะ ๕๐ เสียงดั้งเดิม เสียงขุ่น ขุ่นควบคู่ คาตาคานะสากล และวลีประโยคชีวิตประจำวันที่จำเป็นของคนไทย";
    } else if (url.startsWith("/lesson/")) {
      const urlParts = url.split("/");
      const lessonId = parseInt(urlParts[urlParts.length - 1], 10);
      const lesson = currentLessons.find((l) => l.id === lessonId);
      
      if (lesson) {
        pageTitle = `หน้าสอนที่ ${lesson.id}: ${lesson.char}『${lesson.title_ja}』เรียนคัดออกเสียง (${lesson.title_th})`;
        pageDesc = lesson.meta_description || `${lesson.title_th} - เคล็ดลับการจำ วิธีการคัดพู่เขียนทีละขั้นตอน และประโยคจำลองที่มีประโยชน์ร่วมกับการฟังเสียง`;
      }
    }

    const finalHtml = injectSEOProperties(template, pageTitle, pageDesc, url, currentLessons);
    res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production" && vite) {
      vite.ssrFixStacktrace(e);
    }
    next(e);
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Handy Notebook Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
