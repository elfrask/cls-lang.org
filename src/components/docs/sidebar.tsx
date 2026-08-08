"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, BookOpen } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { docIndex } from "@/lib/docs";
import { cn } from "@/lib/utils";

function slugFromPathname(pathname: string): string {
  const base = pathname.replace(/^\/docs\/?/, "");
  return base.split("/").filter(Boolean).join("/");
}

export function DocsSidebar({ activeSlug }: { activeSlug?: string }) {
  const t = useTranslations("docs");
  const pathname = usePathname();
  const current = activeSlug ?? slugFromPathname(pathname);

  const activeSection = useMemo(
    () => docIndex.sections.find((s) =>
      s.items.some((i) => i.slug === current),
    )?.key,
    [current],
  );

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    if (activeSection) return new Set([activeSection]);
    return new Set(docIndex.sections.slice(0, 3).map((s) => s.key));
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <nav className="scrollbar-thin h-full overflow-y-auto p-3">
      <div className="mb-4 flex items-center gap-2 px-2 pt-1">
        <BookOpen className="size-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("title")}
        </span>
      </div>

      <div className="space-y-1">
        {docIndex.sections.map((section) => {
          const isActive = activeSection === section.key;
          const isOpen = openSections.has(section.key) || isActive;
          return (
            <div key={section.key}>
              <button
                onClick={() => toggle(section.key)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-muted/60 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <span className="truncate font-medium">
                  {t(`sections.${section.key}`)}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="mt-1 space-y-0.5 border-l border-border/60 pl-3">
                  {section.items.map((item) => {
                    const active = item.slug === current;
                    return (
                      <Link
                        key={item.slug}
                        href={`/docs/${item.slug}`}
                        className={cn(
                          "block truncate rounded-md px-2 py-1.5 text-[13px] transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                        )}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
