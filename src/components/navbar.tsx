"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/docs", key: "nav.docs" },
  { href: "/blog", key: "nav.blog" },
  { href: "/showcase", key: "nav.showcase" },
  { href: "/comunidad", key: "nav.community" },
  { href: "/about", key: "nav.about" },
  { href: "/search", key: "nav.search" },
  { href: "/download", key: "nav.download" },
] as const;

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-sm font-semibold tracking-tight">CLS</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-muted/60 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <Button variant="ghost" size="icon-sm" asChild aria-label="GitHub">
            <a
              href="https://github.com/elfrask/cls"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="size-4" />
            </a>
          </Button>
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/docs">
              {t("nav.getStarted")}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted/60 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <Button size="sm" asChild className="mt-2">
              <Link href="/docs" onClick={() => setOpen(false)}>
                {t("nav.getStarted")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
