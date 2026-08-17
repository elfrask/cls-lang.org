"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ChevronDown,
  Package,
  HardDriveDownload,
  FileArchive,
  Link as LinkIcon,
  Monitor,
  Server,
  Apple,
  FileCode2,
  Globe,
  Loader2,
  Download,
  ArrowRight,
  Wrench,
  Terminal,
  Braces,
  Boxes,
  FileJson,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ReleaseFile,
  ReleaseAsset,
  AssetType,
} from "@/lib/releases";

const CHUNK = 5;

const TYPE_ICONS: Record<AssetType, LucideIcon> = {
  paquete: Package,
  instalador: HardDriveDownload,
  portable: FileArchive,
  enlace: LinkIcon,
  "ejecutable-sdk": Wrench,
  "ejecutable-runtime": Terminal,
  "binding-c": Braces,
  "binding-python": Boxes,
  "binding-js": FileJson,
};

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  windows: Monitor,
  linux: Server,
  macos: Apple,
  source: FileCode2,
  web: Globe,
};

function assetUrl(_channel: "release" | "dev", asset: ReleaseAsset) {
  return asset.url;
}

function VersionAccordion({
  release,
  open,
  onToggle,
}: {
  release: ReleaseFile;
  open: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("allVersions");
  const td = useTranslations("download");
  const key = `${release.channel}-${release.version}`;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-colors hover:border-border/80"
      data-release={key}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={t(open ? "collapse" : "expand", {
            version: `v${release.version}`,
          })}
          className="flex min-w-0 flex-1 items-center gap-3 text-left transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
          <span className="font-mono text-sm font-semibold">
            v{release.version}
          </span>
          <Badge
            variant={release.channel === "release" ? "default" : "secondary"}
            className="rounded-full"
          >
            {release.channel === "release" ? td("stable") : td("dev")}
          </Badge>
        </button>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/download/${release.version}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t("viewVersionPage")}
            <ArrowRight className="size-3.5" />
          </Link>
          <span className="text-xs text-muted-foreground">
            {release.released}
          </span>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60">
          {(release.highlights?.length ?? 0) > 0 && (
            <div className="px-5 py-4">
              <h3 className="text-sm font-semibold">
                {t("highlightsTitle")}
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-primary/60">
                {release.highlights?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {release.blog && (
                <Link
                  href={`/blog/${release.blog}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  {t("viewDevlog")}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-y border-border/60 bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">{t("platformCol")}</th>
                  <th className="px-5 py-3 font-medium">{t("typeCol")}</th>
                  <th className="px-5 py-3 font-medium">{t("dateCol")}</th>
                  <th className="px-5 py-3 font-medium">{t("downloadCol")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {release.assets.map((asset) => {
                  const type = (asset.type ?? "portable") as AssetType;
                  const TypeIcon = TYPE_ICONS[type];
                  const PlatformIcon =
                    PLATFORM_ICONS[asset.platform] ?? Globe;
                  const showHash =
                    type !== "enlace" && Boolean(asset.checksum);
                  return (
                    <tr key={asset.filename}>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2">
                          <PlatformIcon className="size-4 text-muted-foreground" />
                          {t(`platforms.${asset.platform}`)}
                          {asset.arch !== "all" && (
                            <span className="font-mono text-xs text-muted-foreground">
                              {asset.arch}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <TypeIcon className="size-4" />
                          {asset.label ? t(`types.${asset.label}`) : t(`types.${type}`)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                        {asset.date ?? release.released}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <a
                            href={assetUrl(release.channel, asset)}
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary transition-colors hover:text-primary/80"
                          >
                            <Download className="size-3" />
                            {asset.filename}
                          </a>
                          <pre className="max-w-full overflow-x-auto whitespace-nowrap rounded bg-[#181825] px-2 py-1 font-mono text-[10px] text-[#a6e3a1]">
                            {showHash ? asset.checksum : t("noHash")}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function AllVersions({ releases }: { releases: ReleaseFile[] }) {
  const t = useTranslations("allVersions");
  const [visible, setVisible] = useState(CHUNK);
  const [open, setOpen] = useState<string[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visible < releases.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + CHUNK, releases.length));
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, releases.length]);

  const toggle = useCallback((key: string) => {
    setOpen((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key],
    );
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {releases.slice(0, visible).map((release) => {
        const key = `${release.channel}-${release.version}`;
        return (
          <VersionAccordion
            key={key}
            release={release}
            open={open.includes(key)}
            onToggle={() => toggle(key)}
          />
        );
      })}

      <div ref={sentinelRef} className="h-px" aria-hidden />

      {hasMore ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {t("loadMore")}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-muted-foreground">
          {t("noMore")}
        </div>
      )}
    </div>
  );
}
