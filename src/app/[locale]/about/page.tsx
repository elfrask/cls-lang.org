import { getTranslations, setRequestLocale } from "next-intl/server";
import { Layers, Target, GitFork, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PHILOSOPHY = [
  "philosophy1",
  "philosophy2",
  "philosophy3",
  "philosophy4",
] as const;

const LAYERS = [
  { key: "layer1", icon: Compass },
  { key: "layer2", icon: Layers },
  { key: "layer3", icon: GitFork },
] as const;

const ROADMAP = [
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "extra",
  "jit",
] as const;

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <Target className="size-3.5 text-primary" />
            CLS 2.0
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </Reveal>
      </section>

      <section className="border-y border-border/60 bg-background/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("philosophyTitle")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PHILOSOPHY.map((p, i) => (
              <Reveal key={p} delay={i * 0.06}>
                <div className="flex h-full gap-4 rounded-xl glass p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-pretty text-sm leading-relaxed text-foreground/90">
                    {t(p)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("layersTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("layersSubtitle")}</p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <Reveal key={layer.key} delay={i * 0.08}>
                <Card className="h-full border-border/60 bg-card/40">
                  <CardHeader>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg glass text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="font-mono text-base">
                      {t(`${layer.key}.title`)}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {t(`${layer.key}.description`)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-background/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("roadmapTitle")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("roadmapSubtitle")}
            </p>
          </Reveal>
          <div className="mx-auto mt-10 max-w-2xl">
            {ROADMAP.map((phase, i) => (
              <Reveal key={phase} delay={i * 0.04}>
                <div className="relative flex gap-4 pb-6">
                  {i < ROADMAP.length - 1 && (
                    <span className="absolute left-[11px] top-6 h-full w-px bg-border" />
                  )}
                  <span className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                    <span className="size-2 rounded-full bg-primary" />
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {t(phase)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl glass-strong px-8 py-12 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {t("repoTitle")}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t("repoDescription")}
              </p>
            </div>
            <Button size="lg" asChild className="shrink-0">
              <a
                href="https://github.com/frask/cls"
                target="_blank"
                rel="noreferrer"
              >
                {t("repoCta")}
              </a>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
