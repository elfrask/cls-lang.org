"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-muted-foreground"
          aria-label="Switch language"
        >
          <Globe className="size-3.5" />
          <span className="text-xs uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() =>
              router.replace(pathname, { locale: l.code })
            }
          >
            {l.label}
            {locale === l.code && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
