import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Sparkles, Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const AUTHOR_EMAIL = "elfraskdev@gmail.com";

export default async function ShowcasePage({
  params,
}: PageProps<"/[locale]/showcase">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "showcase" });

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-20 pt-16 sm:px-6">
      <Reveal className="mx-auto max-w-xl text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl glass text-primary">
          <Sparkles className="size-7" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-8 rounded-2xl glass p-8">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("emptyTitle")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("emptyText")}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <a href={`mailto:${AUTHOR_EMAIL}`}>
                <Mail data-icon="inline-start" />
                {t("emailCta")}
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/docs">{t("docsCta")}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
