const fs = require("fs");
const path = require("path");
const https = require("https");

const IMAGES_DIR = path.join(__dirname, "../public/images/rules");
const DATA_FILE = path.join(__dirname, "../src/data/sudokuRulesData.ts");

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchUrl(res.headers.location));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    ).on("error", reject);
  });
}

function downloadBinary(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith("http") ? url : `https://sudoku.com${url}`;
    const file = fs.createWriteStream(destPath);
    https.get(
      fullUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(destPath);
          return resolve(downloadBinary(res.headers.location, destPath));
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close(() => resolve(true));
        });
      }
    ).on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function extractAll() {
  console.log("Fetching main rules listing pages...");
  const pages = [
    "https://sudoku.com/sudoku-rules/",
    "https://sudoku.com/sudoku-rules/page/2/",
    "https://sudoku.com/sudoku-rules/page/3/",
  ];

  const listingItems = [];
  for (const pageUrl of pages) {
    const html = await fetchUrl(pageUrl);
    const regex =
      /<a href="(\/sudoku-rules\/[^"]+)" class="rules_item">[\s\S]*?<img [^>]*data-src="([^"]+)"[\s\S]*?<div class="rules_item_title">\s*([^<]+)\s*<\/div>[\s\S]*?<div class="rules_item_desc">\s*([\s\S]*?)\s*<\/div>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      listingItems.push({
        relativeUrl: match[1],
        thumbnailRemote: match[2],
        title: match[3].trim(),
        desc: match[4]
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&nbsp;/g, " ")
          .trim(),
      });
    }
  }

  console.log(`Discovered ${listingItems.length} techniques.`);

  const techniques = [];

  for (let i = 0; i < listingItems.length; i++) {
    const item = listingItems[i];
    const rawSlug = item.relativeUrl.replace(/^\/sudoku-rules\//, "").replace(/\/$/, "");
    const cleanSlug = rawSlug === "h-wing" ? "x-wing" : rawSlug;

    console.log(`[${i + 1}/${listingItems.length}] Processing ${cleanSlug}...`);

    // Download thumbnail
    const thumbFilename = `${cleanSlug}-thumb.png`;
    const thumbLocalPath = path.join(IMAGES_DIR, thumbFilename);
    const thumbPublicUrl = `/images/rules/${thumbFilename}`;
    try {
      await downloadBinary(item.thumbnailRemote, thumbLocalPath);
      console.log(`   Downloaded thumb: ${thumbFilename}`);
    } catch (e) {
      console.error(`   Failed to download thumb for ${cleanSlug}`, e);
    }

    // Fetch detail page
    const detailUrl = `https://sudoku.com${item.relativeUrl}`;
    const detailHtml = await fetchUrl(detailUrl);

    // Extract detail title
    const titleMatch = detailHtml.match(/<h1 class="entry-title">([\s\S]*?)<\/h1>/i);
    const detailTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : item.title;

    // Extract video
    const videoMatch = detailHtml.match(/<div class="rules_video">[\s\S]*?<iframe[^>]*src="([^"]+)"/i);
    const videoUrl = videoMatch ? videoMatch[1] : null;

    // Extract article content
    const articleMatch = detailHtml.match(/<div class="rules_content-article">([\s\S]*?)<\/div>\s*<\/div>/i);
    const articleHtml = articleMatch ? articleMatch[1] : "";

    // Extract paragraphs
    const paragraphs = [...articleHtml.matchAll(/<p>([\s\S]*?)<\/p>/gi)]
      .map((m) =>
        m[1]
          .replace(/<img[^>]*>/gi, "")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&nbsp;/g, " ")
          .replace(/<[^>]+>/g, "")
          .trim()
      )
      .filter((p) => p.length > 0);

    // Extract images inside article
    const rawImgs = [...articleHtml.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]);
    const localImgs = [];

    for (let imgIdx = 0; imgIdx < rawImgs.length; imgIdx++) {
      const remoteImg = rawImgs[imgIdx];
      const imgExt = path.extname(remoteImg).split("?")[0] || ".png";
      const imgFilename = `${cleanSlug}-step-${imgIdx + 1}${imgExt}`;
      const imgDestPath = path.join(IMAGES_DIR, imgFilename);
      const imgPublicUrl = `/images/rules/${imgFilename}`;

      try {
        await downloadBinary(remoteImg, imgDestPath);
        localImgs.push({
          url: imgPublicUrl,
          alt: `${item.title} step ${imgIdx + 1}`,
        });
        console.log(`   Downloaded step image: ${imgFilename}`);
      } catch (err) {
        console.error(`   Failed to download image ${remoteImg}`, err);
      }
    }

    // Difficulty categorization
    let difficulty = "Beginner";
    if (i >= 5 && i <= 11) {
      difficulty = "Intermediate";
    } else if (i >= 12) {
      difficulty = "Advanced";
    }

    techniques.push({
      id: i + 1,
      slug: cleanSlug,
      originalSlug: rawSlug,
      title: item.title,
      headingTitle: detailTitle,
      shortDescription: item.desc,
      difficulty,
      videoUrl,
      thumbnail: thumbPublicUrl,
      images: localImgs,
      paragraphs,
    });
  }

  // Foundational rules from the main page
  const foundationalRules = {
    title: "What is Sudoku and what are the rules of this game?",
    subtitle: "Sudoku is a popular logic puzzle with numbers. Its rules are quite simple, so even beginners can handle the simple levels.",
    basicRules: [
      {
        id: 1,
        title: "9x9 Grid Layout",
        description: "The classic Sudoku board consists of 81 cells organized into 9 rows, 9 columns, and nine 3×3 blocks.",
      },
      {
        id: 2,
        title: "Use Numbers 1 through 9",
        description: "Only single digits from 1 to 9 may be entered into any cell on the board. No zeros or negative numbers.",
      },
      {
        id: 3,
        title: "Unique 3x3 Blocks",
        description: "Each of the nine 3×3 sub-grids must contain the numbers 1 to 9 exactly once without duplication.",
      },
      {
        id: 4,
        title: "Unique Columns",
        description: "Each vertical column must contain all digits from 1 to 9 with no repeated numbers.",
      },
      {
        id: 5,
        title: "Unique Rows",
        description: "Each horizontal row must contain all digits from 1 to 9 with no repeated numbers.",
      },
      {
        id: 6,
        title: "No Guessing Required",
        description: "Every valid Sudoku puzzle has a single unique solution that can be deduced through pure logical reasoning.",
      },
      {
        id: 7,
        title: "Victory Condition",
        description: "The game is successfully completed when all 81 cells are filled in strict adherence to every row, column, and block constraint.",
      },
    ],
  };

  // Generate TypeScript code
  const tsContent = `// Auto-generated Sudoku Rules Dataset from sudoku.com/sudoku-rules/
// Generated on ${new Date().toISOString()}

export interface RuleImage {
  url: string;
  alt: string;
}

export interface SudokuTechnique {
  id: number;
  slug: string;
  originalSlug: string;
  title: string;
  headingTitle: string;
  shortDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  videoUrl: string | null;
  thumbnail: string;
  images: RuleImage[];
  paragraphs: string[];
}

export interface BasicRuleItem {
  id: number;
  title: string;
  description: string;
}

export interface FoundationalRules {
  title: string;
  subtitle: string;
  basicRules: BasicRuleItem[];
}

export const foundationalRules: FoundationalRules = ${JSON.stringify(foundationalRules, null, 2)};

export const sudokuTechniques: SudokuTechnique[] = ${JSON.stringify(techniques, null, 2)};

export function getTechniqueBySlug(slug: string): SudokuTechnique | undefined {
  const normalized = slug.toLowerCase();
  return sudokuTechniques.find(
    (t) => t.slug === normalized || t.originalSlug === normalized
  );
}

export function getTechniqueNavigation(currentSlug: string) {
  const normalized = currentSlug.toLowerCase();
  const currentIndex = sudokuTechniques.findIndex(
    (t) => t.slug === normalized || t.originalSlug === normalized
  );
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = currentIndex > 0 ? sudokuTechniques[currentIndex - 1] : null;
  const next = currentIndex < sudokuTechniques.length - 1 ? sudokuTechniques[currentIndex + 1] : null;
  return { prev, next };
}
`;

  fs.writeFileSync(DATA_FILE, tsContent, "utf-8");
  console.log("Successfully generated " + DATA_FILE);
  console.log("All done!");
}

extractAll().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
