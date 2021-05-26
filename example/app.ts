import bucketsConf from "./buckets.ts";
import { loadBuckets } from "../mod.ts";

const buckets = loadBuckets(bucketsConf);
console.log(buckets);
