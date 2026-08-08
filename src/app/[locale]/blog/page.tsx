import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import {
  readBlogIndex,
  readBlogPost,
  readingTime,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const posts = readBlogIndex(locale);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4">
        {posts.map((post, i) => {
          const full = readBlogPost(locale, post.slug);
          const minutes = full
            ? readingTime(full.content)
            : undefined;
          return (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 rounded-2xl glass p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={post.date}>{post.date}</time>
                  {minutes && (
                    <span aria-hidden>·</span>
                  )}
                  {minutes && (
                    <span>{t("readTime", { minutes })}</span>
                  )}
                </div>
                <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {t("readMore")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
