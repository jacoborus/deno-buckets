import bucketsConf from "./app-conf.ts";
import { loadBuckets } from "../mod.ts";

export const buckets = loadBuckets(bucketsConf);
console.log(buckets);
