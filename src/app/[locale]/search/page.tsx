"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Search, PackageSearch, Database, PackagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SearchPage() {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <PackagePlus className="size-3.5 text-primary" />
            {t("status")}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl">
          <form
            className="flex gap-2 rounded-2xl glass-strong p-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="h-10 flex-1 border-0 bg-transparent focus-visible:ring-0"
            />
            <Button type="submit" size="default" className="h-10">
              <Search data-icon="inline-start" />
              {t("searchBtn")}
            </Button>
          </form>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <Reveal delay={0.15}>
            <Card className="h-full border-border/60 bg-card/40">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg glass text-primary">
                  <Database className="size-5" />
                </div>
                <CardTitle className="text-base">
                  {t("registryTitle")}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {t("registryText")}{" "}
                  <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
                    {t("registryUrl")}
                  </code>
                </CardDescription>
              </CardHeader>
            </Card>
          </Reveal>
          <Reveal delay={0.2}>
            <Card className="h-full border-border/60 bg-card/40">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg glass text-primary">
                  <Search className="size-5" />
                </div>
                <CardTitle className="text-base">{t("apiTitle")}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {t("apiText")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Reveal>
        </div>

        {query && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-12 max-w-3xl rounded-2xl glass px-8 py-14 text-center"
          >
            <PackageSearch className="mx-auto size-12 text-muted-foreground/40" />
            <h2 className="mt-4 text-lg font-semibold">{t("emptyTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("emptyText")}
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              {t("cliHint")}
            </p>
            <code className="mt-2 inline-block rounded-lg bg-[#181825] px-3 py-2 font-mono text-sm text-[#a6e3a1]">
              {t("cliCmd")}
            </code>
          </motion.div>
        )}
      </section>
    </>
  );
}
