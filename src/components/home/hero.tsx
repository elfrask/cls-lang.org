"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { Terminal } from "@/components/terminal";
import { HERO_SNIPPET } from "@/lib/snippets";

export function Hero() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[30%] h-[300px] w-[300px] rounded-full bg-[#cba6f7]/10 blur-[100px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            {t("hero.badge")}
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero.title1")}{" "}
            <span className="text-gradient">{t("hero.titleAccent")}</span>
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-muted-foreground sm:text-lg">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/docs">
                {t("hero.primaryCta")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/download">
                <Download data-icon="inline-start" />
                {t("hero.secondaryCta")}
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 to-[#cba6f7]/10 blur-2xl" />
          <CodeBlock code={HERO_SNIPPET} lang="clsx" title="hola.clsx" />
          <Terminal
            className="-mt-3 ml-6 w-[calc(100%-3rem)]"
            lines={[
              { text: `${t("hero.terminalUser")}@${t("hero.terminalHost")}: ~ $ ${t("hero.terminalCmd")}`, prompt: false },
              { text: "Hello from CLS!", prompt: false },
              { text: "Hola, soy CLS (Alto)!", prompt: false },
              { text: "sqrt(16) = 4.0", prompt: false },
              { text: "exit code 0", prompt: false },
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
}
