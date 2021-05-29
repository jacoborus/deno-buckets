import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";

import { bundle, loadBuckets } from "./mod.ts";

const optionsUrl = import.meta.url;

Deno.test("Conf with no buckets", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    optionsUrl,
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
    optionsUrl,
  };
  const result = {
    languages: {
      "galician.json": '["vermello", "amarelo", "azul"]\n',
      "spanish.json": '["rojo", "amarillo", "azul"]\n',
    },
    books: {
      "1984.txt": "It was a bright cold day in April...\n",
      "quijote.txt": "En un lugar de la Mancha...\n",
      "nobook.notxt": "this is not a book\n",
      "deep/otherbook.txt": "this is other book\n",
    },
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, result);
});

Deno.test("filter by extension and maxDepth", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    buckets: [
      {
        name: "books",
        folder: "example/mybooks",
        exts: [".txt"],
        maxDepth: 1,
      },
    ],
    optionsUrl,
  };
  const result = {
    books: {
      "1984.txt": "It was a bright cold day in April...\n",
      "quijote.txt": "En un lugar de la Mancha...\n",
    },
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, result);
});

Deno.test("trim extensions", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    buckets: [
      {
        name: "books",
        folder: "example/mybooks",
        exts: [".txt"],
        trimExtensions: true,
      },
    ],
    optionsUrl,
  };
  const result = {
    books: {
      "1984": "It was a bright cold day in April...\n",
      quijote: "En un lugar de la Mancha...\n",
      "deep/otherbook": "this is other book\n",
    },
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, result);
});

Deno.test("decoder", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    buckets: [
      {
        name: "languages",
        folder: "example/data/langs",
        decoder: (data: Uint8Array): string[] => {
          const text = new TextDecoder().decode(data);
          return JSON.parse(text);
        },
      },
    ],
    optionsUrl,
  };
  const result = {
    languages: {
      "galician.json": ["vermello", "amarelo", "azul"],
      "spanish.json": ["rojo", "amarillo", "azul"],
    },
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, result);
});

Deno.test("match", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    buckets: [
      {
        name: "languages",
        folder: "example/data/langs",
        match: [/lici/],
      },
    ],
    optionsUrl,
  };
  const result = {
    languages: {
      "galician.json": '["vermello", "amarelo", "azul"]\n',
    },
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, result);
});

Deno.test("skip", () => {
  const conf = {
    key: "my-key",
    entry: "entry.ts",
    buckets: [
      {
        name: "languages",
        folder: "example/data/langs",
        skip: [/lici/],
      },
    ],
    optionsUrl,
  };
  const result = {
    languages: {
      "spanish.json": '["rojo", "amarillo", "azul"]\n',
    },
  };
  const contents = loadBuckets(conf);
  assertEquals(contents, result);
});

Deno.test("build", async () => {
  const conf = {
    key: "my-key",
    entry: "example/app.ts",
    buckets: [
      {
        name: "test",
        folder: "example/mybooks",
        exts: [".txt"],
        match: [/1984/],
        trimExtensions: true,
      },
    ],
    optionsUrl,
    output: "test.bundle.js",
  };
  await bundle(conf);
  const result = Deno.readTextFileSync(conf.output);
  const firstLine = result.split(";")[1];
  const expected =
    'window["BUCKETS_FS"]={"my-key":Object.freeze({"test":{"1984":"It was a bright cold day in April...\\n"}})}';
  assertEquals(firstLine, expected);
});
