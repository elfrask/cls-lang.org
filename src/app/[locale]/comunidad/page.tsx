import { getTranslations, setRequestLocale } from "next-intl/server";
import { Github, MessageCircle, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const COMMUNITY = [
  {
    key: "github",
    href: "https://github.com/elfrask/cls",
    icon: Github,
  },
  {
    key: "discord",
    href: "https://discord.gg/xfTeTNSfsd",
    icon: MessageCircle,
  },
] as const;

export default async function CommunityPage({
  params,
}: PageProps<"/[locale]/comunidad">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "community" });

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-20 pt-16 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl glass text-primary">
          <Github className="size-7" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      <div className="mx-auto mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        {COMMUNITY.map((social, i) => {
          const Icon = social.icon;
          return (
            <Reveal key={social.key} delay={i * 0.08}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="block h-full"
              >
                <Card className="h-full border-border/60 bg-card/40 transition-colors hover:bg-card/70">
                  <CardHeader>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg glass text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="flex items-center gap-1.5 font-mono text-base">
                      {t(`${social.key}.name`)}
                      <ArrowUpRight className="size-3.5 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {t(`${social.key}.description`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs text-muted-foreground">
                      {social.href}
                    </span>
                  </CardContent>
                </Card>
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
