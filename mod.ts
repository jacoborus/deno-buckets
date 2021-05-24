import { BundleOptions, Store, getStore } from "./common.ts";

declare global {
  interface Window {
    ASSETS_FS: Record<string, Store>;
  }
}

const isCompiled = Deno.mainModule === "file://$deno$/bundle.js";
const isBundled = !isCompiled && !!window.ASSETS_FS;
const isDev = !isCompiled && !isBundled;

export function loadBuckets(options: BundleOptions): Store {
  return isDev
    ? Object.freeze(getStore(options))
    : window.ASSETS_FS[options.key];
}
