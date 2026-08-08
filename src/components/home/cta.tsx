import { useTranslations } from "next-intl";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function Cta() {
  const t = useTranslations("cta");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-4 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl glass-strong px-6 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-64 w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
          </div>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/download">
                <Download data-icon="inline-start" />
                {t("download")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">
                {t("docs")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
