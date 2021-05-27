import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { loadBuckets } from "./mod.ts";

Deno.test("Conf with no buckets", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    buckets: [],
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, {});
});

Deno.test("Buckets with no options", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    buckets: [
      {
        name: "books",
        folder: "example/mybooks",
      },
      {
        name: "languages",
        folder: "example/data/langs",
      },
    ],
  };
  const result = {
    languages: {
      "galician.json": '["vermello", "amarelo", "azul"]\n',
      "spanish.json": '["rojo", "amarillo", "azul"]\n',
    },
    books: {
      "1984.txt": "It was a bright cold day in April...\n",
      "quijote.txt": "En un lugar de la Mancha...\n",
    },
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, result);
});
