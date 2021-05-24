import { walkSync, WalkOptions } from "https://deno.land/std/fs/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";

export interface BundleOptions {
  key: string;
  entry: string;
  output?: string;
  buckets: (string | BucketOptions)[];
}

interface BucketOptions {
  name: string;
  folder: string;
  isText?: boolean;
  maxDepth?: number;
  exts?: string[];
  match?: RegExp[];
  skip?: RegExp[];
}

interface BundleConf {
  key: string;
  entry: string;
  buckets: BucketConf[];
  output: string;
}

interface BucketConf extends BucketOptions {
  path: string;
}

type BucketData = Record<string, string>;
export type Store = Record<string, BucketData>;

const rootPath = Deno.mainModule.replace(/[^\/]+$/, "").slice(7);

export function getStore(options: BundleOptions): Store {
  const conf = getBundleConf(options);
  const store = {} as Store;
  conf.buckets.forEach((bucketConf) => {
    store[bucketConf.name] = getBucketData(bucketConf);
  });
  return store;
}

function getBundleConf(options: BundleOptions): BundleConf {
  const conf = {
    key: options.key,
    entry: resolve(options.entry),
    output: getOutput(options),
    buckets: options.buckets.map((bucketOpts) => {
      return getBucketConf(bucketOpts);
    }),
  };
  return conf;
}

function getBucketData(conf: BucketConf): BucketData {
  const bucket = {} as BucketData;
  const walkConf = getWalkConf(conf);
  for (const e of walkSync(conf.path, walkConf)) {
    const propName = getPropPath(conf.path, e.path);
    bucket[propName] = Deno.readTextFileSync(e.path);
  }
  return bucket;
}

function getWalkConf(bucketConf: BucketConf): WalkOptions {
  const conf = {
    includeDirs: false,
  } as WalkOptions;
  if ("maxDepth" in bucketConf) conf.maxDepth = bucketConf.maxDepth;
  if ("exts" in bucketConf) conf.exts = bucketConf.exts;
  if ("match" in bucketConf) conf.match = bucketConf.match;
  if ("skip" in bucketConf) conf.skip = bucketConf.skip;
  return conf;
}

function getBucketConf(bucketOpts: string | BucketOptions): BucketConf {
  if (typeof bucketOpts === "string") {
    return bucketConfFromString(bucketOpts);
  } else {
    return Object.assign({}, bucketOpts, {
      path: rootPath + bucketOpts.folder,
    });
  }
}

function bucketConfFromString(folder: string): BucketConf {
  return {
    path: rootPath + folder,
    name: folder,
    folder,
  };
}

function getPropPath(folder: string, file: string) {
  const len = folder.length - file.length + 1;
  return file.slice(len);
}

function getOutput(options: BundleOptions): string {
  return options.output || options.entry.replace(/\.[^/.]+$/, ".bundle.js");
}
