export async function bundle(entry: string) {
  const { files } = await Deno.emit(entry);
  const filenames = Object.keys(files)
    .map((filename) => [filename, getPath(filename)])
    .filter(([_, path]) => path);
  const proms = filenames.map(([prepath, path]) => {
    return new Promise((resolve) => {
      getContent(path, files[prepath])
        .then((content) => resolve([path, content]));
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
  Deno.writeTextFileSync("bundle.js", bundles.files["deno:///bundle.js"]);
}

function getPath(filePath: string): string {
  if (filePath.endsWith(".map")) return "";
  const name = (filePath.endsWith(".ts.js"))
    ? filePath.slice(0, filePath.length - 3)
    : filePath;
  const finalName = name.startsWith("file:///") ? name.slice(7) : name;
  return finalName;
}

async function getSource(path: string): Promise<string> {
  const data = await import(path);
  return `export default ${JSON.stringify(data.default)}`;
}

async function getContent(path: string, str: string): Promise<string> {
  if (!path.startsWith("/")) return str;
  const file = Deno.readTextFileSync(path);
  if (!file.includes("is-deno-bucket")) return str;
  return await getSource(path);
}
