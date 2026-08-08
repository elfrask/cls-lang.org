"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TerminalLine = {
  text: string;
  prompt?: boolean;
  typeSpeed?: number;
};

type TerminalProps = {
  lines: TerminalLine[];
  className?: string;
  title?: string;
};

export function Terminal({ lines, className, title }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let cancelled = false;
    const current = lines[Math.min(visibleLines, lines.length - 1)];

    if (visibleLines >= lines.length) return;

    const interval = setInterval(() => {
      if (cancelled) return;
      const target = current.text;
      setTyped((prev) => {
        if (prev.length >= target.length) {
          clearInterval(interval);
          return prev;
        }
        return target.slice(0, prev.length + 1);
      });
    }, current.typeSpeed ?? 22);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [visibleLines, lines]);

  useEffect(() => {
    const current = lines[Math.min(visibleLines, lines.length - 1)];
    if (typed.length >= current.text.length && visibleLines < lines.length) {
      const timeout = setTimeout(
        () => setVisibleLines((v) => v + 1),
        current.prompt === false ? 120 : 320,
      );
      return () => clearTimeout(timeout);
    }
  }, [typed, visibleLines, lines]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-[#101018]/95 font-mono text-[13px] text-[#cdd6f4] shadow-2xl shadow-black/40 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2">
        <span className="size-3 rounded-full bg-[#a6e3a1]" />
        <span className="size-3 rounded-full bg-[#f9e2af]" />
        <span className="size-3 rounded-full bg-[#f38ba8]" />
        <span className="ml-2 text-xs text-muted-foreground">
          {title ?? "terminal"}
        </span>
      </div>
      <div className="scrollbar-thin overflow-x-auto p-4 leading-relaxed">
        {lines.slice(0, visibleLines).map((line, i) => {
          const isLast = i === visibleLines - 1;
          const content = isLast ? typed : line.text;
          return (
            <div key={i} className="whitespace-pre-wrap break-all">
              <span
                className={cn(
                  !isLast &&
                    line.prompt === false &&
                    "text-muted-foreground",
                  isLast && line.prompt !== false && "text-primary",
                )}
              >
                {content}
              </span>
              {isLast && (
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary align-middle" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
