/**
 * sync-docs.mjs
 * Copia la documentación markdown del repo CLS hacia public/docs/es/.
 *
 *   node scripts/sync-docs.mjs
 *   # o con ruta custom:
 *   CLS_DOCS_SOURCE="C:/ruta/cls/docs" node scripts/sync-docs.mjs
 */
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fixDocFences, DOCS_ROOT } from "./fix-doc-fences.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE =
  process.env.CLS_DOCS_SOURCE || "C:/Users/Frask/Documents/cls/docs";
const DEST = join(ROOT, "public", "docs", "es");

function walk(dir, rel, files) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, join(rel, name), files);
    } else if (name.endsWith(".md")) {
      files.push({ full, rel: join(rel, name) });
    }
  }
}

function main() {
  const files = [];
  if (!statSync(SOURCE).isDirectory()) {
    console.error(`No existe la carpeta de docs: ${SOURCE}`);
    process.exit(1);
  }
  walk(SOURCE, "", files);

  for (const { full, rel } of files) {
    const dest = join(DEST, rel);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(full, dest);
  }

  console.log(`✓ ${files.length} archivos .md copiados → public/docs/es/`);

  const s = fixDocFences(DOCS_ROOT);
  console.log(
    `✓ fences normalizados: ${s.unmarkedAssigned} asignados, ${s.normalized} ccls/clx → clsx`,
  );
}

main();
