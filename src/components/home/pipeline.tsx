import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { CodeBlock } from "@/components/code-block";
import { PIPELINE_SNIPPETS } from "@/lib/snippets";

const STEPS = ["step1", "step2", "step3", "step4"] as const;

const SNIPPETS = [
  PIPELINE_SNIPPETS.lexer,
  PIPELINE_SNIPPETS.typeck,
  PIPELINE_SNIPPETS.wasm,
] as const;

export function Pipeline() {
  const t = useTranslations("pipeline");

  return (
    <section className="border-y border-border/60 bg-background/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <Reveal key={step} delay={i * 0.08}>
                <div className="flex gap-4 rounded-xl glass p-5 transition-colors hover:border-primary/30">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{t(`${step}.title`)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`${step}.description`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="flex flex-col gap-4 lg:pl-6">
              <CodeBlock
                code={SNIPPETS[0]}
                lang="clsx"
                title="lexer + parser"
                showDots={false}
              />
              <CodeBlock
                code={SNIPPETS[1]}
                lang="clsx"
                title="type checker"
                showDots={false}
              />
              <CodeBlock
                code={SNIPPETS[2]}
                lang="bash"
                title="wasm backend"
                showDots={false}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
