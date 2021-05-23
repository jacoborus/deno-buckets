import { BundleOptions, Store, getStore } from "./common.ts";

declare global {
  interface Window {
    ASSETS_FS: Record<string, Store>;
  }
}

const isCompiled = Deno.mainModule === "file://$deno$/bundle.js";
const isBundled = !isCompiled && !!window.ASSETS_FS;
const isDev = !isCompiled && !isBundled;

export function loadBuckets(options: BundleOptions) {
  return isDev ? loadDiskBuckets(options) : loadMemBuckets(options);
}

function loadDiskBuckets(options: BundleOptions): Store {
  return Object.freeze(getStore(options));
}

function loadMemBuckets(options: BundleOptions): Store {
  return window.ASSETS_FS[options.key];
}
