import { getTranslations, setRequestLocale } from "next-intl/server";
import { SquareTerminal } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { PlaygroundClient } from "@/components/playground/playground-client";

export default async function PlaygroundPage({
  params,
}: PageProps<"/[locale]/playground">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "playground" });

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 pb-20 pt-16 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl glass text-primary">
          <SquareTerminal className="size-7" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          {t("hintText")}
        </p>
      </Reveal>

      <Reveal className="mt-10" delay={0.1}>
        <PlaygroundClient />
      </Reveal>
    </section>
  );
}