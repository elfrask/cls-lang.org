"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type CodeBlockProps = {
  code: string;
  lang?: string;
  title?: string;
  showDots?: boolean;
  className?: string;
};

export function CodeBlock({
  code,
  lang,
  title,
  showDots = true,
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    let cancelled = false;
    import("@/lib/highlighter").then(async ({ highlightCode }) => {
      if (cancelled) return;
      const highlighted = await highlightCode(code, lang);
      if (!cancelled) {
        setHtml(
          highlighted
            .replace(/^<pre[^>]*>/, "")
            .replace(/<\/pre>$/, ""),
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-[#181825] shadow-2xl shadow-black/40 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {showDots && (
            <>
              <span className="size-3 rounded-full bg-[#f38ba8]" />
              <span className="size-3 rounded-full bg-[#f9e2af]" />
              <span className="size-3 rounded-full bg-[#a6e3a1]" />
            </>
          )}
          {title && (
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              {title}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={copy}
          aria-label={t("common.copy")}
        >
          {copied ? (
            <Check className="size-3.5 text-primary" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      <div className="scrollbar-thin overflow-x-auto p-4 text-[13px] leading-relaxed">
        {html ? (
          <div
            className="[&_.line]:block [&_.line]:whitespace-pre [&_code]:font-mono [&_code]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="font-mono text-[#cdd6f4]">{code}</pre>
        )}
      </div>
    </div>
  );
}
