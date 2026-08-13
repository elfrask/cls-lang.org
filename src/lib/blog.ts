import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
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
    const content = readFileSync(filePath, "utf8");
    const meta = readBlogIndex(l).find((p) => p.slug === slug);
    if (!meta) continue;
    return { meta, content, lang: l };
  }
  return null;
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
