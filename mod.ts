export async function bundle(entry: string, output?: string) {
  const { files } = await Deno.emit(entry, { check: false });
  const paths = Object.keys(files).filter((path) => !path.endsWith(".map"));

  const proms = paths.map((path) =>
    new Promise((resolve) => getContent(path, files[path]).then(resolve))
  );

  const presources = await Promise.all(proms) as [string, string][];
  const sources = Object.fromEntries(presources);

  const content = (await Deno.emit(entry, {
    sources,
    bundle: "module",
  })).files["deno:///bundle.js"];

  if (output) Deno.writeTextFileSync(output, content);
  return content;
}

async function getContent(
  path: string,
  str: string,
): Promise<[string, string]> {
  const isLocal = path.startsWith("file://");
  const finalPath = getPath(path, isLocal);
  if (!isLocal) return [finalPath, str];
  const file = Deno.readTextFileSync(finalPath);
  if (!file.includes("is-deno-bucket")) return [finalPath, file];
  const content = await getSource(finalPath);
  return [finalPath, content];
}

function getPath(filePath: string, isLocal: boolean): string {
  const name = (filePath.endsWith(".ts.js"))
    ? filePath.slice(0, filePath.length - 3)
    : filePath;
  return isLocal ? name.slice(7) : name;
}

async function getSource(path: string): Promise<string> {
  const data = await import(path);
  return `export default ${JSON.stringify(data.default)}`;
}
