import { BundlerOptions, FileTree, getTree } from "./common.ts";

// const cache = {} as Record<string, string>;

type VFS = Record<string, string>;
declare global {
  interface Window {
    ASSETS_FS: Record<string, VFS>;
  }
}

const isCompiled = Deno.mainModule === "file://$deno$/bundle.js";
const isBundled = !isCompiled && !!window.ASSETS_FS;
const isDev = !isCompiled && !isBundled;

export function loadAssets(options: BundlerOptions) {
  if (isDev) return loadAssetsFS(options);
  else return loadAssetsMem(options);
}

function loadAssetsFS(options: BundlerOptions) {
  const tree = getTree(options);
  return getAssetFactory(tree);
}

function getAssetFactory(tree: FileTree) {
  return function (path: string): string {
    return tree[path];
  };
}

function loadAssetsMem(options: BundlerOptions) {
  return function (path: string): string {
    return window.ASSETS_FS[options.key][path] as string;
  };
}

// function decode(path: string): string {
//   const data = window[ASSETS_FS_KEY][path];
//   if (!path) return "";
//   const decoded = decoderUtf8.decode(data);
//   cache[path] = decoded;
//   return decoded;
// }
