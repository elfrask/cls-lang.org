import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export type Frontmatter = {
  title?: string;
  date?: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export type BlogPost = {
  meta: BlogPostMeta;
  content: string;
  lang: string;
};

const BLOG_DIR = join(process.cwd(), "public", "blog");
export const DEFAULT_BLOG_LANG = "es";

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(content: string): {
  frontmatter: Frontmatter;
  body: string;
} {
  const match = FRONTMATTER_RE.exec(content);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatter: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    const key = line.slice(0, colon).trim();
    const raw = line.slice(colon + 1).trim();
    let value: string | string[] = raw;
    if (raw.startsWith("[") && raw.endsWith("]")) {
      value = raw
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    } else {
      value = raw.replace(/^['"]|['"]$/g, "");
    }
    if (key === "title") frontmatter.title = value as string;
    else if (key === "date") frontmatter.date = value as string;
    else if (key === "author") frontmatter.author = value as string;
    else if (key === "excerpt") frontmatter.excerpt = value as string;
    else if (key === "tags") frontmatter.tags = value as string[];
    else if (key === "image") frontmatter.image = value as string;
    else if (key === "imageAlt") frontmatter.imageAlt = value as string;
    else if (key === "imageCaption")
      frontmatter.imageCaption = value as string;
  }

  const body = content.slice(match[0].length);
  return { frontmatter, body };
}

export function mergeFrontmatter(
  meta: BlogPostMeta,
  frontmatter: Frontmatter,
): BlogPostMeta {
  return {
    ...meta,
    title: frontmatter.title ?? meta.title,
    date: frontmatter.date ?? meta.date,
    author: frontmatter.author ?? meta.author,
    excerpt: frontmatter.excerpt ?? meta.excerpt,
    tags: frontmatter.tags ?? meta.tags,
    image: frontmatter.image ?? meta.image,
    imageAlt: frontmatter.imageAlt ?? meta.imageAlt,
    imageCaption: frontmatter.imageCaption ?? meta.imageCaption,
  };
}

export function readBlogIndex(lang: string): BlogPostMeta[] {
  const langs = [lang, DEFAULT_BLOG_LANG];
  for (const l of langs) {
    const filePath = join(BLOG_DIR, l, "index.json");
    if (!existsSync(filePath)) continue;
    const data = readJson<{ posts?: BlogPostMeta[] }>(filePath);
    if (!data?.posts) continue;
    const sorted = [...data.posts].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    if (sorted.length > 0 || l === DEFAULT_BLOG_LANG) return sorted;
  }
  return [];
}

export function readBlogPost(
  lang: string,
  slug: string,
): BlogPost | null {
  const langs = [lang, DEFAULT_BLOG_LANG];
  for (const l of langs) {
    const filePath = join(BLOG_DIR, l, `${slug}.md`);
    if (!existsSync(filePath)) continue;
    const raw = readFileSync(filePath, "utf8");
    const { frontmatter, body } = parseFrontmatter(raw);
    const indexMeta = readBlogIndex(l).find((p) => p.slug === slug);
    if (!indexMeta) continue;
    const meta = mergeFrontmatter(indexMeta, frontmatter);
    return { meta, content: body, lang: l };
  }
  return null;
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
