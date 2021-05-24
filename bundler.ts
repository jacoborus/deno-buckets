import { BundleOptions, getStore } from "./common.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";

const rootPath = Deno.mainModule.replace(/[^\/]+$/, "").slice(7);

export async function bundle(options: BundleOptions) {
  const tree = getStore(options);
  const entryPath = resolve(rootPath, options.entry);
  const content = (await Deno.emit(entryPath, { bundle: "module" })).files[
    "deno:///bundle.js"
  ];
  const data = JSON.stringify(tree);
  const beginning = `;window["ASSETS_FS"]=Object.freeze({"${options.key}":${data}});`;
  const finalContent = beginning + content;
  if (options.output) {
    Deno.writeTextFileSync(options.output, finalContent);
  } else {
    console.log(finalContent);
  }
}
