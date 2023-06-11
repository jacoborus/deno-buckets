import {
  bundle as denoBundle,
  transpile,
} from "https://deno.land/x/emit@0.24.0/mod.ts";
import { resolve } from "https://deno.land/std@0.191.0/path/mod.ts";

export async function bundle(
  entry: string,
  importMap?: string,
): Promise<string> {
  const imap = getImportMap(importMap);

  const files = await transpile(entry, {
    importMap: imap,
  });

  await Promise.all(
    Object.keys(files).map(async (path) => {
      if (!isBucket(files.get(path) as string)) return;
      const content = await getSource(path);
      files.set(path, content);
    }),
  );

  const fileContent = await denoBundle(entry, {
    compilerOptions: {
      sourceMap: false,
    },
    async load(url: string) {
      return await Promise.resolve({
        kind: "module",
        specifier: url,
        content: files.get(url) as string,
      });
    },
    importMap: imap,
  });

  const code = fileContent.code;
  const lastIndex = code.lastIndexOf("//# sourceMappingURL");
  return lastIndex ? code.slice(0, lastIndex) : code;
}

function isBucket(content: string): boolean {
  const str = content.slice(0, 20);
  return str.includes("is-deno-bucket");
}

async function getSource(path: string): Promise<string> {
  const data = await import(path);
  return `export default ${JSON.stringify(data.default)}`;
}

function getImportMap(path?: string) {
  if (!path) {
    const json = resolve("deno.json");
    if (existsSync(json)) return JSON.parse(Deno.readTextFileSync(json));
    const jsonc = resolve("deno.jsonc");
    if (existsSync(jsonc)) return JSON.parse(Deno.readTextFileSync(jsonc));
    return;
  }
  return JSON.parse(Deno.readTextFileSync(resolve(path)));
}

function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);
  } catch (e) {
    return !e;
  }
  return true;
}
