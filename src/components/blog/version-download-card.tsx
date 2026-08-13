import { getTranslations } from "next-intl/server";
import { Download, ArrowRight, Calendar } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReleaseFile } from "@/lib/releases";

export async function VersionDownloadCard({
  locale,
  release,
}: {
  locale: string;
  release: ReleaseFile;
}) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const td = await getTranslations({ locale, namespace: "download" });

  return (
    <div className="relative mt-12 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/60 to-primary/5 p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Download className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-lg font-semibold">
                v{release.version}
              </p>
              <Badge
                variant={
                  release.channel === "release" ? "default" : "secondary"
                }
                className="rounded-full"
              >
                {release.channel === "release" ? td("stable") : td("dev")}
              </Badge>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="size-3.5" />
              {release.released}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Button asChild size="lg">
            <Link href={`/download/${release.version}`}>
              <Download data-icon="inline-start" />
              {t("downloadThisVersion", { version: `v${release.version}` })}
            </Link>
          </Button>
          <Link
            href={`/download/${release.version}`}
            className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
          >
            {t("goToVersionPage")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}