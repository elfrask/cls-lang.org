import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Github, Package, Heart } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border/60 bg-background/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-sm font-semibold">CLS</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              v2.0.0
              <span className="size-1.5 rounded-full bg-primary" />
              {t("download.stable")}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.language")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {(
                [
                  ["/docs", "nav.docs"],
                  ["/about", "nav.about"],
                  ["/download", "nav.download"],
                  ["/search", "nav.search"],
                ] as const
              ).map(([href, key]) => (
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
              <li>
                <a
                  href="https://github.com/frask/cls"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="size-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://registry.cls-lang.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Package className="size-3.5" />
                  Registry
                </a>
              </li>
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
