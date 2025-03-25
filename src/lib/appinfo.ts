import apps from "apps.json";

export const CATEGORY_LIST = apps.tools;
export const APP_LIST = apps.tools.flatMap(e => e.apps);
export const INDEX_INFO = apps.index;
export const getAppInfo = (slug: string) => APP_LIST.find(e => e.slug === slug);
