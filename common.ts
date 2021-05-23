import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { resolve, basename } from "https://deno.land/std/path/mod.ts";

export interface BundlerOptions {
  entry: string;
  folders: string[];
  output?: string;
  key: string;
}
export type FileTree = Record<string, string>;

export function getTree(options: BundlerOptions) {
  const tree = {} as FileTree;
  options.folders.forEach((folderName) => {
    const folderPath = resolve(folderName);
    for (const e of walkSync(folderPath)) {
      if (e.isFile) {
        tree[getPropPath(folderPath, e.path)] = Deno.readTextFileSync(e.path);
      }
    }
  });
  return tree;
}

function getPropPath(folder: string, file: string) {
  const base = basename(folder);
  const len = folder.length - base.length;
  return file.slice(len);
}
