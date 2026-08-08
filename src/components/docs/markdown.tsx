"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Link } from "@/i18n/navigation";
import { CodeBlock } from "@/components/code-block";
import { docIndex, type DocFile } from "@/lib/docs";

function slugifySeg(seg: string): string {
  return seg
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveDocSlug(fromPath: string, href: string): string | null {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) return null;

  const [target, hash] = href.split("#");
  const base = fromPath.split("/").slice(0, -1);
  const parts = target.replace(/^\//, "").split("/");
  const resolved: string[] = [];
  for (const p of parts) {
    if (p === "." || p === "") continue;
    if (p === "..") {
      resolved.pop();
      continue;
    }
    resolved.push(p);
  }
  const full = [...base, ...resolved].join("/");
  const noExt = full.replace(/\.md$/i, "");
  const segs = noExt.split("/");
  const known = docIndex.sections.some((s) => s.key === segs[0]);
  const slug = (known ? segs.slice(1) : segs).map(slugifySeg).join("/");
  return slug ? `/docs/${slug}${hash ? `#${hash}` : ""}` : null;
}

function Pre({ children }: { children?: ReactNode }) {
  const el = children as
    | ReactElement<{ className?: string; children?: ReactNode }>
    | undefined;
  const className = el?.props?.className ?? "";
  const match = /language-([\w-]+)/.exec(className);
  const lang = match ? match[1] : undefined;
  const text = String(el?.props?.children ?? "");
  return (
    <CodeBlock
      code={text}
      lang={lang === "plaintext" ? undefined : lang}
    />
  );
}

const DocFileContext = createContext<DocFile | null>(null);

function useDocFileContext() {
  return useContext(DocFileContext);
}

function A({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  const doc = useDocFileContext();
  if (href) {
    const resolved = doc ? resolveDocSlug(doc.path, href) : null;
    if (resolved) {
      return (
        <Link href={resolved} {...props}>
          {children}
        </Link>
      );
    }
  }
  const external = href?.startsWith("http");
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

export function Markdown({
  content,
  doc,
}: {
  content: string;
  doc: DocFile;
}) {
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
      table: (props: ComponentPropsWithoutRef<"table">) => (
        <div className="mt-6 overflow-x-auto">
          <table
            className="w-full overflow-hidden rounded-lg border border-border/60 text-sm"
            {...props}
          />
        </div>
      ),
      thead: (props: ComponentPropsWithoutRef<"thead">) => (
        <thead className="bg-card/60" {...props} />
      ),
      th: (props: ComponentPropsWithoutRef<"th">) => (
        <th
          className="px-4 py-2.5 text-left font-medium text-muted-foreground"
          {...props}
        />
      ),
      td: (props: ComponentPropsWithoutRef<"td">) => (
        <td className="border-t border-border/60 px-4 py-2.5" {...props} />
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
    <DocFileContext.Provider value={doc}>
      <div className="text-[15px]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </DocFileContext.Provider>
  );
}
