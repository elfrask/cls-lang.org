import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { docIndex } from "@/lib/docs";
import { Reveal } from "@/components/reveal";

export default async function DocsIndexPage({
  params,
}: PageProps<"/[locale]/docs">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <div className="min-w-0 flex-1">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{t("subtitle")}</p>
      </header>

      <div className="space-y-8">
        {docIndex.sections.map((section, si) => (
          <Reveal key={section.key} delay={Math.min(si * 0.05, 0.3)}>
            <section>
              <h2 className="text-lg font-semibold tracking-tight">
                {t(`sections.${section.key}`)}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/docs/${item.slug}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-3 transition-all hover:border-primary/40 hover:bg-card/60"
                  >
                    <span className="truncate text-sm">{item.title}</span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
