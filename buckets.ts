import { bundle } from "./mod.ts";

const helpText = `USAGE:
    buckets <source_file> [import_map_path] > out.js`;

const [target, importMap] = Deno.args;

if (!target) {
  console.log("Error: missing <source_file> param\n\n");
  console.log(helpText);
  Deno.exit(1);
}

const content = await bundle(target, importMap);

await Deno.stdout.write(new TextEncoder().encode(content));
