import { useTranslations } from "next-intl";
import {
  Sparkles,
  Cpu,
  Feather,
  Globe,
  Package,
  FileCode2,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  { key: "facil", icon: Sparkles },
  { key: "binario", icon: Cpu },
  { key: "ligero", icon: Feather },
  { key: "multiplataforma", icon: Globe },
  { key: "modules", icon: Package },
  { key: "cmx", icon: FileCode2 },
] as const;

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/40 transition-all duration-300 hover:border-primary/40 hover:bg-card/60">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/10 blur-2xl" />
      </div>
      <CardHeader>
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg glass text-primary">
          <Icon className="size-5" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function Features() {
  const t = useTranslations("features");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.key} delay={i * 0.06}>
            <FeatureCard
              icon={feature.icon}
              title={t(`${feature.key}.title`)}
              description={t(`${feature.key}.description`)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
