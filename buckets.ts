import { bundle } from "./mod.ts";

const helpText = `USAGE:
    buckets <source_file> [out_file]`;

const [target, destination] = Deno.args;

if (!target) {
  console.log("Error: missing <source_file> param\n\n");
  console.log(helpText);
  Deno.exit(1);
}

const content = await bundle(target);

if (destination) Deno.writeTextFileSync(destination, content);
else await Deno.stdout.write(new TextEncoder().encode(content));
