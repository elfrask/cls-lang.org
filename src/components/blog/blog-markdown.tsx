"use client";

import { useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Link } from "@/i18n/navigation";
import { CodeBlock } from "@/components/code-block";

function Pre({ children }: { children?: React.ReactNode }) {
  const el = children as
    | React.ReactElement<{ className?: string; children?: React.ReactNode }>
    | undefined;
  const className = el?.props?.className ?? "";
  const match = /language-([\w-]+)/.exec(className);
  const lang = match ? match[1] : undefined;
  const text = String(el?.props?.children ?? "");
  return <CodeBlock code={text} lang={lang === "plaintext" ? undefined : lang} />;
}

function A({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const external = href?.startsWith("http") || href?.startsWith("//");
  if (href && !external && href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...props}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function BlogMarkdown({ content }: { content: string }) {
  const components = useMemo(
    () => ({
      pre: Pre,
      h2: (props: ComponentPropsWithoutRef<"h2">) => (
        <h2
          className="mt-10 scroll-mt-24 border-b border-border/60 pb-2 text-2xl font-bold tracking-tight"
          {...props}
        />
      ),
      h3: (props: ComponentPropsWithoutRef<"h3">) => (
        <h3
          className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight"
          {...props}
        />
      ),
      h4: (props: ComponentPropsWithoutRef<"h4">) => (
        <h4 className="mt-6 scroll-mt-24 text-base font-semibold" {...props} />
      ),
      p: (props: ComponentPropsWithoutRef<"p">) => (
        <p className="mt-4 leading-relaxed text-foreground/90" {...props} />
      ),
      ul: (props: ComponentPropsWithoutRef<"ul">) => (
        <ul
          className="mt-4 list-disc space-y-2 pl-6 marker:text-primary/60"
          {...props}
        />
      ),
      ol: (props: ComponentPropsWithoutRef<"ol">) => (
        <ol
          className="mt-4 list-decimal space-y-2 pl-6 marker:text-primary/60"
          {...props}
        />
      ),
      li: (props: ComponentPropsWithoutRef<"li">) => (
        <li className="leading-relaxed" {...props} />
      ),
      blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
        <blockquote
          className="mt-4 rounded-r-lg border-l-4 border-primary/60 bg-primary/5 py-2 pl-4 pr-3 text-muted-foreground"
          {...props}
        />
      ),
      a: A,
      em: (props: ComponentPropsWithoutRef<"em">) => (
        <em className="italic" {...props} />
      ),
      strong: (props: ComponentPropsWithoutRef<"strong">) => (
        <strong className="font-semibold text-foreground" {...props} />
      ),
      hr: (props: ComponentPropsWithoutRef<"hr">) => (
        <hr className="my-8 border-border/60" {...props} />
      ),
    }),
    [],
  );

  return (
    <div className="text-[15px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
