import { WalkOptions, walkSync } from "https://deno.land/std/fs/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";

export interface BundleOptions {
  key: string;
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

export type Store = Record<string, Record<string, unknown>>;

declare global {
  interface Window {
    BUCKETS_FS: Record<string, Store>;
  }
}

const rootPath = Deno.mainModule.replace(/[^\/]+$/, "").slice(7);
const isCompiled = Deno.mainModule === "file://$deno$/bundle.js";

export async function bundle(options: BundleOptions) {
  const store = getStore(options);
  const entryPath = resolve(rootPath, options.entry);
  const content = (await Deno.emit(entryPath, { bundle: "module" })).files[
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

export function loadBuckets(options: BundleOptions): Store {
  return !isCompiled && !window.BUCKETS_FS?.[options.key]
    ? Object.freeze(getStore(options))
    : window.BUCKETS_FS[options.key];
}

function getStore(options: BundleOptions): Store {
  return Object.fromEntries(
    options.buckets.map((conf) => [conf.name, getBucketData(conf)]),
  );
}

function getBucketData(conf: BucketOptions): Record<string, unknown> {
  const bucket = {} as Record<string, unknown>;
  const walkConf = getWalkConf(conf);
  const folderPath = resolve(rootPath, conf.folder);
  for (const e of walkSync(folderPath, walkConf)) {
    const propName = getPropPath(folderPath, e.path);
    const finalPropName = removeExtension(propName, conf);
    bucket[finalPropName] = conf.decoder
      ? conf.decoder(Deno.readFileSync(e.path))
      : Deno.readTextFileSync(e.path);
  }
  return bucket;
}

function getWalkConf(bucketConf: BucketOptions): WalkOptions {
  const conf = {
    includeDirs: false,
  } as WalkOptions;
  if ("maxDepth" in bucketConf) conf.maxDepth = bucketConf.maxDepth;
  if ("exts" in bucketConf) conf.exts = bucketConf.exts;
  if ("match" in bucketConf) conf.match = bucketConf.match;
  if ("skip" in bucketConf) conf.skip = bucketConf.skip;
  return conf;
}

function getPropPath(folder: string, file: string): string {
  const len = folder.length - file.length + 1;
  return file.slice(len);
}

function removeExtension(name: string, conf: BucketOptions): string {
  if (!conf.trimExtensions || !conf.exts || !conf.exts.length) return name;
  const extension = conf.exts.find((ext) => name.endsWith(ext)) as string;
  const len = extension.length;
  return name.slice(0, name.length - len);
}
