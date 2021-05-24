import { walkSync, WalkOptions } from "https://deno.land/std/fs/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";

export interface BundleOptions {
  key: string;
  entry: string;
  buckets: BucketOptions[];
  output?: string;
}

interface BucketOptions {
  name: string;
  folder: string;
  maxDepth?: number;
  exts?: string[];
  match?: RegExp[];
  skip?: RegExp[];
}

export type Store = Record<string, Record<string, string>>;

const rootPath = Deno.mainModule.replace(/[^\/]+$/, "").slice(7);

export function getStore(options: BundleOptions): Store {
  const store = {} as Store;
  options.buckets.forEach((bucketConf) => {
    store[bucketConf.name] = getBucketData(bucketConf);
  });
  return store;
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
