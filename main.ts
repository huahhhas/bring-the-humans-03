// bring-the-humans-03 — entrypoint (grader runs this with node22).
// Reads VIDEO.json (the TikTok post URL of the ad) and copies it to the
// grader output directory, so the entry always surfaces the post it was
// submitted with. Pure node stdlib: no dependencies, no network.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const raw = readFileSync(join(HERE, "VIDEO.json"), "utf8");
const video = JSON.parse(raw) as { url?: unknown };

if (typeof video.url !== "string") {
  console.error("VIDEO.json must contain a string field \"url\".");
  process.exit(1);
}

// A real post looks like https://www.tiktok.com/@<handle>/video/<id>.
// Until Boss posts the video and pastes its URL in, VIDEO.json holds a
// clearly-marked TODO placeholder: warn loudly, but still copy it through
// and exit 0, so the entrypoint itself always runs cleanly.
const TIKTOK_POST = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._-]+\/video\/\d+$/;
if (!TIKTOK_POST.test(video.url)) {
  console.error(
    `WARNING: VIDEO.json url is not a TikTok post URL yet (${JSON.stringify(video.url)}). ` +
      "Post ad.mp4 to TikTok from a public account and paste the post URL into VIDEO.json before submitting."
  );
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "VIDEO.json"), JSON.stringify(video, null, 2) + "\n");
console.log(`Wrote VIDEO.json to ${OUT_DIR} (url: ${video.url})`);
