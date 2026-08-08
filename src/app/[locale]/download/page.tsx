import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import {
  Monitor,
  Terminal as TerminalIcon,
  Apple,
  Server,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PLATFORMS = [
  {
    key: "windows",
    icon: Monitor,
    href: "https://github.com/frask/cls/releases",
  },
  {
    key: "linux",
    icon: Server,
    href: "https://github.com/frask/cls/releases",
  },
  {
    key: "macos",
    icon: Apple,
    href: "https://github.com/frask/cls/releases",
  },
  {
    key: "wasi",
    icon: TerminalIcon,
    href: "https://github.com/frask/cls/releases",
  },
] as const;

export default async function DownloadPage({
  params,
}: PageProps<"/[locale]/download">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "download" });

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge className="rounded-full">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("stable")}
            </Badge>
            <span className="rounded-full glass px-3 py-1 font-mono text-xs text-muted-foreground">
              {t("version")}
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((platform, i) => {
            const Icon = platform.icon;
            return (
              <Reveal key={platform.key} delay={i * 0.07}>
                <div className="flex h-full flex-col rounded-2xl glass p-6 transition-colors hover:border-primary/40">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="font-semibold">{t(`${platform.key}.name`)}</h2>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                    {t(`${platform.key}.description`)}
                  </p>
                  <code className="mt-4 block overflow-x-auto rounded-lg bg-[#181825] px-3 py-2 font-mono text-xs text-[#a6e3a1]">
                    {t(`${platform.key}.cmd`)}
                  </code>
                  <Button
                    className="mt-4"
                    asChild
                    variant={i === 0 ? "default" : "outline"}
                  >
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download data-icon="inline-start" />
                      {t("version")}
                    </a>
                  </Button>
                  <span className="mt-3 self-end text-[11px] text-muted-foreground">
                    {t("comingSoon")}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-background/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight">
                {t("instruccionesTitle")}
              </h2>
              <ol className="mt-6 space-y-4">
                {(
                  ["1", "2", "3", "4"] as const
                ).map((step) => (
                  <li key={step} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {t(`steps.${step}`)}
                      {step === "3" && (
                        <code className="ml-2 rounded bg-[#181825] px-2 py-0.5 font-mono text-xs text-[#a6e3a1]">
                          {t("verifyCmd")}
                        </code>
                      )}
                      {step === "4" && (
                        <code className="ml-2 rounded bg-[#181825] px-2 py-0.5 font-mono text-xs text-[#a6e3a1]">
                          {t("newCmd")}
                        </code>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.12}>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {t("viaCargo")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("viaCargoText")}
                </p>
                <CodeBlock
                  className="mt-4"
                  code={t("cargoCmd")}
                  lang="bash"
                  title="terminal"
                  showDots={false}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
