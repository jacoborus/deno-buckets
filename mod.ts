import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { resolve, basename } from "https://deno.land/std/path/mod.ts";
import { BundlerOptions } from "./common.ts";

// const ASSETS_FS_KEY = "ASSETS_FS";
// const cache = {} as Record<string, string>;

declare global {
  interface Window {
    ASSETS_FS: Record<string, Uint8Array>;
  }
}

type FileTree = Record<string, string>;

export function loadAssets(options: BundlerOptions) {
  const tree = {} as FileTree;
  options.folders.forEach((folderName) => {
    const folderPath = resolve(folderName);
    for (const e of walkSync(folderPath)) {
      if (e.isFile) {
        tree[getPropPath(folderPath, e.path)] = Deno.readTextFileSync(e.path);
      }
    }
  });
  console.log(tree);
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

// function decode(path: string): string {
//   const data = window[ASSETS_FS_KEY][path];
//   if (!path) return "";
//   const decoded = decoderUtf8.decode(data);
//   cache[path] = decoded;
//   return decoded;
// }
