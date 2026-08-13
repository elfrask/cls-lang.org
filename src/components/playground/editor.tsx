"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 160;
const TAB_SIZE = 4;

export function Editor({
  value,
  onChange,
  onRun,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  onRun: () => void;
  className?: string;
}) {
  const t = useTranslations("playground");
  const [html, setHtml] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const { highlightCode } = await import("@/lib/highlighter");
      const highlighted = await highlightCode(value, "clsx");
      if (!cancelled) {
        setHtml(
          highlighted
            .replace(/^<pre[^>]*>/, "")
            .replace(/<\/pre>$/, ""),
        );
      }
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [value]);

  const syncScroll = () => {
    const area = areaRef.current;
    const pre = preRef.current;
    if (!area || !pre) return;
    pre.scrollTop = area.scrollTop;
    pre.scrollLeft = area.scrollLeft;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const area = e.currentTarget;
      const start = area.selectionStart;
      const end = area.selectionEnd;
      const next = value.slice(0, start) + " ".repeat(TAB_SIZE) + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        area.selectionStart = area.selectionEnd = start + TAB_SIZE;
      });
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
    }
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-[#181825] shadow-2xl shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#f38ba8]" />
          <span className="size-3 rounded-full bg-[#f9e2af]" />
          <span className="size-3 rounded-full bg-[#a6e3a1]" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            {t("editorTitle")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary sm:inline">
            .clsx
          </span>
          <button
            type="button"
            onClick={onRun}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play className="size-3.5" data-icon="inline-start" />
            {t("runButton")}
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <pre
          ref={preRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 m-0 overflow-auto p-4 font-mono text-[13px] leading-relaxed text-[#cdd6f4]"
        >
          <code
            className="whitespace-pre font-mono [&_.line]:whitespace-pre"
            dangerouslySetInnerHTML={{
              __html: html ?? escapeHtml(value),
            }}
          />
        </pre>
        <textarea
          ref={areaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label={t("editorTitle")}
          className="absolute inset-0 m-0 h-full w-full resize-none overflow-auto bg-transparent p-4 font-mono text-[13px] leading-relaxed text-transparent caret-[#cdd6f4] outline-none selection:bg-primary/30"
        />
      </div>
    </div>
  );
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}