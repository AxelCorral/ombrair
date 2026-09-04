import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1200;
const HEIGHT = 630;

function token(css, name) {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --color-${name} introuvable dans app/globals.css`);
  return match[1];
}

function mixHex(foreground, background, foregroundRatio) {
  const channels = (hex) => [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
  const fg = channels(foreground);
  const bg = channels(background);
  return `#${fg
    .map((value, index) => Math.round(value * foregroundRatio + bg[index] * (1 - foregroundRatio)))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

async function embeddedFont(family, cssFamily) {
  const cssDir = path.join(ROOT, ".next", "static", "css", "app");
  const cssFiles = (await readdir(cssDir)).filter((name) => name.endsWith(".css"));

  for (const cssFile of cssFiles) {
    const css = await readFile(path.join(cssDir, cssFile), "utf8");
    const familyOffset = css.indexOf(`font-family: '${cssFamily}'`);
    if (familyOffset === -1) continue;

    // next/font emits the extended subset first and the Latin subset second.
    const latinOffset = css.indexOf("unicode-range: U+0000-00FF", familyOffset);
    const blockStart = css.lastIndexOf("@font-face", latinOffset);
    const block = css.slice(blockStart, latinOffset);
    const url = block.match(/url\((\/_next\/static\/media\/[^)]+\.woff2)\)/)?.[1];
    if (!url) continue;

    const fontPath = path.join(ROOT, ".next", url.replace("/_next/", ""));
    const data = await readFile(fontPath);
    return `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${data.toString("base64")}) format('woff2');font-style:normal;font-weight:300 600;}`;
  }

  throw new Error(`Police ${cssFamily} introuvable. Lancez d'abord npm run build.`);
}

const globals = await readFile(path.join(ROOT, "app", "globals.css"), "utf8");
const chaux = token(globals, "chaux");
const persienne = token(globals, "persienne");
const nuit = token(globals, "nuit");
const lameSourde = mixHex(chaux, persienne, 0.55);
const fonts = `${await embeddedFont("Ombrair Outfit", "Outfit")}\n${await embeddedFont(
  "Ombrair Instrument",
  "Instrument Sans"
)}`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <style>${fonts}</style>
  <rect width="1200" height="630" fill="${chaux}"/>

  <!-- Une seule ouverture architecturale, construite comme le signe officiel 4 × 5. -->
  <path d="M850 535 L850 215 A125 125 0 0 1 1100 215 L1100 535 Q1100 540 1095 540 L855 540 Q850 540 850 535 Z" fill="${persienne}"/>
  <rect x="893.25" y="296.75" width="163.5" height="24.06" rx="5" fill="${chaux}"/>
  <rect x="893.25" y="349.88" width="163.5" height="24.06" rx="5" fill="${chaux}"/>
  <rect x="893.25" y="402.63" width="163.5" height="24.06" rx="5" fill="${lameSourde}"/>

  <line x1="108" y1="122" x2="108" y2="500" stroke="${persienne}" stroke-width="2"/>
  <text x="154" y="290" fill="${persienne}" font-family="Ombrair Outfit" font-size="116" font-weight="300" letter-spacing="7">ombrair</text>
  <text x="158" y="359" fill="${nuit}" font-family="Ombrair Instrument" font-size="31" font-weight="400">la fraîcheur, avant la chaleur.</text>
  <text x="158" y="488" fill="${persienne}" font-family="Ombrair Instrument" font-size="16" font-weight="500" letter-spacing="2.8">PROJET ÉTUDIANT FICTIF</text>
</svg>`;

const output = path.join(ROOT, "public", "og.png");
await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(output);

const metadata = await sharp(output).metadata();
if (metadata.width !== WIDTH || metadata.height !== HEIGHT || metadata.format !== "png") {
  throw new Error(`Sortie invalide: ${metadata.width}×${metadata.height} ${metadata.format}`);
}

console.log(`Écrit ${path.relative(ROOT, output)} — ${metadata.width}×${metadata.height}`);
