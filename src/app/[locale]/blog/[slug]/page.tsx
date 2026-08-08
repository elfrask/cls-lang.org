import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BlogMarkdown } from "@/components/blog/blog-markdown";
import { readBlogPost, readingTime } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = readBlogPost(locale, slug);
  if (!post) notFound();

  const minutes = readingTime(post.content);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 sm:px-6">
      <Reveal>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t("backToPosts")}
        </Link>

        <div className="mt-6">
          {post.lang !== locale && (
            <p className="mb-4 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground">
              {t("notTranslated")}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {post.meta.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <time dateTime={post.meta.date}>
              {t("publishedOn", { date: post.meta.date })}
            </time>
            {post.meta.author && (
              <>
                <span aria-hidden>·</span>
                <span>{t("by", { author: post.meta.author })}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{t("readTime", { minutes })}</span>
          </div>
        </div>

        <article className="mt-8">
          <BlogMarkdown content={post.content} />
        </article>
      </Reveal>
    </section>
  );
}
