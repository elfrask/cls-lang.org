import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BlogMarkdown } from "@/components/blog/blog-markdown";
import { VersionDownloadCard } from "@/components/blog/version-download-card";
import { readBlogIndex, readBlogPost, readingTime } from "@/lib/blog";
import { getReleaseByBlog } from "@/lib/releases";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = readBlogPost(locale, slug);
  if (!post) notFound();

  const posts = readBlogIndex(locale);
  const index = posts.findIndex((p) => p.slug === slug);
  const prev = index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined;
  const next = index > 0 ? posts[index - 1] : undefined;

  const minutes = readingTime(post.content);
  const release = getReleaseByBlog(slug);

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

        {post.meta.image && (
          <figure className="mt-8">
            <img
              src={post.meta.image}
              alt={post.meta.imageAlt ?? post.meta.title}
              className="w-full rounded-2xl border border-border/60 object-cover"
            />
            {post.meta.imageCaption && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {post.meta.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <article className="mt-8">
          <BlogMarkdown content={post.content} />
        </article>

        {release && (
          <VersionDownloadCard locale={locale} release={release} />
        )}

        {(prev || next) && (
          <div className="mt-12 flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex-1 rounded-xl glass p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5" />
                  {t("prev")}
                </span>
                <span className="mt-1.5 block truncate text-sm font-medium group-hover:text-primary">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex-1 rounded-xl glass p-4 text-right transition-colors hover:border-primary/40"
              >
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  {t("next")}
                  <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-1.5 block truncate text-sm font-medium group-hover:text-primary">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}
