deno-buckets 🦕🪣
=================

Asset bundler for [Deno](https://deno.land) apps

---

:fire: **HEADS UP!** This is a work in progress, it's undocumented, API may change and it's probably buggy. Use it at your own risk

---

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
      removeExts: true
    },
    {
      name: "data",
      folder: "countries",
      exts: [".txt"]
    }
  ],
  output: "app.bundle.js"
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
//     "country-info": ".....",
//     "other-info": ".....",
//     ...
//   },
//   data: {
//     "capitals.txt": ".....",
//     "population.txt": ".....",
//     ...
//   }
// }
```



**bundler.ts:**

```typescript
import conf from "./buckets.ts";
import { bundle } from "https://raw.githubusercontent.com/jacoborus/deno-buckets/main/mod.ts";

bundle(conf);
```

## TODO

- [ ] Remove extensions
- [ ] Custom decoders
- [ ] Docs
- [ ] Tests
- [ ] Version
- [ ] Release
