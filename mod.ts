import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { resolve, basename } from "https://deno.land/std/path/mod.ts";
import { BundlerOptions, FileTree } from "./common.ts";

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
  const tree = {} as FileTree;
  options.folders.forEach((folderName) => {
    const folderPath = resolve(folderName);
    for (const e of walkSync(folderPath)) {
      if (e.isFile) {
        tree[getPropPath(folderPath, e.path)] = Deno.readTextFileSync(e.path);
      }
    }
  });
  return getAssetFactory(tree);
}

function getAssetFactory(tree: FileTree) {
  return function (path: string): string {
    return tree[path];
  };
}

function getPropPath(folder: string, file: string) {
  const base = basename(folder);
  const len = folder.length - base.length;
  return file.slice(len);
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
