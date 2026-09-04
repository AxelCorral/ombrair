import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "tools", "ombrair-og-source.png");
const output = path.join(root, "public", "og.png");

// La source est la composition Ombrair validée pour la social preview GitHub
// (1280 × 640). Le recadrage central adapte son ratio 2:1 au standard Open
// Graph 1200 × 630 sans déformer le signe, le texte ou les proportions.
await sharp(source)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9, palette: true })
  .toFile(output);

const metadata = await sharp(output).metadata();
const size = (await stat(output)).size;

if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== "png") {
  throw new Error(`Sortie invalide: ${metadata.width}×${metadata.height} ${metadata.format}`);
}
if (size >= 1024 * 1024) {
  throw new Error(`Sortie trop lourde: ${size} octets`);
}

console.log(`Écrit ${path.relative(root, output)} — ${metadata.width}×${metadata.height}, ${size} octets`);
