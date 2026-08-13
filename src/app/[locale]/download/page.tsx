import { setRequestLocale } from "next-intl/server";
import { DownloadContent } from "@/components/download/download-content";
import { getCurrentVersion } from "@/lib/releases";

export const dynamic = "force-dynamic";

export default async function DownloadPage({
  params,
}: PageProps<"/[locale]/download">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DownloadContent locale={locale} release={getCurrentVersion()} />;
}