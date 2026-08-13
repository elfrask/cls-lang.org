"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FileCode, SquareTerminal, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/playground/editor";
import { Repl, type ReplRun } from "@/components/playground/repl";

const INITIAL_CODE = `function main() -> int {
    print("Hola, CLS!");
    return 0;
}`;

type TabId = "editor" | "terminal";

function useIsPortrait() {
  const [portrait, setPortrait] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(orientation: portrait)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const onChange = (e: MediaQueryListEvent) => setPortrait(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return portrait;
}

export function PlaygroundClient() {
  const t = useTranslations("playground");
  const portrait = useIsPortrait();
  const [code, setCode] = useState(INITIAL_CODE);
  const [run, setRun] = useState<ReplRun | null>(null);
  const [tab, setTab] = useState<TabId>("editor");

  const handleRun = useCallback(() => {
    setRun((prev) => ({ id: (prev?.id ?? 0) + 1, code }));
    setTab("terminal");
  }, [code]);

  if (portrait) {
    return (
      <div className="grid gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("editor")}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
              tab === "editor"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            <FileCode className="size-4" />
            {t("tabEditor")}
          </button>
          <button
            type="button"
            onClick={() => setTab("terminal")}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
              tab === "terminal"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            <SquareTerminal className="size-4" />
            {t("tabTerminal")}
          </button>
          <button
            type="button"
            onClick={handleRun}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play className="size-4" />
            {t("runButton")}
          </button>
        </div>

        {tab === "editor" ? (
          <Editor value={code} onChange={setCode} onRun={handleRun} className="h-[420px]" />
        ) : (
          <Repl run={run} className="h-[420px]" />
        )}
      </div>
    );
  }

  return (
    <div className="grid items-stretch gap-4 lg:gap-6 md:grid-cols-2">
      <Editor value={code} onChange={setCode} onRun={handleRun} className="h-[460px]" />
      <Repl run={run} className="h-[460px]" />
    </div>
  );
}