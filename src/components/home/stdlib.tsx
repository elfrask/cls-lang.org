import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { STDLIB_MODULES } from "@/lib/snippets";

export function Stdlib() {
  const t = useTranslations("stdlib");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STDLIB_MODULES.map((mod, i) => (
          <Reveal key={mod.name} delay={i * 0.05}>
            <div className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card/40 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-card/60">
              <code className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold text-primary">
                {mod.name}
              </code>
              <span className="text-sm text-muted-foreground">
                {mod.desc}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
