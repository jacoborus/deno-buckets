interface StoreState {
  data: Record<string, string>;
  templates: Record<string, string[]>;
}

export default {
  key: "my-key",
  entry: "app.ts",
  buckets: [
    {
      name: "books",
      folder: "mybooks",
      exts: [".txt"],
      trimExtensions: true,
    },
    {
      name: "data",
      folder: "data/langs",
      exts: [".json"],
      decoder: (data: Uint8Array): string[] => {
        const text = new TextDecoder().decode(data);
        return JSON.parse(text);
      },
    },
  ],
  output: "app.bundle.js",
};
