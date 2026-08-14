/**
 * build-docs-index.mjs
 * Escanea todos los .md de public/docs/es y genera public/docs/index.json
 * con las secciones del sidebar y el mapeo slug → ruta de archivo.
 *
 *   node scripts/build-docs-index.mjs
 */
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS_ROOT = join(ROOT, "public", "docs");

/** Orden de secciones y sus claves i18n (docs.sections.<key>). */
const SECTION_ORDER = [
  "guia",
  "lenguaje",
  "stdlib",
  "runtime",
  "herramientas",
  "embedding",
  "desarrollo",
];

/** Orden manual de páginas por sección (por slug base). */
const ORDER_OVERRIDES = {
  guia: ["instalacion", "inicio-rapido", "cli", "configuracion"],
  lenguaje: [
    "sintaxis",
    "tipos",
    "datos",
    "control-de-flujo",
    "funciones",
    "oop",
    "enums",
    "estructuras",
    "modulos",
    "errores",
    "multi-entorno",
    "extension",
    "cmx",
  ],
  stdlib: ["core", "desktop", "primitivos"],
  runtime: ["jit", "walker", "errores", "vfs"],
  herramientas: ["repl", "lsp", "maptype", "clxr", "clxb", "python"],
  embedding: ["python"],
  desarrollo: [
    "arquitectura",
    "contribuir",
    "testing",
    "agregar-feature",
    "agregar-modulo-interno",
  ],
};

function slugify(name) {
  return name
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function firstHeadingTitle(content) {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (frontmatter) {
    const title = frontmatter[1].match(/^title:\s*(.+)$/m);
    if (title) return title[1].trim().replace(/^["']|["']$/g, "");
  }
  const heading = content.match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();
  return null;
}

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

function sortItems(items, section) {
  const override = ORDER_OVERRIDES[section];
  if (!override) return items;
  const order = new Map(override.map((slug, i) => [slug, i]));
  return [...items].sort((a, b) => {
    const oa = order.get(a.slug.split("/").at(-1));
    const ob = order.get(b.slug.split("/").at(-1));
    if (oa !== undefined && ob !== undefined) return oa - ob;
    if (oa !== undefined) return -1;
    if (ob !== undefined) return 1;
    return a.slug.localeCompare(b.slug);
  });
}

function main() {
  const files = [];
  walk(join(DOCS_ROOT, "es"), "", files);

  const bySlug = {};
  const groups = new Map();

  for (const { full, rel } of files) {
    const parts = rel.split(/[\\/]/);
    if (parts.length === 1) continue; // README.md raíz → índice
    const section = parts[0];
    const filename = basename(rel);
    const content = readFileSync(full, "utf8");
    const title =
      firstHeadingTitle(content) ?? filename.replace(/\.md$/i, "");

    // slug calificado por sección: "<seccion>/<resto-slug>"
    // (evita colisiones como lenguaje/errores vs runtime/errores)
    const slug = parts.map(slugify).join("/");

    const entry = { slug, path: rel.replace(/\\/g, "/"), title, section };
    bySlug[slug] = entry;
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(entry);
  }

  const sections = SECTION_ORDER.filter((s) => groups.has(s)).map((key) => ({
    key,
    items: sortItems(groups.get(key), key).map(({ slug, title }) => ({
      slug,
      title,
    })),
  }));

  const output = {
    version: 1,
    sections,
    files: Object.values(bySlug),
  };

  const targets = [join(DOCS_ROOT, "index.json"), join(ROOT, "src", "generated", "docs-index.json")];
  for (const target of targets) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, JSON.stringify(output, null, 2));
  }

  const total = Object.keys(bySlug).length;
  console.log(`✓ índice generado: ${sections.length} secciones, ${total} docs`);
}

main();
