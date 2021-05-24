import { walkSync, WalkOptions } from "https://deno.land/std/fs/mod.ts";
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
}

export type Store = Record<string, Record<string, string>>;

declare global {
  interface Window {
    BUCKETS_FS: Record<string, Store>;
  }
}

const rootPath = Deno.mainModule.replace(/[^\/]+$/, "").slice(7);

export async function bundle(options: BundleOptions) {
  const store = getStore(options);
  const entryPath = resolve(rootPath, options.entry);
  const content = (await Deno.emit(entryPath, { bundle: "module" })).files[
    "deno:///bundle.js"
  ];
  const data = JSON.stringify(store);
  const beginning = `;window["BUCKETS_FS"]=Object.freeze({"${options.key}":${data}});\n`;
  const finalContent = beginning + content;
  if (options.output) {
    Deno.writeTextFileSync(options.output, finalContent);
  } else {
    await Deno.stdout.write(new TextEncoder().encode(finalContent));
  }
}

const isCompiled = Deno.mainModule === "file://$deno$/bundle.js";
const isDev = !isCompiled && !window.BUCKETS_FS;

export function loadBuckets(options: BundleOptions): Store {
  return isDev
    ? Object.freeze(getStore(options))
    : window.BUCKETS_FS[options.key];
}

export function getStore(options: BundleOptions): Store {
  return Object.fromEntries(
    options.buckets.map((conf) => [conf.name, getBucketData(conf)])
  );
}

function getBucketData(conf: BucketOptions): Record<string, string> {
  const bucket = {} as Record<string, string>;
  const walkConf = getWalkConf(conf);
  const folderPath = resolve(rootPath, conf.folder);
  for (const e of walkSync(folderPath, walkConf)) {
    const propName = getPropPath(folderPath, e.path);
    bucket[propName] = Deno.readTextFileSync(e.path);
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
