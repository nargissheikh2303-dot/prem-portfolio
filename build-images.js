/* =====================================================================
   build-images.js
   Reads the three folders inside /images and writes images.js, which the
   landing page uses to fill its sections:

     images/youtube-thumbnail/  ->  "YouTube Thumbnails" section
     images/graphic-design/     ->  "Graphic Design" section
     images/logo/               ->  "Logo Design" section

   Cloudflare Pages runs this on every deploy (build command:
   node build-images.js), so an image uploaded to one of these folders
   shows up on the site by itself. No list to edit.

   Order: newest upload first when the upload dates are available from git,
   otherwise by file name (1, 2, 10 sort correctly).
   ===================================================================== */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = __dirname;
const EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

const SECTIONS = {
  thumbnails: "images/youtube-thumbnail",
  graphics: "images/graphic-design",
  logos: "images/logo",
};

// Shown only while a folder is still empty, so the section never looks broken.
// Once you upload your own images to that folder, these stop being used.
const OLD = "https://portfolio.mydigitalsavvy.com/wp-content/uploads/2026/08/";
const FALLBACK = {
  thumbnails: ["forex-trading.png", "Trade-With-Sanika.jpeg", "Trade-Like-Ridhi.jpeg",
               "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg"].map(f => OLD + f),
  graphics: [],
  logos: ["45-1.png", "44-1.png", "43-1.png", "42-1.png", "30-1.png", "29-1.png", "28-1.png",
          "26-1.png", "23-1.png", "22-2.png", "20-1.png", "19-1.png", "18-1.png"].map(f => OLD + f),
};

// When each file was last added or changed, from git history (if there is any).
// Cloudflare checks out only the latest commit, which makes every file look
// equally new, so the full history is fetched first.
function gitDates() {
  const dates = {};
  try {
    const shallow = execSync("git rev-parse --is-shallow-repository", {
      cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (shallow === "true") {
      execSync("git fetch --unshallow --quiet", { cwd: ROOT, stdio: "ignore", timeout: 60000 });
    }
  } catch (e) { /* no git or no network: dates may be missing, names are used */ }
  try {
    const out = execSync('git log --format="@%ct" --name-only -- images', {
      cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    });
    let t = 0;
    out.split("\n").forEach(line => {
      line = line.trim();
      if (!line) return;
      if (line[0] === "@") { t = Number(line.slice(1)); return; }
      if (!(line in dates)) dates[line] = t;   // log is newest first
    });
  } catch (e) { /* no git here: fall back to names */ }
  return dates;
}

const byName = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare;
const dates = gitDates();
const result = {};

for (const [key, dir] of Object.entries(SECTIONS)) {
  const abs = path.join(ROOT, dir);
  fs.mkdirSync(abs, { recursive: true });

  const files = fs.readdirSync(abs).filter(f => EXT.test(f) && !f.startsWith("."));
  const rel = f => dir + "/" + f;

  files.sort((a, b) => {
    const da = dates[rel(a)] || 0, db = dates[rel(b)] || 0;
    return db - da || byName(a, b);
  });

  result[key] = files.length
    ? files.map(f => dir + "/" + encodeURIComponent(f))
    : FALLBACK[key];

  console.log(`${dir}: ${files.length ? files.length + " images" : "empty, using old links"}`);
}

const js =
  "/* Made by build-images.js - don't edit by hand. Upload images to the\n" +
  "   folders in /images instead; this file is rebuilt on every deploy. */\n" +
  "window.PORTFOLIO_IMAGES = " + JSON.stringify(result, null, 2) + ";\n";

fs.writeFileSync(path.join(ROOT, "images.js"), js);
console.log("images.js written");
