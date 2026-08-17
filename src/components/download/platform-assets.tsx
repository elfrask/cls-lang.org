"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_VISIBLE = 3;

export type PlatformAssetItem = {
  label: string;
  url: string;
};

export function PlatformAssets({
  items,
  accent = false,
}: {
  items: PlatformAssetItem[];
  accent?: boolean;
}) {
  const t = useTranslations("download");
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? items : items.slice(0, MAX_VISIBLE);
  const hiddenCount = items.length - visible.length;

  return (
    <div className="mt-4 flex flex-col gap-2">
      {visible.map((item, i) => (
        <Button
          key={item.url}
          asChild
          size="sm"
          variant={accent && i === 0 ? "default" : "outline"}
        >
          <a href={item.url}>
            <Download data-icon="inline-start" />
            {item.label}
          </a>
        </Button>
      ))}

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={cn(
            "mt-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
          )}
        >
          {t(expanded ? "showLess" : "showMore", { count: hiddenCount })}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
}