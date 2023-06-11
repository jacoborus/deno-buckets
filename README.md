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

Buckets is a wrapper around the native
[Deno emit](https://github.com/denoland/deno_emit), it allows you to select
source files, and then bundle their resolved default exports.

## Example

**data.ts:**

```typescript
// is-deno-bucket
export default Deno.readTextFileSync("./lorem.txt");
```

**app.ts:**

```typescript
import data from "./data.ts";
console.log(data);
```

Then run: `buckets app.ts > app.bundle.js`:

```typescript
// app.bundle.js
const __default = "Lorem ipsum dolor sit amet\n";
console.log(__default);
```

## Usage

Add the comment `// is-deno-bucket` at the beginning of the files you want to
resolve before bundling. Then, bundle your app with **deno-buckets**. Only the
`default` export will be resolved.

### CLI

Install:

```sh
deno install --allow-net --allow-read --allow-write --allow-env https://deno.land/x/buckets/buckets.ts
```

Run:

```sh
buckets <entry_path> [import_map_path] > out.js
```

Buckets will look for `deno.json` or `deno.jsonc` in the current folder. To use a different
imports map, pass it's path as the second argument

### API

```typescript
import { bundle } from "https://deno.land/x/buckets/mod.ts";

const content = await bundle("./app.ts", "deno.json");
Deno.writeTextFileSync("app.bundle.js", content);
```

<br>

---

© 2021 [Jacobo Tabernero Rey](http://jacoborus.codes) - Released under
[MIT License](https://raw.github.com/jacoborus/deno-buckets/main/LICENSE)
