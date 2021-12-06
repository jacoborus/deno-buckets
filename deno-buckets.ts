import { basename, extname } from "https://deno.land/std@0.117.0/path/mod.ts";
import { bundle } from "./mod.ts";

const helpText = `USAGE:
    deno-buckets <source_file> [out_file]`;

const [target, destination] = Deno.args;

if (!target) {
  console.log("Error: missing <source_file> param\n\n");
  console.log(helpText);
  Deno.exit(1);
}

let finalDest = destination;
if (!finalDest) {
  const extLength = extname(target).length;
  const name = basename(target);
  const prename = name.slice(0, name.length - extLength);
  finalDest = prename + ".bundle.js";
}

const content = await bundle(target);
Deno.writeTextFileSync(finalDest, content);
