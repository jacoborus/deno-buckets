export default {
  key: "my-key", // important to prevent clashing buckets
  entry: "app.ts",
  buckets: [
    "cadena",
    {
      name: "data",
      folder: "cities/data",
      exts: [".yml"],
      isText: true,
    },
    {
      name: "templates",
      folder: "mustaches",
      maxDepth: 1,
      exts: [".hbs"],
      match: [/matchthis/],
      skip: [/skipthis/],
      isText: true,
    },
  ],
  output: "bundle.js",
};
