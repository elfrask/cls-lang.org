import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <SearchX className="size-12 text-muted-foreground/40" />
      <p className="mt-6 font-mono text-6xl font-bold text-gradient">
        {t("title")}
      </p>
      <h1 className="mt-3 text-xl font-semibold">{t("subtitle")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("text")}</p>
      <Button variant="outline" className="mt-8" asChild>
        <Link href="/">
          <ArrowLeft data-icon="inline-start" />
          {t("backHome")}
        </Link>
      </Button>
    </div>
  );
}
