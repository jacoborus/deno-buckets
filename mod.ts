import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";

export interface BundleOptions {
  key: string;
  optionsUrl: string;
  entry: string;
  buckets: BucketOptions[];
  output?: string;
}

export interface BucketOptions {
  name: string;
  folder: string;
  maxDepth?: number;
  exts?: string[];
  match?: RegExp[];
  skip?: RegExp[];
  trimExtensions?: boolean;
  decoder?: (data: Uint8Array) => unknown;
}

interface BundleConf {
  key: string;
  baseUrl: string;
  outputUrl: string;
  entryUrl: string;
  buckets: BucketConf[];
}

interface BucketConf {
  name: string;
  folderUrl: string;
  trimExtensions?: boolean;
  decoder?: (data: Uint8Array) => unknown;
  walkConf: {
    maxDepth?: number;
    exts?: string[];
    match?: RegExp[];
    skip?: RegExp[];
  };
}

export type Store = Record<string, Record<string, unknown>>;

declare global {
  interface Window {
    BUCKETS_FS: Record<string, Store>;
  }
}

const isCompiled = Deno.mainModule === "file://$deno$/bundle.js";

function getConf(options: BundleOptions): BundleConf {
  const baseUrl = options.optionsUrl.replace(/[^\/]+$/, "").slice(7);
  const conf = {
    key: options.key,
    baseUrl,
    entryUrl: resolve(baseUrl, options.entry),
    buckets: options.buckets.map((opts) => {
      const walkConf = {} as BucketConf["walkConf"];
      if ("maxDepth" in opts) walkConf.maxDepth = opts.maxDepth;
      if ("exts" in opts) walkConf.exts = opts.exts;
      if ("match" in opts) walkConf.match = opts.match;
      if ("skip" in opts) walkConf.skip = opts.skip;
      return {
        name: opts.name,
        folderUrl: resolve(baseUrl, opts.folder),
        walkConf,
        trimExtensions: opts.trimExtensions,
        decoder: opts.decoder,
      };
    }),
  } as BundleConf;
  if ("output" in options) {
    conf.outputUrl = resolve(baseUrl, options.output as string);
  }
  return conf;
}

/**
 * Bundles entry point and buckets in a single file.
 * Bundle will be sent to stdout if options.output is missing
 */
export async function bundle(options: BundleOptions) {
  const conf = getConf(options);
  const store = getStore(conf);
  const content = (await Deno.emit(conf.entryUrl, { bundle: "module" })).files[
    "deno:///bundle.js"
  ];
  const data = JSON.stringify(store);
  const beginning =
    `;window["BUCKETS_FS"]={"${options.key}":Object.freeze(${data})};\n`;
  const finalContent = beginning + content;
  if (options.output) {
    Deno.writeTextFileSync(options.output, finalContent);
  } else {
    await Deno.stdout.write(new TextEncoder().encode(finalContent));
  }
}

/** Synchronously loads the content of the buckets */
export function loadBuckets(options: BundleOptions): Store {
  return !isCompiled && !window.BUCKETS_FS?.[options.key]
    ? Object.freeze(getStore(getConf(options)))
    : window.BUCKETS_FS[options.key];
}

function getStore(options: BundleConf): Store {
  return Object.fromEntries(
    options.buckets.map((conf) => [conf.name, getBucketData(conf)]),
  );
}

function getBucketData(conf: BucketConf): Record<string, unknown> {
  const bucket = {} as Record<string, unknown>;
  const walkConf = Object.assign({ includeDirs: false }, conf.walkConf);
  for (const e of walkSync(conf.folderUrl, walkConf)) {
    const propName = getPropPath(conf.folderUrl, e.path);
    const finalPropName = removeExtension(propName, conf);
    bucket[finalPropName] = conf.decoder
      ? conf.decoder(Deno.readFileSync(e.path))
      : Deno.readTextFileSync(e.path);
  }
  return bucket;
}

function getPropPath(folder: string, file: string): string {
  const len = folder.length - file.length + 1;
  return file.slice(len);
}

function removeExtension(name: string, conf: BucketConf): string {
  if (!conf.trimExtensions || !conf.walkConf.exts?.length) {
    return name;
  }
  const extension = conf.walkConf.exts.find((ext) => name.endsWith(ext)) || "";
  const len = extension.length;
  return name.slice(0, name.length - len);
}
