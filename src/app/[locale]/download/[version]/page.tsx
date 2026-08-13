import { setRequestLocale } from "next-intl/server";
import { DownloadContent } from "@/components/download/download-content";
import { getReleaseByVersion } from "@/lib/releases";

export const dynamic = "force-dynamic";

export default async function DownloadVersionPage({
  params,
}: PageProps<"/[locale]/download/[version]">) {
  const { locale, version } = await params;
  setRequestLocale(locale);

  return (
    <DownloadContent locale={locale} release={getReleaseByVersion(version)} />
  );
}