/**
 * fix-doc-fences.mjs
 * Normaliza los code fences de public/docs/es:
 *  - Convierte `ccls`/`clx` → `clsx`
 *  - Asigna lenguaje a los fences vacíos según LANG_MAP (revisado uno a uno)
 *
 *   node scripts/fix-doc-fences.mjs
 */
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
export const DOCS_ROOT = join(ROOT, "public", "docs", "es");

/**
 * Lenguaje asignado a cada fence vacío, por archivo (relativo a es/), en orden.
 * "ps"/"sh"/"bash" = comandos de shell/PowerShell; "clsx" = código CLS;
 * "text" = árboles y salidas de terminal.
 */
const LANG_MAP = {
  "desarrollo/agregar-feature.md": ["text"],
  "desarrollo/agregar-modulo-interno.md": ["clsx"],
  "desarrollo/arquitectura.md": ["text"],
  "desarrollo/contribuir.md": ["text"],
  "guia/cli.md": ["text", "text", "text"],
  "guia/inicio-rapido.md": ["text"],
  "herramientas/clxr.md": ["text", "text"],
  "herramientas/lsp.md": ["text"],
  "herramientas/maptype.md": ["text", "text"],
  "herramientas/repl.md": ["text", "text"],
  "lenguaje/multi-entorno.md": ["text"],
  "runtime/errores.md": ["text", "text"],
  "runtime/walker.md": ["text"],
};

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (name.endsWith(".md")) files.push(full);
  }
  return files;
}

export function fixDocFences(root = DOCS_ROOT) {
  const files = walk(root);
  const stats = { changedFiles: 0, unmarkedAssigned: 0, normalized: 0, remaining: [] };

  for (const file of files) {
    const rel = file.slice(root.length).replace(/^[\\/]+/, "").replace(/\\/g, "/");
    const expected = LANG_MAP[rel];
    const raw = readFileSync(file, "utf8");
    const eol = raw.includes("\r\n") ? "\r\n" : "\n";
    const lines = raw.split(/\r?\n/);
    let fence = null;
    let li = 0;
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
      const m = /^(`{3,})\s*([^\s`]*)\s*$/.exec(lines[i]);
      if (!m) continue;
      if (!fence) {
        const current = m[2];
        if (current === "ccls" || current === "clx") {
          lines[i] = `${m[1]}clsx`;
          changed = true;
          stats.normalized++;
          fence = { assigned: "clsx" };
        } else if (current === "") {
          const assigned = expected ? expected[li] : undefined;
          li++;
          if (assigned) {
            lines[i] = `${m[1]}${assigned}`;
            changed = true;
            stats.unmarkedAssigned++;
            fence = { assigned };
          } else {
            stats.remaining.push(`${rel} #${li}`);
            fence = { assigned: "" };
          }
        } else {
          lines[i] = `${m[1]}${current}`;
          if (lines[i] !== m[0]) changed = true;
          fence = { assigned: current };
        }
      } else {
        fence = null;
      }
    }

    if (changed) {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, lines.join(eol));
      stats.changedFiles++;
    }
  }
  return stats;
}

function main() {
  const s = fixDocFences();
  console.log(`✓ ${s.changedFiles} archivos editados`);
  console.log(`  ${s.unmarkedAssigned} fences vacíos con lenguaje asignado`);
  console.log(`  ${s.normalized} fences ccls/clx → clsx`);
  if (s.remaining.length) {
    console.log(`  ⚠ sin asignar (${s.remaining.length}):`);
    for (const r of s.remaining) console.log(`    - ${r}`);
  }
}

main();
