import { setRequestLocale } from "next-intl/server";
import { DocsShell } from "@/components/docs/docs-shell";

export default async function DocsLayout({
  children,
  params,
}: LayoutProps<"/[locale]/docs">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DocsShell>{children}</DocsShell>;
}
