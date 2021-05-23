deno-buckets 🦕🪣
=================

Asset bundler for [Deno](https://deno.land) apps

## Example

**app-conf.ts:**

```typescript
export default {
  key: "my-key", // important to prevent clashing buckets
  entry: "app.ts",
  buckets: {
    mustaches: {
    }
  },
  output: "estilobundle.js",
}
```
