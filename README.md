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
[Deno bundler](https://deno.land/manual/tools/bundler), it allows you to select
source files, and then bundle their resolved default exports.

## Example

**numbers.json:**

```json
{
  "one": 1,
  "two": 2
}
```

**data.ts:**

```typescript
// is-deno-bucket
const __dirname = new URL(".", import.meta.url).pathname;
const rawData = Deno.readTextFileSync(__dirname + "mydata.json");
export default JSON.parse(rawData);
```

**app.ts:**

```typescript
import data from "./data.ts";
export default data;
```

Then run: `deno-buckets app.ts` and you'll get `app.bundle.js`:

```typescript
const __default = {
  "one": 1,
  "two": 2,
};
export { __default as default };
```

## Usage

Add the comment `// is-deno-bucket` at the beginning of the files you want to
resolve before bundling. Only the `default` export will be prebundled. Then,
bundle your app with **deno-buckets**.

### CLI

Install:

```sh
deno install --unstable --allow-net --allow-read --allow-write https://deno.land/x/buckets/deno-buckets.ts
```

Run:

```sh
deno-buckets <entry_path> [destination_path]
```

### API

```typescript
import { bundle } from "https://deno.land/x/buckets/mod.ts";

const content = await bundle("./app.ts");
Deno.writeTextFileSync("app.bundle.js", content);
```

<br>

---

© 2021 [Jacobo Tabernero Rey](http://jacoborus.codes) - Released under
[MIT License](https://raw.github.com/jacoborus/deno-buckets/main/LICENSE)
