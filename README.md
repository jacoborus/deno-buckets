<h1 align="center">Asset bundler for Deno apps</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/jacoborus/deno-buckets/main/example/deno-bucket-logo.svg" alt="deno-buckets logo"><br>
  <b>deno-buckets</b><br>
</p>
<p align="center">

<a href="https://doc.deno.land/https/raw.githubusercontent.com%2Fjacoborus%2Fdeno-buckets%2Fmain%2Fmod.ts">
  <img src="https://doc.deno.land/badge.svg" alt="deno doc">
</a>

<a href="https://github.com/jacoborus/deno-buckets/blob/main/LICENSE">
  <img alt="GitHub License" src="https://img.shields.io/github/license/jacoborus/deno-buckets">
</a>

<a href="https://github.com/jacoborus/deno-buckets/releases">
  <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/jacoborus/deno-buckets">
</a>
</p>

## Usage

This library exports 2 methods: `loadBuckets` and `bundle`. The first one
exposes a tree with the contents of your folders and the second one bundles the
app with all the assets. Both methods require the bundle options as unique
parameter.

**BundleOptions**:

- **key** _string_: this avoids stores clashing
- **entry** _string_: it should be in the same folder as your bundler file
- **output** _string_: if you omit this, the bundle will be sent to stdout
- **buckets** _BucketOptions[]_: a list of bucket configurations. See below

**BucketOptions**:

- **name** _string_: for future reference
- **folder** _string_: relative to the entry point of your app
- **maxDepth?** _number_: by default, there's no limit
- **exts?**: _string[]_: a list of extensions to filter in.
- **match?**: _RegExp[]_: a list of regexes to filter in
- **skip?**: _RegExp[]_: a list of regexes to filter out
- **trimExtensions?** _boolean_: remove the extension from the file name
- **decoder?** _fuction_: it uses TextDecoder by default

Arguments marked with a question mark (?) are optional

## Example

**buckets.ts:**

```typescript
export default {
  key: "my-key",
  entry: "app.ts",
  buckets: [
    {
      name: "data",
      folder: "countries",
    },
    {
      name: "mustaches",
      folder: "assets/mustaches/templates",
      exts: [".template"],
      trimExtensions: true,
    },
  ],
  output: "app.bundle.js",
};
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

await bundle(conf);
```

## TODO

- [ ] Return nicer errors
- [ ] Add generic constraints

<br>

---

© 2021 [Jacobo Tabernero Rey](http://jacoborus.codes) - Released under
[MIT License](https://raw.github.com/jacoborus/deno-buckets/main/LICENSE)
