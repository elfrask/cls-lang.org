import indexData from "@/generated/docs-index.json";

export type DocItem = {
  slug: string;
  title: string;
};

export type DocSection = {
  key: string;
  items: DocItem[];
};

export type DocFile = {
  slug: string;
  path: string;
  title: string;
  section: string;
};

export type DocIndex = {
  version: number;
  sections: DocSection[];
  files: DocFile[];
};

export const docIndex = indexData as DocIndex;

export const DEFAULT_DOC_LANG = "es";

export function getDocBySlug(slug: string): DocFile | undefined {
  return docIndex.files.find((f) => f.slug === slug);
}

export function getSectionOf(slug: string): string | undefined {
  return getDocBySlug(slug)?.section;
}

export function getSiblingDocs(slug: string): {
  prev: DocItem | null;
  next: DocItem | null;
} {
  const section = getSectionOf(slug);
  if (!section) return { prev: null, next: null };
  const items = docIndex.sections.find((s) => s.key === section)?.items ?? [];
  const idx = items.findIndex((i) => i.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? items[idx - 1] : null,
    next: idx < items.length - 1 ? items[idx + 1] : null,
  };
}

/** URL pública del markdown de un doc en un idioma. */
export function docUrl(lang: string, path: string): string {
  return `/docs/${lang}/${path}`;
}

export async function fetchDocMarkdown(
  lang: string,
  path: string,
): Promise<string | null> {
  try {
    const res = await fetch(docUrl(lang, path), { cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}
