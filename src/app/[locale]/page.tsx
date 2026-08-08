import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Pipeline } from "@/components/home/pipeline";
import { Stdlib } from "@/components/home/stdlib";
import { Cta } from "@/components/home/cta";

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Features />
      <Pipeline />
      <Stdlib />
      <Cta />
    </>
  );
}
