import en from "@/i18n/en.json";

export type Locale = "en";

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
};

export function t(key: string, locale: Locale = "en"): string {
  const dict = dictionaries[locale] || dictionaries.en;
  return dict[key] ?? key;
}


