import fs from "fs";
import path from "path";

export function compileLessons(): void {
  const inputDir = path.join(process.cwd(), "src", "data", "lessons");
  const outputPath = path.join(process.cwd(), "src", "data", "lessons.json");

  try {
    if (!fs.existsSync(inputDir)) {
      console.error(`Input directory does not exist: ${inputDir}`);
      return;
    }

    const files = fs.readdirSync(inputDir);
    const jsonFiles = files.filter(f => f.endsWith(".json"));

    const lessonsList: any[] = [];

    jsonFiles.forEach(file => {
      const filePath = path.join(inputDir, file);
      try {
        const rawContent = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(rawContent);
        if (typeof parsed === "object" && parsed !== null) {
          if (parsed.id) {
            lessonsList.push(parsed);
          } else {
            console.warn(`Warning: file "${file}" is missing an "id" field.`);
          }
        }
      } catch (e) {
        console.error(`Error reading/parsing file "${file}":`, e);
      }
    });

    // Sort lessons strictly by numeric ID
    lessonsList.sort((a, b) => {
      const idA = typeof a.id === "number" ? a.id : parseInt(String(a.id), 10);
      const idB = typeof b.id === "number" ? b.id : parseInt(String(b.id), 10);
      return idA - idB;
    });

    // Write the output file
    fs.writeFileSync(outputPath, JSON.stringify(lessonsList, null, 2), "utf8");
    console.log(`Successfully compiled ${lessonsList.length} individual lessons into ${outputPath}!`);
  } catch (error) {
    console.error("Critical error in compileLessons:", error);
  }
}

// Allow running directly as executable command
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("compile_lessons.ts")) {
  compileLessons();
}
