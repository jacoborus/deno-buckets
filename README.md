deno-buckets 🦕🪣
=================

Asset bundler for [Deno](https://deno.land) apps

## Example

**buckets.ts:**

```typescript
export default {
  key: "my-key",
  entry: "app.ts",
  buckets: [
    {
      name: "mustaches",
      folder: "assets/mustaches/templates",
      exts: [".hbs"],
    },
    {
      name: "data",
      folder: "countries",
      exts: [".json"]
    }
  ],
  output: "app.bundle.js",
}
```

**app.ts:**

```typescript
import { loadBuckets } from "https://raw.githubusercontent.com/jacoborus/deno-buckets/main/mod.ts";
import bucketsConf from "./buckets.ts";

const buckets = loadBuckets(bucketsConf);
console.log(buckets);
// {
//   mustaches: {
//     "country-info.hbs": ".....",
//     "other-info.hbs": ".....",
//     ...
//   },
//   data: {
//     "capitals.json": ".....",
//     "population.json": ".....",
//     ...
//   }
// }
```



**bundler.ts:**

```typescript
import conf from "./app-conf.ts";
import { bundle } from "../mod.ts";

bundle(conf);
```


