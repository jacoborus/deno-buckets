import {
  bundle as denoBundle,
  transpile,
} from "https://deno.land/x/emit@0.24.0/mod.ts";

export async function bundle(entry: string): Promise<string> {
  const files = await transpile(entry);

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

export function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);
  } catch (e) {
    return !e;
  }
  return true;
}
