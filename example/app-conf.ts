export default {
  key: "my-key", // important to prevent clashing buckets
  entry: "app.ts",
  buckets: [
    {
      name: "data",
      folder: "cities/data",
      exts: [".yml"],
    },
    {
      name: "templates",
      folder: "mustaches",
      maxDepth: 1,
      exts: [".hbs"],
    },
  ],
  output: "bundle.js",
};
