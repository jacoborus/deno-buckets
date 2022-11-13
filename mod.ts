import {
  bundle as denoBundle,
  emit,
} from "https://deno.land/x/emit@0.11.0/mod.ts";

export async function bundle(entry: string): Promise<string> {
  const files = await emit(entry);

  await Promise.all(
    Object.keys(files).map(async (path) => {
      if (!isBucket(files[path])) return;
      files[path] = await getSource(path);
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
        content: files[url],
      });
    },
  });
  const code = fileContent.code;
  const lastIndex = code.lastIndexOf("//# sourceMappingURL");
  return lastIndex ? code.slice(0, lastIndex) : code;
}

async function getSource(path: string): Promise<string> {
  const data = await import(path);
  return `export default ${JSON.stringify(data.default)}`;
}

function isBucket(content: string): boolean {
  const str = content.slice(0, 20);
  return str.includes("is-deno-bucket");
}
