import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Github, Package, MessageCircle, Heart } from "lucide-react";
import { Logo } from "@/components/logo";
import { getCurrentVersion } from "@/lib/releases";

const SITE_LINKS = [
  ["/docs", "nav.docs"],
  ["/blog", "nav.blog"],
  ["/playground", "nav.playground"],
  ["/showcase", "nav.showcase"],
  ["/comunidad", "nav.community"],
  ["/about", "nav.about"],
  ["/download", "nav.download"],
] as const;

const PROJECT_LINKS = [
  {
    href: "https://github.com/elfrask/cls",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://registry.cls-lang.org",
    label: "Registry",
    icon: Package,
  },
  {
    href: "https://discord.gg/xfTeTNSfsd",
    label: "Discord",
    icon: MessageCircle,
  },
  {
    href: "https://github.com/elfrask/cls-lang.org",
    label: "cls-lang.org",
    icon: Github,
  },
] as const;

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const current = getCurrentVersion();

  return (
    <footer className="border-t border-border/60 bg-background/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1.5fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-sm font-semibold">CLS</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              {current ? `v${current.version}` : t("download.version")}
              <span className="size-1.5 rounded-full bg-primary" />
              {current?.channel === "release"
                ? t("download.stable")
                : t("download.dev")}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.language")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {SITE_LINKS.map(([href, key]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.project")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {PROJECT_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-3.5" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li className="text-muted-foreground">{t("footer.license")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CLS. {t("footer.license")}.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            {t("footer.madeWith")}
            <Heart className="size-3.5 text-[#f38ba8]" />
            <span className="font-medium text-foreground">Next.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}