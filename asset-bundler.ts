import { BundlerOptions, getTree } from "./common.ts";

export async function bundle(options: BundlerOptions) {
  const tree = getTree(options);
  const content = (await Deno.emit(options.entry, { bundle: "module" })).files[
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
