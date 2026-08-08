"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  FileQuestion,
  Globe,
  Github,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/docs/markdown";
import {
  DEFAULT_DOC_LANG,
  fetchDocMarkdown,
  getSiblingDocs,
  type DocFile,
} from "@/lib/docs";

function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const level = m[1].length;
    const raw = m[2];
    const text = raw
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_]/g, "")
      .trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u00C0-\uFFFF\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    if (level >= 2 && level <= 3) headings.push({ id, text, level });
  }
  return headings;
}

export function DocViewer({ doc }: { doc: DocFile }) {
  const t = useTranslations("docs");
  const locale = useLocale();
  const [content, setContent] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const primary = await fetchDocMarkdown(locale, doc.path);
      if (cancelled) return;

      if (primary !== null) {
        setContent(primary);
        setUsingFallback(false);
        return;
      }

      const fallback = await fetchDocMarkdown(DEFAULT_DOC_LANG, doc.path);
      if (cancelled) return;

      if (fallback !== null) {
        setContent(fallback);
        setUsingFallback(true);
      } else {
        setNotFound(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [locale, doc.path]);

  const siblings = getSiblingDocs(doc.slug);
  const headings = content ? extractHeadings(content) : [];

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <FileQuestion className="size-12 text-muted-foreground/40" />
        <h1 className="mt-4 text-xl font-bold">{t("notFound")}</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t("notFoundText")}
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/docs">
            <ArrowLeft data-icon="inline-start" />
            {t("backToIndex")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="min-w-0 flex-1">
      {usingFallback && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          <Globe className="mt-0.5 size-4 shrink-0 text-amber-400" />
          <p className="text-amber-200/90">{t("notTranslated")}</p>
        </div>
      )}

      {content === null ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-8 animate-spin" />
        </div>
      ) : (
        <>
          <Markdown content={content} doc={doc} />

          <div className="mt-12 border-t border-border/60 pt-6">
            <div className="flex items-center justify-between gap-4">
              {siblings.prev ? (
                <Link
                  href={`/docs/${siblings.prev.slug}`}
                  className="group flex-1 rounded-xl glass p-4 transition-colors hover:border-primary/40"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="size-3.5" />
                    {t("prev")}
                  </span>
                  <span className="mt-1.5 block truncate text-sm font-medium group-hover:text-primary">
                    {siblings.prev.title}
                  </span>
                </Link>
              ) : (
                <span className="flex-1" />
              )}
              {siblings.next ? (
                <Link
                  href={`/docs/${siblings.next.slug}`}
                  className="group flex-1 rounded-xl glass p-4 text-right transition-colors hover:border-primary/40"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    {t("next")}
                    <ArrowRight className="size-3.5" />
                  </span>
                  <span className="mt-1.5 block truncate text-sm font-medium group-hover:text-primary">
                    {siblings.next.title}
                  </span>
                </Link>
              ) : (
                <span className="flex-1" />
              )}
            </div>
          </div>

          <a
            href={`https://github.com/frask/cls/blob/main/docs/${doc.path}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-4" />
            {t("editPage")}
          </a>
        </>
      )}

      {headings.length > 0 && (
        <nav className="fixed right-6 top-24 hidden max-h-[70vh] w-56 overflow-y-auto xl:block">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("onThisPage")}
          </p>
          <ul className="space-y-1 border-l border-border/60">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="block truncate rounded-r-md px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  style={{ paddingLeft: h.level === 3 ? "1.75rem" : "0.75rem" }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
