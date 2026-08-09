"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Loader2, Search, SearchX, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/reveal";

export type BlogListPost = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  isNew?: boolean;
  minutes?: number;
  searchText: string;
};

const CHUNK = 10;

export function BlogList({ posts }: { posts: BlogListPost[] }) {
  const t = useTranslations("blog");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(CHUNK);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => p.searchText.includes(q));
  }, [query, posts]);

  const hasMore = visible < filtered.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + CHUNK, filtered.length));
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative mt-10">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(CHUNK);
          }}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="h-11 rounded-xl pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setVisible(CHUNK);
            }}
            aria-label={t("clearSearch")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center px-4 text-center">
          <SearchX className="size-10 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-semibold">{t("noResultsTitle")}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {t("noResultsText", { query })}
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-4">
          {filtered.slice(0, visible).map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 rounded-2xl glass p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.minutes && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{t("readTime", { minutes: post.minutes })}</span>
                    </>
                  )}
                </div>
                <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                  {post.title}
                  {post.isNew && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 align-middle text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                      <Sparkles className="size-3" />
                      {t("new")}
                    </span>
                  )}
                </h2>
                {post.excerpt && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="mt-3 w-fit transition-colors group-hover:border-primary/40"
                >
                  <span>
                    {t("readMore")}
                    <ArrowRight data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </Link>
            </Reveal>
          ))}

          <div ref={sentinelRef} className="h-px" aria-hidden />

          {hasMore ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {t("loadMore")}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {t("noMore")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
