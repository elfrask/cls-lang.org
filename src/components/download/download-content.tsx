import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import {
  Monitor,
  Server,
  Apple,
  FileArchive,
  Download,
  CheckCircle2,
  ChevronRight,
  FileQuestion,
  ArrowLeft,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  pickAsset,
  type ReleaseFile,
  type ReleaseAsset,
  type AssetType,
} from "@/lib/releases";

type PlatformKey = "windows" | "linux" | "macos" | "source";

const PLATFORM_KEYS: { key: PlatformKey; icon: typeof Monitor }[] = [
  { key: "windows", icon: Monitor },
  { key: "linux", icon: Server },
  { key: "macos", icon: Apple },
  { key: "source", icon: FileArchive },
];

function detectSystem(
  ua: string,
): { platform: PlatformKey; arch: string } {
  let platform: PlatformKey = "linux";
  let arch = "x64";
  if (/Windows/i.test(ua)) platform = "windows";
  else if (/Macintosh|Mac OS X/i.test(ua)) platform = "macos";
  if (/arm64|aarch64|ARM Mac/i.test(ua)) arch = "arm64";
  return { platform, arch };
}

function assetUrl(channel: "release" | "dev", asset: ReleaseAsset) {
  return `/download/${channel}/${asset.filename}`;
}

export async function DownloadContent({
  locale,
  release,
}: {
  locale: string;
  release: ReleaseFile | undefined;
}) {
  const t = await getTranslations({ locale, namespace: "download" });
  const tv = await getTranslations({ locale, namespace: "allVersions" });

  if (!release) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 pb-20 pt-16 sm:px-6">
        <Reveal className="flex flex-col items-center text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl glass text-muted-foreground">
            <FileQuestion className="size-6" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("versionNotFoundTitle")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {t("versionNotFoundText")}
          </p>
          <Link
            href="/download"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" />
            {t("backToDownloads")}
          </Link>
        </Reveal>
      </section>
    );
  }

  if (release.comingSoon) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge className="rounded-full">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("comingSoon")}
            </Badge>
            <span className="rounded-full glass px-3 py-1 font-mono text-xs text-muted-foreground">
              {`v${release.version}`}
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("comingSoonTitle", { version: `v${release.version}` })}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t(release.blog ? "comingSoonBlogText" : "comingSoonText")}
          </p>
          {release.blog && (
            <Link
              href={`/blog/${release.blog}`}
              className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("readAnnouncement")}
            </Link>
          )}
          <div className="mt-6">
            <Link
              href="/download/all_versions"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("viewAllVersions")}
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    );
  }

  const current = release;

  const assetLabel = (key: PlatformKey, asset: ReleaseAsset) => {
    const type = (asset.type ?? "portable") as AssetType;
    if (key === "source") {
      return type === "enlace"
        ? t("sourceDownloadBtn")
        : `${t("sourceDownloadBtn")} · ${asset.format ?? asset.arch}`;
    }
    const arch = asset.arch !== "all" ? ` · ${asset.arch}` : "";
    return `${tv(`types.${type}`)}${arch}`;
  };

  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const detected = detectSystem(ua);
  const recommended = pickAsset(current, detected.platform, detected.arch);

  const grouped = new Map<PlatformKey, ReleaseAsset[]>();
  for (const { key } of PLATFORM_KEYS) {
    grouped.set(
      key,
      current.assets.filter((a) => a.platform === key),
    );
  }

  const visiblePlatforms = PLATFORM_KEYS.filter(
    ({ key }) => (grouped.get(key)?.length ?? 0) > 0,
  );

  const gridCols =
    visiblePlatforms.length >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : visiblePlatforms.length === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : visiblePlatforms.length === 2
          ? "sm:grid-cols-2"
          : "max-w-md";

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge className="rounded-full">
              <span className="size-1.5 rounded-full bg-primary" />
              {current.channel === "release" ? t("stable") : t("dev")}
            </Badge>
            <span className="rounded-full glass px-3 py-1 font-mono text-xs text-muted-foreground">
              {`v${current.version}`}
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {current.blog
              ? t("titleWithVersion", { version: `v${current.version}` })
              : t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </Reveal>

        {current.blog && (
          <Reveal className="mt-6 text-center" delay={0.05}>
            <Link
              href={`/blog/${current.blog}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("viewDevlog")}
              <ChevronRight className="size-4" />
            </Link>
          </Reveal>
        )}

        {recommended && (
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <div className="flex flex-col items-center gap-4 rounded-2xl glass p-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Download className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("autoText")}
                  </p>
                  <p className="font-semibold">
                    {t(`${recommended.platform}.name`)}{" "}
                    {recommended.arch !== "all" ? recommended.arch : ""} · v
                    {current.version}
                  </p>
                </div>
              </div>
              <Button asChild size="lg">
                <a href={assetUrl(current.channel, recommended)}>
                  <Download data-icon="inline-start" />
                  {t("autoBtn", { version: `v${current.version}` })}
                </a>
              </Button>
            </div>
          </Reveal>
        )}

        {visiblePlatforms.length > 0 ? (
          <div className={`mt-12 grid gap-4 ${gridCols}`}>
            {visiblePlatforms.map(({ key, icon: Icon }, i) => {
              const assets = grouped.get(key) ?? [];
              return (
                <Reveal key={key} delay={i * 0.07}>
                  <div className="flex h-full flex-col rounded-2xl glass p-6 transition-colors hover:border-primary/40">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="font-semibold">{t(`${key}.name`)}</h2>
                    <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                      {t(`${key}.description`)}
                    </p>
                    {key !== "source" && (
                      <code className="mt-4 block overflow-x-auto rounded-lg bg-[#181825] px-3 py-2 font-mono text-xs text-[#a6e3a1]">
                        {t(`${key}.cmd`)}
                      </code>
                    )}
                    <div className="mt-4 flex flex-col gap-2">
                      {assets.map((asset) => (
                        <Button
                          key={asset.filename}
                          asChild
                          size="sm"
                          variant={i === 0 ? "default" : "outline"}
                        >
                          <a href={assetUrl(current.channel, asset)}>
                            <Download data-icon="inline-start" />
                            {assetLabel(key, asset)}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal className="mt-12">
            <div className="flex flex-col items-center gap-2 rounded-2xl glass p-10 text-center">
              <Download className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
            </div>
          </Reveal>
        )}

        <Reveal className="mt-16 text-center">
          <Link
            href="/download/all_versions"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t("viewAllVersions")}
            <ChevronRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      <section className="border-y border-border/60 bg-background/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight">
                {t("instruccionesTitle")}
              </h2>
              <ol className="mt-6 space-y-4">
                {(["1", "2", "3", "4"] as const).map((step) => (
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