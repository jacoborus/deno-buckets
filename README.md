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
[Deno bundler](https://deno.land/manual/tools/bundler), it allows you to select source files, and then bundle their resolved exports

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
const rawData = Deno.readTextFileSync("numbers.json")
export default JSON.parse(rawData)
```

**app.ts:**

```typescript
import data from "./data.ts";
console.log(data)
```

Then run: `deno-buckets app.ts app.bundle.js` and you'll get:

**app.bundle.ts:**

```typescript
const __default = {
    "one": 1,
    "two": 2
};
console.log(__default);
```


## Usage

Add the comment `// is-deno-bucket` at the beginning of the files you want to resolve before bundling.
Then, bundle your app with **deno-buckets**.


### CLI

Install with: `deno `

```sh
deno install --allow-net --allow-read https://deno.land/x/buckets/deno-buckets.ts
```

Then run:

```sh
deno-buckets app.ts app.bundle.js
```


### API

```typescript
import bundler from "https://deno.land/x/buckets/bundler.ts"
const bundle = bundler("./app.ts")
Deno.writeTextFileSync("app.bundle.js", bundle)
```


<br>

---

© 2021 [Jacobo Tabernero Rey](http://jacoborus.codes) - Released under
[MIT License](https://raw.github.com/jacoborus/deno-buckets/main/LICENSE)
