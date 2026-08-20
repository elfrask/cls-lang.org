import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { BlogList, type BlogListPost } from "@/components/blog/blog-list";
import {
  readBlogIndex,
  readBlogPost,
  readingTime,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

const NEW_POST_DAYS = 5;

function isNewPost(date: string): boolean {
  const published = new Date(date + "T00:00:00Z").getTime();
  if (Number.isNaN(published)) return false;
  const elapsed = Date.now() - published;
  return elapsed >= 0 && elapsed <= NEW_POST_DAYS * 24 * 60 * 60 * 1000;
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s+/gm, " ")
    .replace(/[*_~>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export default async function BlogPage({
  params,
}: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const posts: BlogListPost[] = readBlogIndex(locale).map((post) => {
    const full = readBlogPost(locale, post.slug);
    const content = full?.content ?? "";
    return {
      slug: post.slug,
      title: full?.meta.title ?? post.title,
      date: full?.meta.date ?? post.date,
      excerpt: full?.meta.excerpt ?? post.excerpt,
      isNew: isNewPost(full?.meta.date ?? post.date),
      minutes: full ? readingTime(full.content) : undefined,
      tags: full?.meta.tags ?? post.tags,
      image: full?.meta.image,
      imageAlt: full?.meta.imageAlt,
      searchText: [
        full?.meta.title ?? post.title,
        full?.meta.excerpt ?? post.excerpt ?? "",
        full?.meta.date ?? post.date,
        full?.meta.author ?? post.author ?? "",
        stripMarkdown(content),
      ].join(" "),
    };
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      <BlogList posts={posts} />
    </section>
  );
}
