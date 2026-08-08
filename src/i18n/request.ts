import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const filePath = join(process.cwd(), "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(filePath, "utf8"));

  return {
    locale,
    messages,
  };
});
