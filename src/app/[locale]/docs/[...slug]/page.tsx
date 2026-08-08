import { notFound } from "next/navigation";
import { getDocBySlug } from "@/lib/docs";
import { DocViewer } from "@/components/docs/doc-viewer";

export default async function DocPage({
  params,
}: PageProps<"/[locale]/docs/[...slug]">) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const doc = getDocBySlug(slugStr);

  if (!doc) notFound();

  return <DocViewer key={doc.slug} doc={doc} />;
}
