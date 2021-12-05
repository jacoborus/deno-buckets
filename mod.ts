export async function bundle(entry: string, outputPath?: string) {
  const { files } = await Deno.emit(entry);
  const sourcePaths = Object.keys(files).filter((path) =>
    !path.endsWith(".map")
  );

  const proms = sourcePaths.map((path) => {
    return new Promise((resolve) => {
      getContent(path, files[path]).then(resolve);
    });
  });

  const presources = await Promise.all(proms);
  const sources = Object.fromEntries(
    presources as unknown as [string, string][],
  );

  const bundles = await Deno.emit(entry, {
    sources,
    bundle: "module",
  });

  const content = bundles.files["deno:///bundle.js"];

  if (outputPath) Deno.writeTextFileSync(outputPath, content);
  else await Deno.stdout.write(new TextEncoder().encode(content));
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
