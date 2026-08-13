"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Line = { type: "input" | "output" | "error"; text: string };

function runCommand(
  cmd: string,
  t: ReturnType<typeof useTranslations<"playground">>,
): Line[] {
  const trimmed = cmd.trim();
  if (!trimmed) return [];

  const parts = trimmed.split(/\s+/);
  const name = parts[0];

  if (name === "echo") {
    const rest = parts.slice(1).join(" ");
    return rest
      ? [{ type: "output", text: rest }]
      : [{ type: "error", text: t("echoUsage") }];
  }

  return [{ type: "error", text: t("unknownCmd", { cmd: name }) }];
}

export type ReplRun = { id: number; code: string };

export function Repl({
  run,
  className,
}: {
  run?: ReplRun | null;
  className?: string;
}) {
  const t = useTranslations("playground");
  const [history, setHistory] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (run && run.id > 0) {
      setHistory((prev) => {
        const lines: Line[] = [];
        const outputs: Line[] = [];
        for (const raw of run.code.split("\n")) {
          const line = raw.trim();
          if (!line) continue;
          const printMatch = line.match(/print\(\s*["']([^"']*)["']\s*\)/);
          if (printMatch) {
            outputs.push({ type: "output", text: printMatch[1] });
            continue;
          }
          if (line.startsWith("echo ")) {
            outputs.push({ type: "output", text: line.slice(5) });
            continue;
          }
          lines.push({ type: "error", text: line });
        }
        return [
          ...prev,
          { type: "input", text: t("runCmd") },
          ...outputs,
          ...lines,
          { type: "output", text: t("exitCode", { code: "0" }) },
        ];
      });
    }
  }, [run, t]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = value;
    setHistory((prev) => [
      ...prev,
      { type: "input", text: cmd },
      ...runCommand(cmd, t),
    ]);
    setValue("");
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-[#101018]/95 font-mono text-[13px] leading-relaxed text-[#cdd6f4] shadow-2xl shadow-black/40 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2">
        <span className="size-3 rounded-full bg-[#a6e3a1]" />
        <span className="size-3 rounded-full bg-[#f9e2af]" />
        <span className="size-3 rounded-full bg-[#f38ba8]" />
        <span className="ml-2 text-xs text-muted-foreground">
          {t("terminalTitle")}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4"
      >
        {history.length === 0 && (
          <div className="space-y-1 text-muted-foreground">
            <p>{t("welcomeLine1")}</p>
            <p>{t("welcomeLine2")}</p>
          </div>
        )}

        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line.type === "input" ? (
              <span>
                <span className="select-none text-primary">
                  {t("promptUser")}@{t("promptHost")}:~$
                </span>{" "}
                {line.text}
              </span>
            ) : (
              <span
                className={cn(
                  line.type === "error" && "text-[#f38ba8]",
                  line.type === "output" && "text-[#a6e3a1]",
                )}
              >
                {line.text}
              </span>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t border-border/60 px-4 py-2.5"
      >
        <span
          aria-hidden
          className="select-none shrink-0 text-primary"
        >
          {t("promptUser")}@{t("promptHost")}:~$
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("inputPlaceholder")}
          aria-label={t("inputPlaceholder")}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
        />
      </form>
    </div>
  );
}