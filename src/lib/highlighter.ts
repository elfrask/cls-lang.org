import {
  createHighlighterCore,
  type HighlighterCore,
  type LanguageRegistration,
  type ThemeRegistration,
} from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import getWasmInstance from "shiki/wasm";
import clsTheme from "../../syntaxes/cls-color-theme.json";
import clsxGrammar from "../../syntaxes/clsx.tmLanguage.json";

export const CLS_LANG_ID = "clsx";
const CLS_THEME_NAME = "CLS Tipos Diferenciados";

let highlighterPromise: Promise<HighlighterCore> | null = null;

const clsLanguage: LanguageRegistration = {
  ...(clsxGrammar as unknown as LanguageRegistration),
  name: CLS_LANG_ID,
  aliases: ["clx", "ccls"],
};

const clsThemeReg: ThemeRegistration =
  clsTheme as unknown as ThemeRegistration;

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [clsThemeReg],
      langs: [
        clsLanguage,
        () => import("@shikijs/langs/bash"),
        () => import("@shikijs/langs/python"),
        () => import("@shikijs/langs/rust"),
        () => import("@shikijs/langs/c"),
        () => import("@shikijs/langs/json"),
        () => import("@shikijs/langs/typescript"),
        () => import("@shikijs/langs/javascript"),
        () => import("@shikijs/langs/toml"),
        () => import("@shikijs/langs/yaml"),
        () => import("@shikijs/langs/wasm"),
      ],
      engine: createOnigurumaEngine(getWasmInstance),
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang?: string,
): Promise<string> {
  const highlighter = await getHighlighter();
  const loaded = highlighter.getLoadedLanguages() as string[];
  const normalized = lang === "clx" || lang === "ccls" ? CLS_LANG_ID : lang;
  const target =
    normalized && loaded.includes(normalized) ? normalized : "text";
  return highlighter.codeToHtml(code, {
    lang: target,
    theme: CLS_THEME_NAME,
  });
}
