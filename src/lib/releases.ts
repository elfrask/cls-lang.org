import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type AssetType =
  | "paquete"
  | "instalador"
  | "portable"
  | "enlace"
  | "ejecutable-sdk"
  | "ejecutable-runtime"
  | "binding-c"
  | "binding-python"
  | "binding-js";

export type ReleaseAsset = {
  filename: string;
  platform: string;
  arch: string;
  format?: string;
  type?: AssetType;
  label?: string;
  size?: string;
  date?: string;
  url: string;
  checksum?: string;
};

export type ReleaseVersion = {
  version: string;
  channel: "release" | "dev";
  released: string;
  notes?: string;
  highlights?: string[];
  blog?: string;
  comingSoon?: boolean;
};

export type ReleaseFile = ReleaseVersion & {
  assets: ReleaseAsset[];
};

const RELEASES_DIR = join(process.cwd(), "src", "data", "releases");

export function getReleaseIndex(): ReleaseVersion[] {
  const raw = readFileSync(join(RELEASES_DIR, "index.json"), "utf8");
  return JSON.parse(raw).versions as ReleaseVersion[];
}

export function getReleaseFile(
  channel: "release" | "dev",
  version: string,
): ReleaseFile | undefined {
  const filePath = join(RELEASES_DIR, channel, `${version}.json`);
  if (!existsSync(filePath)) return undefined;
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw) as ReleaseFile;
}

export function getAllReleases(): ReleaseFile[] {
  const index = getReleaseIndex();
  return index
    .filter((v) => !v.comingSoon)
    .map((v) => getReleaseFile(v.channel, v.version))
    .filter((r): r is ReleaseFile => Boolean(r))
    .sort((a, b) => compareVersions(b.version, a.version));
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(/[.\-_]/);
  const pb = b.split(/[.\-_]/);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const sa = pa[i] ?? "";
    const sb = pb[i] ?? "";
    const na = Number(sa);
    const nb = Number(sb);
    const aNum = sa !== "" && Number.isFinite(na);
    const bNum = sb !== "" && Number.isFinite(nb);
    if (aNum && bNum) {
      if (na !== nb) return na - nb;
    } else if (aNum !== bNum) {
      return aNum ? 1 : -1;
    } else if (sa !== sb) {
      return sa < sb ? -1 : 1;
    }
  }
  return 0;
}

export function getCurrentVersion(): ReleaseFile | undefined {
  const index = getReleaseIndex();
  const top = [...index].sort((a, b) =>
    compareVersions(b.version, a.version),
  )[0];
  if (!top) return undefined;
  return getReleaseFile(top.channel, top.version);
}

export function getReleaseByVersion(
  version: string,
): ReleaseFile | undefined {
  const index = getReleaseIndex();
  const entry = index.find((v) => v.version === version);
  if (!entry) return undefined;
  return getReleaseFile(entry.channel, entry.version);
}

export function getReleaseByBlog(
  slug: string,
): ReleaseFile | undefined {
  const index = getReleaseIndex();
  for (const v of index) {
    if (v.comingSoon) continue;
    const file = getReleaseFile(v.channel, v.version);
    if (file?.blog === slug) return file;
  }
  return undefined;
}

export function findAssetByFilename(
  channel: "release" | "dev",
  filename: string,
): ReleaseAsset | undefined {
  const index = getReleaseIndex();
  const versions = index.filter(
    (v) => v.channel === channel && !v.comingSoon,
  );
  for (const v of versions) {
    const release = getReleaseFile(channel, v.version);
    const asset = release?.assets.find((a) => a.filename === filename);
    if (asset) return asset;
  }
  return undefined;
}

export function pickAsset(
  release: ReleaseFile,
  platform: string,
  arch: string,
): ReleaseAsset | undefined {
  const exact = release.assets.find(
    (a) => a.platform === platform && a.arch === arch,
  );
  if (exact) return exact;
  const anyArch = release.assets.find((a) => a.platform === platform);
  if (anyArch) return anyArch;
  return release.assets.find((a) => a.platform === "source");
}
