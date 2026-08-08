import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { getAllReleases } from "@/lib/releases";
import { AllVersions } from "@/components/download/all-versions";

export const dynamic = "force-dynamic";

export default async function AllVersionsPage({
  params,
}: PageProps<"/[locale]/download/all_versions">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "allVersions" });

  const releases = getAllReleases();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl">
        {releases.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <AllVersions releases={releases} />
        )}
      </div>
    </section>
  );
}
