import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { resolve, basename } from "https://deno.land/std/path/mod.ts";
import { BundlerOptions, FileTree } from "./common.ts";

export async function bundle(options: BundlerOptions) {
  const tree = getTree(options);
  const content = (await Deno.emit(options.entry, { bundle: "module" })).files[
    "deno:///bundle.js"
  ];
  const data = JSON.stringify(tree);
  const beginning = `;window["ASSETS_FS"]={"${options.key}": ${data}}; \n \n`;
  const finalContent = beginning + content;
  Deno.writeTextFileSync("bbb.js", finalContent);
}

function getTree(options: BundlerOptions) {
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
