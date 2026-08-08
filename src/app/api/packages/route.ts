import type { NextRequest } from "next/server";

export type PackageInfo = {
  name: string;
  version: string;
  platform?: string[];
};

const PLACEHOLDER_PACKAGES: PackageInfo[] = [
  { name: "core", version: "2.0-dev1" },
  { name: "math", version: "2.0-dev1" },
  { name: "json", version: "2.0-dev1" },
  { name: "async", version: "2.0-dev1" },
  { name: "fs", version: "2.0-dev1" },
  { name: "http", version: "2.0-dev1" },
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").toLowerCase();

  const results = q
    ? PLACEHOLDER_PACKAGES.filter((p) => p.name.includes(q))
    : PLACEHOLDER_PACKAGES;

  return Response.json({
    registry: "registry.cls-lang.org",
    status: "preview",
    count: results.length,
    packages: results,
  });
}
